"""Record the read-aloud voices.

Turns every line in tools/lines.json into speech with the open-source Kokoro voice model, joins each page's lines
into one sound file (audio/<page>.mp4) and writes src/clips.js, which tells the game where each line starts and ends.

So that it sounds like someone telling a story, not a list of sentences:
- the storyteller reads each paragraph whole, spoken words included, and her parts are then cut out of that reading,
  so "says Blink" is said the way it sounds after a line of speech, not as a sentence of its own;
- each character speaks their own lines, and a riddle is recited in one go by whoever asks it;
- every full stop and comma gets a breath (the voice model on its own runs sentences together).

Needs: pip install kokoro-onnx soundfile scipy onnx; ffmpeg; and the two Kokoro model files (kokoro-v1.0.onnx,
voices-v1.0.bin from github.com/thewh1teagle/kokoro-onnx/releases, tag model-files-v1.0) in the folder named by KOKORO_DIR.
Run:  python3 tools/build.py && node tools/lines.js && python tools/record.py && python3 tools/build.py
Readings are kept in RECORD_CACHE, so only new or changed paragraphs are spoken again.
"""
import hashlib, json, os, re, subprocess, sys, time
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.environ.get('KOKORO_DIR', '/home/claude/tts/model')
CACHE = os.environ.get('RECORD_CACHE', '/home/claude/tts/cache')
SR = 24000

# who: (Kokoro voice, speed, pitch).  Pitch above 1 makes a smaller, lighter creature; below 1 a bigger, deeper one.
# The storyteller is slow on purpose: about 135 words a minute, a bedtime pace. Characters are slowed a little too (PACE).
VOICES = {
    'narrator': ('af_heart', 0.82, 1.0), 'you': ('af_heart', 0.86, 1.0),
    'blink': ('am_puck', 1.06, 1.2), 'ella': ('bf_emma', 0.86, 0.9), 'sharky': ('am_fenrir', 1.08, 0.97),
    'glow': ('bf_lily', 0.8, 1.08), 'tree': ('am_onyx', 0.8, 0.87), 'keeper': ('bf_emma', 0.9, 1.02),
    'clockmouse': ('bm_daniel', 1.1, 1.2), 'mouse': ('af_sarah', 1.1, 1.22), 'star': ('af_sky', 0.98, 1.24),
    'clock': ('bm_george', 0.8, 0.87), 'bookworm': ('bm_fable', 0.9, 1.06), 'book': ('af_nicole', 0.86, 0.92),
    'wind': ('af_nicole', 0.8, 1.08), 'fox': ('af_bella', 1.0, 1.0), 'cub': ('af_nova', 1.1, 1.25),
    'snowhare': ('bf_alice', 1.1, 1.1), 'hare': ('af_aoede', 1.2, 1.12), 'owl': ('bf_isabella', 0.86, 0.92),
    'hedgehog': ('am_liam', 1.0, 1.15), 'spider': ('af_river', 0.9, 1.18), 'turtle': ('bm_george', 0.72, 0.94),
    'tortoise': ('am_santa', 0.72, 0.92), 'frog': ('af_kore', 1.0, 0.86), 'toad': ('am_adam', 0.92, 0.85),
    'duck': ('af_sarah', 1.08, 1.14), 'cousin': ('af_sky', 1.12, 1.08), 'otter': ('am_echo', 1.14, 1.08),
    'bat': ('af_jessica', 1.08, 1.2), 'well': ('af_heart', 0.8, 0.92), 'snail': ('am_michael', 0.7, 1.04),
    'gnome': ('am_santa', 0.95, 1.12), 'scarecrow': ('am_adam', 0.9, 0.96), 'beetle': ('am_eric', 1.15, 1.2),
    'carp': ('af_kore', 0.9, 1.05), 'crayfish': ('am_fenrir', 1.15, 1.06), 'catfish': ('bm_lewis', 0.85, 0.85),
    'moss': ('af_alloy', 0.9, 0.9), 'grub': ('am_liam', 0.85, 1.1), 'badger': ('am_michael', 0.9, 0.88),
    'heron': ('bm_fable', 0.85, 0.94), 'rooster': ('am_eric', 1.05, 1.05), 'sparrow': ('af_aoede', 1.22, 1.25),
    'raccoon': ('af_bella', 1.08, 1.06), 'cuckoo': ('bf_alice', 1.15, 1.22), 'moth': ('af_nicole', 0.8, 1.0),
    'cricket': ('bm_daniel', 1.15, 1.22), 'moon': ('bf_isabella', 0.8, 1.0),
}
ECHO = {'well'}   # the well answers like an echo
PACE = 0.9        # every character speaks this much slower than the speed above

# Words the voice engine would say wrong, spelled the way they should sound.
RESPELL = [(r'\bMaven\b', 'Mayven'), (r'\bHmph\b', 'Humph'), (r'\bWhooo\b', 'Hoo'),
           (r'\bopen and close\b', 'open and cloze'), (r'\bI close when\b', 'I cloze when'),
           (r'\bfish close their\b', 'fish cloze their'), (r'\bYou close your\b', 'You cloze your')]
# Sounds to swap once the engine has worked out how to say a line: (lines this applies to, wrong sound, right sound).
SOUNDS = [(r'\b[Ss]hh\b', '\u02cc\u025bs\u02cce\u026at\u0283\u02c8e\u026at\u0283', '\u0283\u02d0\u02d0'),   # "shh" is a hush, not the letters S-H-H
          (r'\blives\b', 'l\u02c8a\u026avz', 'l\u02c8\u026avz'),                # "lives in a log", not "nine lives"
          (r'\bwinds it\b', 'w\u02c8\u026andz', 'w\u02c8a\u026andz'),            # winds a clock
          (r'\bDove\b', 'd\u02c8o\u028av', 'd\u02c8\u028cv'), (r'\bDove\b', 'd\u02c8\u0259\u028av', 'd\u02c8\u028cv'),   # the bird, not "dived"
          (r'\bDove bows\b', 'b\u02c8o\u028az', 'b\u02c8a\u028az'), (r'\bDove bows\b', 'b\u02c8\u0259\u028az', 'b\u02c8a\u028az')]   # takes a bow

def sounds_for(text, lang):
    """The sounds (phonemes) for a piece of text, with the corrections above applied."""
    said = text.replace('\u2019', "'")
    for pat, to in RESPELL: said = re.sub(pat, to, said)
    phones = engine().tokenizer.phonemize(said, lang)
    for pat, wrong, right in SOUNDS:
        if re.search(pat, text): phones = phones.replace(wrong, right)
    return ' '.join(phones.split())

_k = None
def engine():
    """The voice model, in a copy that also reports when each sound is spoken (made once from the downloaded model)."""
    global _k
    if _k is None:
        from kokoro_onnx import Kokoro
        timed = os.environ.get('KOKORO_TIMED', os.path.join(os.path.dirname(MODEL.rstrip('/')), 'timed', 'kokoro-v1.0-timed.onnx'))
        if not os.path.exists(timed):
            import onnx
            from onnx import helper, TensorProto
            m = onnx.load(os.path.join(MODEL, 'kokoro-v1.0.onnx')); g = m.graph
            feeds = {}
            for n in g.node:
                for i in n.input: feeds.setdefault(i, []).append(n)
            rnd = [n for n in g.node if n.op_type == 'Round']; assert len(rnd) == 1
            clip = feeds[rnd[0].output[0]][0]; cast = feeds[clip.output[0]][0]
            assert (clip.op_type, cast.op_type) == ('Clip', 'Cast')
            g.node.append(helper.make_node('Identity', [cast.output[0]], ['duration'], name='duration_out'))
            g.output.append(helper.make_tensor_value_info('duration', TensorProto.INT64, None))
            os.makedirs(os.path.dirname(timed), exist_ok=True); onnx.save(m, timed)
        _k = Kokoro(timed, os.path.join(MODEL, 'voices-v1.0.bin'))
        assert _k.has_timings
    return _k

def key(who, text):
    """Same sum as key() in src/voice.js."""
    h = 2166136261
    for ch in who + '|' + text:
        h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return np.base_repr(h, 36).lower()

def trim(a, floor=0.012):
    loud = np.flatnonzero(np.abs(a) > floor)
    if not len(loud): return a[:1]
    a = a[max(0, loud[0] - 480): loud[-1] + 1200].copy()
    n = min(120, len(a) // 2)
    a[:n] *= np.linspace(0, 1, n); a[-n:] *= np.linspace(1, 0, n)
    return a

ENDS = '.!?…'

def read(who, text):
    """One reading of a piece of text in one voice: (sound, [(phoneme, start, end)]), with a breath after each sentence and comma."""
    voice, speed, pitch = VOICES[who]
    lang = 'en-gb' if voice[0] == 'b' else 'en-us'
    phones = sounds_for(text, lang)
    if who in ('narrator', 'you'): rate, stop, comma = speed, 0.75, 0.24          # a breath after each sentence, a beat at each comma
    else: speed *= PACE; rate, stop, comma = speed / pitch, round(0.5 / speed, 2), round(0.16 / speed, 2)
    tag = hashlib.sha1(json.dumps(['v2', voice, rate, stop, comma, phones]).encode()).hexdigest()
    path = os.path.join(CACHE, tag + '.npz')
    if os.path.exists(path):
        z = np.load(path); return z['a'], list(zip([str(x) for x in z['p']], z['s'].tolist(), z['e'].tolist()))
    a, sr, spoken = engine().create_timed(phones, voice=voice, speed=rate, lang=lang, is_phonemes=True, trim=False, sentence_pause=stop, clause_pause=comma)
    assert sr == SR and spoken
    a = np.asarray(a, dtype=np.float32)
    tmp = path + '.%d.tmp.npz' % os.getpid()
    np.savez(tmp, a=a, p=np.array([t.phoneme for t in spoken]), s=np.array([t.start for t in spoken]), e=np.array([t.end for t in spoken]))
    os.replace(tmp, path)
    return a, [(t.phoneme, t.start, t.end) for t in spoken]

def quiet_cut(a, at):
    """The middle of the pause nearest to time `at` (seconds), so a cut never lands inside a word."""
    f = 240; n = len(a) // f
    if not n: return 0
    loud = np.sqrt((a[:n * f].reshape(n, f) ** 2).mean(1)); still = loud <= loud.max() * 10 ** (-35 / 20)
    c = int(at * SR) // f; best = None
    i = max(0, c - 30)
    while i < min(n, c + 31):
        if still[i]:
            j = i
            while j + 1 < n and still[j + 1]: j += 1
            if j - i + 1 >= 4:
                mid = (i + j + 1) / 2
                if best is None or abs(mid - c) < abs(best - c): best = mid
            i = j + 1
        else: i += 1
    return int((best if best is not None else c) * f)

def odd_pace(lines, spans):
    """True if some piece is far too long or short for its words: a sign that a cut landed in the wrong pause."""
    rates = [len(l['text']) / max(1, e - s) for l, (s, e) in zip(lines, spans)]
    whole = sum(len(l['text']) for l in lines) / max(1, sum(e - s for s, e in spans))
    return any((r < whole * 0.45 or r > whole * 2.4) and len(l['text']) > 8 for l, r in zip(lines, rates))

APART = [0]
def apart(lines):
    APART[0] += 1
    return [alone(l) for l in lines]

def finish(who, a):
    """Tidy one cut-out line: trim it, give the character their size, and make every voice about as loud as the next."""
    voice, speed, pitch = VOICES[who]
    a = trim(a)
    if pitch != 1.0:
        from scipy.signal import resample
        a = resample(a, max(1, int(round(len(a) / pitch)))).astype(np.float32)
    rms = float(np.sqrt(np.mean(a ** 2))) or 1.0
    a = a * (0.085 / rms)
    peak = float(np.abs(a).max())
    if peak > 0.97: a = a * (0.97 / peak)
    if who in ECHO:
        out = np.zeros(len(a) + SR, dtype=np.float32); out[:len(a)] += a * 0.8
        for d, g in ((0.26, 0.42), (0.52, 0.2), (0.78, 0.09)):
            s = int(d * SR); out[s:s + len(a)] += a[:len(out) - s] * g
        a = out
    return a.astype(np.float32)

def alone(ln):
    a, _ = read(ln['who'], ln['text'])
    return finish(ln['who'], a)

def recite(lines):
    """Several lines by one voice, read in one go (a riddle, a list of answers) and cut apart again at the sentence ends."""
    if len(lines) == 1: return [alone(lines[0])]
    who = lines[0]['who']; voice = VOICES[who][0]; lang = 'en-gb' if voice[0] == 'b' else 'en-us'
    need = [len(re.findall('[' + ENDS + ']+', sounds_for(l['text'], lang))) for l in lines]
    a, spoken = read(who, ' '.join(l['text'] for l in lines))
    ends = [m.end() - 1 for m in re.finditer('[' + ENDS + ']+', ''.join(p for p, _, _ in spoken))]
    if min(need) < 1 or len(ends) != sum(need) or len(''.join(p for p, _, _ in spoken)) != len(spoken): return [alone(l) for l in lines]
    cuts, n = [0], 0
    for k in need[:-1]:
        n += k; cuts.append(quiet_cut(a, spoken[ends[n - 1]][2]))
    cuts.append(len(a))
    spans = [(cuts[i], cuts[i + 1]) for i in range(len(lines))]
    if any(e - s < 0.15 * SR for s, e in spans) or odd_pace(lines, spans): return apart(lines)   # a cut went wrong: say the lines one by one
    return [finish(who, a[cuts[i]:cuts[i + 1]]) for i in range(len(lines))]

def paragraph(lines):
    """One paragraph. The storyteller reads all of it, speech included, so her words keep the tune of the whole
    sentence; her parts are cut out at the speech marks, and each character then says their own words."""
    if all(l['who'] != 'narrator' for l in lines) and all(l['who'] != 'you' for l in lines): return [alone(l) for l in lines]
    if len(lines) == 1: return [alone(lines[0])]
    text = ' '.join(l['text'] if l['who'] == 'narrator' else '"' + l['text'] + '"' for l in lines)
    a, spoken = read('narrator', text)
    marks = [i for i, (p, _, _) in enumerate(spoken) if p == '"']
    if len(marks) != 2 * sum(1 for l in lines if l['who'] != 'narrator'): return [alone(l) for l in lines]
    spans, q, at = [], 0, 0
    for i, l in enumerate(lines):
        if l['who'] == 'narrator':
            end = quiet_cut(a, (spoken[marks[q]][1] + spoken[marks[q]][2]) / 2) if q < len(marks) else len(a)
            spans.append((at, end)); at = end
        else:
            start = quiet_cut(a, (spoken[marks[q]][1] + spoken[marks[q]][2]) / 2)
            end = quiet_cut(a, (spoken[marks[q + 1]][1] + spoken[marks[q + 1]][2]) / 2) if i < len(lines) - 1 else len(a)
            spans.append((start, end)); at = end; q += 2
    if any(e - s < 0.15 * SR for s, e in spans) or odd_pace(lines, spans): return apart(lines)   # a cut went wrong: say the parts one by one
    # "you" are the listener: the storyteller says your words herself, in the flow of the paragraph
    return [finish('narrator', a[s:e]) if l['who'] in ('narrator', 'you') else alone(l) for l, (s, e) in zip(lines, spans)]

def kind(mark): return mark.rstrip('0123456789')

def gap(prev, ln):
    """The pause before a line, in seconds."""
    if prev is None: return 0
    a, b = kind(prev['mark']), kind(ln['mark'])
    if ln['mark'] == prev['mark'] and a in 'ta':                       # inside one paragraph
        if ln['who'] == 'narrator': return 0.1 if ln['text'][:1].islower() else 0.4    # "says Blink" follows at once
        return 0.24 if prev['who'] == 'narrator' else 0.45
    if b == 'h': return 0.9
    if a == b and a in 'ta': return 1.0                               # next paragraph
    if a == b == 'l': return 0.8                                      # next line of a riddle
    if a == b and a in 'ow': return 0.4                               # next choice
    return 1.1                                                         # a new part of the page

def page_sound(lines):
    """Every line of a page as sound, in order."""
    out, i = [], 0
    while i < len(lines):
        m, k = lines[i]['mark'], kind(lines[i]['mark']); j = i + 1
        if k in 'ta':
            while j < len(lines) and lines[j]['mark'] == m: j += 1
            out += paragraph(lines[i:j])
        elif k in 'low':
            while j < len(lines) and kind(lines[j]['mark']) == k and lines[j]['who'] == lines[i]['who']: j += 1
            out += recite(lines[i:j])
        else: out.append(alone(lines[i]))
        i = j
    return out

def main():
    only = set(sys.argv[1].split(',')) if len(sys.argv) > 1 else None
    pages = json.load(open(os.path.join(ROOT, 'tools', 'lines.json'), encoding='utf-8'))
    os.makedirs(CACHE, exist_ok=True); os.makedirs(os.path.join(ROOT, 'audio'), exist_ok=True)
    clips, total, t0 = {}, 0.0, time.time()
    for n, (page, lines) in enumerate(pages.items()):
        if only and page not in only: continue
        for ln in lines:
            if ln['who'] not in VOICES: raise SystemExit('no voice for ' + ln['who'])
        chunks, marks, prev = [np.zeros(int(0.15 * SR), dtype=np.float32)], [], None   # a breath of quiet before the first line
        at = len(chunks[0])
        for ln, a in zip(lines, page_sound(lines)):
            g = gap(prev, ln)
            if g: chunks.append(np.zeros(int(g * SR), dtype=np.float32)); at += len(chunks[-1])
            marks.append([key(ln['who'], ln['text']), round(at / SR, 2), round((at + len(a)) / SR, 2)])
            chunks.append(a); at += len(a); prev = ln
        chunks.append(np.zeros(int(0.4 * SR), dtype=np.float32))
        assert len({m[0] for m in marks}) == len(marks), 'two lines share a key on ' + page
        pcm = (np.clip(np.concatenate(chunks), -1, 1) * 32767).astype('<i2').tobytes()
        out = os.path.join(ROOT, 'audio', page + '.mp4')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'aac', '-b:a', '40k',
                        '-movflags', '+faststart', '-f', 'mp4', out], input=pcm, check=True)
        clips[page] = marks; total += at / SR
        print('%3d/%d %-8s %5.1fs  (%d lines, %d min so far)' % (n + 1, len(pages), page, at / SR, len(lines), (time.time() - t0) / 60), flush=True)
    if only and not os.environ.get('RECORD_PARTIAL'): return print('test run: src/clips.js not written')
    sums = hashlib.sha1(json.dumps(clips, sort_keys=True).encode()).hexdigest()[:8]
    with open(os.path.join(ROOT, 'src', 'clips.js'), 'w', encoding='utf-8') as f:
        f.write('/* Made by tools/record.py. Do not edit by hand. Where each recorded line sits in audio/<page>.mp4: [key, start, end]. */\n')
        f.write('const CLIPS = { v: "%s", pages: {\n' % sums)
        f.write(',\n'.join('%s: %s' % (json.dumps(p), json.dumps(m, separators=(',', ':'))) for p, m in clips.items()))
        f.write('\n} };\n')
    print('recorded %d pages, %.1f minutes of sound; %d passages had to be said line by line' % (len(clips), total / 60, APART[0]))

if __name__ == '__main__': main()
