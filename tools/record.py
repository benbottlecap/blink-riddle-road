"""Record the read-aloud voices.

Turns every line in tools/lines.json into speech with the open-source Kokoro voice model, joins each page's lines
into one sound file (audio/<page>.mp4) and writes src/clips.js, which tells the game where each line starts and ends.

Needs: pip install kokoro-onnx soundfile scipy; ffmpeg; and the two Kokoro model files (kokoro-v1.0.onnx, voices-v1.0.bin
from github.com/thewh1teagle/kokoro-onnx/releases, tag model-files-v1.0) in the folder named by KOKORO_DIR.
Run:  python3 tools/build.py && node tools/lines.js && python tools/record.py && python3 tools/build.py
Lines already recorded are kept in RECORD_CACHE, so only new or changed lines are spoken again.
"""
import hashlib, json, os, re, subprocess, sys, time
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.environ.get('KOKORO_DIR', '/home/claude/tts/model')
CACHE = os.environ.get('RECORD_CACHE', '/home/claude/tts/cache')
SR = 24000

# who: (Kokoro voice, speed, pitch).  Pitch above 1 makes a smaller, lighter creature; below 1 a bigger, deeper one.
VOICES = {
    'narrator': ('af_heart', 0.94, 1.0), 'you': ('af_heart', 1.0, 1.04),
    'blink': ('am_puck', 1.06, 1.2), 'ella': ('bf_emma', 0.86, 0.9), 'sharky': ('am_fenrir', 1.08, 0.97),
    'glow': ('bf_lily', 0.8, 1.08), 'tree': ('am_onyx', 0.78, 0.84), 'keeper': ('bf_emma', 0.9, 1.02),
    'clockmouse': ('bm_daniel', 1.1, 1.28), 'mouse': ('af_sarah', 1.1, 1.3), 'star': ('af_sky', 0.98, 1.24),
    'clock': ('bm_george', 0.8, 0.84), 'bookworm': ('bm_fable', 0.9, 1.06), 'book': ('af_nicole', 0.86, 0.92),
    'wind': ('af_nicole', 0.8, 1.08), 'fox': ('af_bella', 1.0, 1.0), 'cub': ('af_nova', 1.1, 1.36),
    'snowhare': ('bf_alice', 1.1, 1.1), 'hare': ('af_aoede', 1.2, 1.12), 'owl': ('bf_isabella', 0.86, 0.92),
    'hedgehog': ('am_liam', 1.0, 1.15), 'spider': ('af_river', 0.9, 1.18), 'turtle': ('bm_george', 0.72, 0.94),
    'tortoise': ('am_santa', 0.72, 0.92), 'frog': ('af_kore', 1.0, 0.8), 'toad': ('am_adam', 0.92, 0.8),
    'duck': ('af_sarah', 1.08, 1.14), 'cousin': ('af_sky', 1.12, 1.08), 'otter': ('am_echo', 1.14, 1.08),
    'bat': ('af_jessica', 1.08, 1.28), 'well': ('af_heart', 0.8, 0.92), 'snail': ('am_michael', 0.7, 1.04),
    'gnome': ('am_santa', 0.95, 1.12), 'scarecrow': ('am_adam', 0.9, 0.96), 'beetle': ('am_eric', 1.15, 1.2),
    'carp': ('af_kore', 0.9, 1.05), 'crayfish': ('am_fenrir', 1.15, 1.06), 'catfish': ('bm_lewis', 0.85, 0.8),
    'moss': ('af_alloy', 0.9, 0.9), 'grub': ('am_liam', 0.85, 1.1), 'badger': ('am_michael', 0.9, 0.84),
    'heron': ('bm_fable', 0.85, 0.94), 'rooster': ('am_eric', 1.05, 1.05), 'sparrow': ('af_aoede', 1.22, 1.34),
    'raccoon': ('af_bella', 1.08, 1.06), 'cuckoo': ('bf_alice', 1.15, 1.3), 'moth': ('af_nicole', 0.8, 1.0),
    'cricket': ('bm_daniel', 1.15, 1.22), 'moon': ('bf_isabella', 0.8, 1.0),
}
ECHO = {'well'}   # the well answers like an echo

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

def how_to_say(text, lang):
    """Returns (text to speak, phonemes or None, True if anything was corrected)."""
    plain = text.replace('\u2019', "'")
    said = plain
    for pat, to in RESPELL: said = re.sub(pat, to, said)
    phones = None
    for pat, wrong, right in SOUNDS:
        if re.search(pat, text):
            phones = phones if phones is not None else engine().tokenizer.phonemize(said, lang)
            phones = phones.replace(wrong, right)
    return said, phones, said != plain or phones is not None

_k = None
def engine():
    global _k
    if _k is None:
        from kokoro_onnx import Kokoro
        _k = Kokoro(os.path.join(MODEL, 'kokoro-v1.0.onnx'), os.path.join(MODEL, 'voices-v1.0.bin'))
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

def speak(who, text):
    voice, speed, pitch = VOICES[who]
    lang = 'en-gb' if voice[0] == 'b' else 'en-us'
    said, phones, fixed = how_to_say(text, lang)
    tag = hashlib.sha1(json.dumps([voice, speed, pitch, who in ECHO, text] + ([said, phones] if fixed else [])).encode()).hexdigest()
    path = os.path.join(CACHE, tag + '.npy')
    if os.path.exists(path): return np.load(path)
    from scipy.signal import resample
    if phones is not None: a, sr = engine().create(phones, voice=voice, speed=speed / pitch, lang=lang, is_phonemes=True)
    else: a, sr = engine().create(said, voice=voice, speed=speed / pitch, lang=lang)
    assert sr == SR
    a = trim(np.asarray(a, dtype=np.float32))
    if pitch != 1.0: a = resample(a, max(1, int(round(len(a) / pitch)))).astype(np.float32)
    rms = float(np.sqrt(np.mean(a ** 2))) or 1.0
    a = a * (0.085 / rms)                      # every voice about as loud as the next
    peak = float(np.abs(a).max())
    if peak > 0.97: a = a * (0.97 / peak)
    if who in ECHO:
        out = np.zeros(len(a) + SR, dtype=np.float32); out[:len(a)] += a * 0.8
        for d, g in ((0.26, 0.42), (0.52, 0.2), (0.78, 0.09)):
            s = int(d * SR); out[s:s + len(a)] += a[:len(out) - s] * g
        a = out
    np.save(path, a.astype(np.float32))
    return a

def main():
    only = set(sys.argv[1].split(',')) if len(sys.argv) > 1 else None
    pages = json.load(open(os.path.join(ROOT, 'tools', 'lines.json'), encoding='utf-8'))
    os.makedirs(CACHE, exist_ok=True); os.makedirs(os.path.join(ROOT, 'audio'), exist_ok=True)
    clips, total, t0 = {}, 0.0, time.time()
    for n, (page, lines) in enumerate(pages.items()):
        if only and page not in only: continue
        chunks, marks, prev = [np.zeros(int(0.15 * SR), dtype=np.float32)], [], None   # a breath of quiet before the first line
        at = len(chunks[0])
        for ln in lines:
            if ln['who'] not in VOICES: raise SystemExit('no voice for ' + ln['who'])
            gap = 0 if prev is None else 0.7 if ln['mark'] == 'h' else 0.2 if ln['mark'] == prev else 0.5
            if gap: chunks.append(np.zeros(int(gap * SR), dtype=np.float32)); at += len(chunks[-1])
            a = speak(ln['who'], ln['text'])
            marks.append([key(ln['who'], ln['text']), round(at / SR, 2), round((at + len(a)) / SR, 2)])
            chunks.append(a); at += len(a); prev = ln['mark']
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
    print('recorded %d pages, %.1f minutes of sound' % (len(clips), total / 60))

if __name__ == '__main__': main()
