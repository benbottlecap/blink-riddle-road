/* Reading aloud: works out who says each line, and gives every character a voice of their own.
   The voices are the ones built into the device (Web Speech), shaped by pitch and speed. */
const VOICE = (function () {
  /* [names in the story, key, pitch, speed, base voice: f / m / n (the storyteller's own), favourite voices] — first match wins.
     f and m follow the "she" and "he" the story uses, so they also tell the reader who a "she says" points back to. */
  const WHO = [
    ['grandma glow|old firefly|creaky little voice', 'glow', 1.3, 0.78, 'f', /grandma|moira|fiona|martha/i],
    ['blink|firefly', 'blink', 1.7, 1.05, 'm'],
    ['ella|elephant', 'ella', 0.8, 0.84, 'f'],
    ['sharky|shark', 'sharky', 0.95, 1.12, 'm'],
    ['lantern tree|deep voice', 'tree', 0.55, 0.76, 'm'],
    ['light keeper', 'keeper', 1.05, 0.84, 'f'],
    ['clock mouse', 'clockmouse', 1.6, 1.12, 'm'],
    ['field mouse|mouse', 'mouse', 1.85, 1.14, 'f'],
    ['very small star|little star', 'star', 1.65, 0.92, 'f'],
    ['great clock', 'clock', 0.6, 0.8, 'm'],
    ['bookworm|worm', 'bookworm', 1.2, 0.8, 'm'],
    ['great book|book', 'book', 0.75, 0.76, 'f'],
    ['voice like a long breath|wind', 'wind', 1.4, 0.74, 'f'],
    ['mother fox|their mother|fox', 'fox', 1.0, 0.95, 'f'],
    ['smallest cub|cubs?', 'cub', 1.9, 1.12, 'f'],
    ['snow hare', 'snowhare', 1.3, 1.1, 'f'],
    ['hare', 'hare', 1.45, 1.22, 'f'],
    ['owl', 'owl', 0.8, 0.8, 'f'],
    ['hedgehog', 'hedgehog', 1.3, 0.96, 'm'],
    ['spider', 'spider', 1.55, 0.86, 'f'],
    ['turtle', 'turtle', 0.7, 0.66, 'm'],
    ['tortoise', 'tortoise', 0.75, 0.62, 'm'],
    ['frog', 'frog', 0.65, 1.0, 'f'],
    ['toad', 'toad', 0.55, 0.9, 'm'],
    ['duck', 'duck', 1.4, 1.04, 'f'],
    ['otter’s cousin', 'cousin', 1.35, 1.14, 'f'],
    ['otter', 'otter', 1.25, 1.16, 'm'],
    ['bat', 'bat', 1.8, 1.1, 'f'],
    ['well', 'well', 0.6, 0.7, 'n'],
    ['snail', 'snail', 1.1, 0.6, 'm'],
    ['gnome', 'gnome', 1.35, 0.92, 'm'],
    ['scarecrow', 'scarecrow', 0.9, 0.88, 'm'],
    ['beetle', 'beetle', 1.5, 1.15, 'm'],
    ['carp', 'carp', 1.2, 0.9, 'f'],
    ['crayfish', 'crayfish', 1.1, 1.2, 'm'],
    ['catfish', 'catfish', 0.55, 0.78, 'm'],
    ['moss|mole', 'moss', 0.8, 0.86, 'f'],
    ['grub', 'grub', 1.0, 0.8, 'm'],
    ['badger', 'badger', 0.6, 0.84, 'm'],
    ['heron', 'heron', 0.8, 0.8, 'm'],
    ['rooster', 'rooster', 1.15, 1.08, 'm'],
    ['sparrows?', 'sparrow', 1.9, 1.25, 'f'],
    ['raccoon', 'raccoon', 1.15, 1.1, 'f'],
    ['cuckoo', 'cuckoo', 1.7, 1.2, 'f'],
    ['moth', 'moth', 1.3, 0.72, 'f'],
    ['cricket', 'cricket', 1.6, 1.18, 'm'],
    ['moon', 'moon', 0.9, 0.74, 'f']
  ];
  const CAST = { narrator: [1, 0.92, 'n'], you: [1.18, 1, 'n'] };
  WHO.forEach(function (c) { CAST[c[1]] = c.slice(2); });
  const QUIET = { you: 1, ella: 1, sharky: 1 };   /* never who a "he", "she" or "it" points back to */
  const TOKENS = new RegExp('\\b(?:(you)|(he|she|it)|' + WHO.map(function (c) { return '(' + c[0] + ')'; }).join('|') + ')\\b', 'gi');
  /* who asks the puzzle on pages where the story does not name them next to their words */
  const GIVER = { otter: 'the otter', c6_3: 'the mother fox', c6_4: 'the smallest cub', c8_6: 'the Clock Mouse', c8_7: 'the Clock Mouse', c10_0: 'the very small star' };
  /* lines where the plain rules guess wrong: page id -> { t3: 'who' } for story paragraph 3, { a1: 'who,who' } for the
     paragraph after the puzzle (one name for each spoken part), { ask: 'who' } for the riddle itself */
  const FIX = { c6_1: { a1: 'snowhare' } };

  function hash(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  function strip(t) { return String(t == null ? '' : t).replace(/<[^>]+>/g, ''); }
  function plain(t) {
    return strip(t).replace(/[“”]/g, '').replace(/\b[A-Z]{2,}\b/g, function (w) { return w.toLowerCase(); })
      .replace(/_+/g, ' blank ').replace(/\s*·\s*/g, ', ').replace(/\s+/g, ' ').trim();
  }
  function profile(who) {
    if (CAST[who]) return CAST[who];
    const h = hash(String(who));   /* someone new, from a live riddle: give them a steady voice of their own */
    return [0.8 + (h % 9) / 10, 0.85 + ((h >> 4) % 4) / 10, (h >> 7) % 2 ? 'f' : 'm'];
  }
  function tokens(text) {
    const out = []; let m; TOKENS.lastIndex = 0;
    while ((m = TOKENS.exec(text))) {
      if (m[1]) out.push('you'); else if (m[2]) out.push('?' + m[2].toLowerCase());
      else for (let i = 0; i < WHO.length; i++) if (m[i + 3]) { out.push(WHO[i][1]); break; }
    }
    return out;
  }
  function helperOf(name) { const t = tokens(String(name || '')); return t.length && t[0].charAt(0) !== '?' ? t[0] : null; }
  function sentences(t) { return t.match(/[^.!?]+[.!?]*/g) || []; }
  function note(k, st) {
    if (QUIET[k] || k === 'narrator') return;
    const kind = profile(k)[2];
    st.last = k; if (kind === 'm') st.he = st.nearHe = k; else if (kind === 'f') st.she = st.nearShe = k;
  }
  function mention(text, st) { tokens(text).forEach(function (k) { if (k.charAt(0) !== '?') note(k, st); }); }
  /* "he" and "she" point to someone of that kind: named in this paragraph, else whoever asks this page's puzzle, else the last one named */
  function settle(k, st) {
    if (k === 'x:voice') return st.giver || k;
    if (k.charAt(0) !== '?') return k;
    const kind = k === '?he' ? 'm' : k === '?she' ? 'f' : '';
    const near = kind === 'm' ? st.nearHe : kind === 'f' ? st.nearShe : null;
    if (near) return near;
    if (kind && st.giver && profile(st.giver)[2] === kind) return st.giver;
    return (kind === 'm' ? st.he : kind === 'f' ? st.she : st.last) || st.giver || st.last || null;
  }
  function oddOne(clause) {
    const m = /^\s*[a-z]+\s+(?:the|a|an)\s+(?:[\w’-]+\s+)*?([\w’-]+)\s*[,.!?]/i.exec(clause);
    return m ? 'x:' + m[1].toLowerCase() : null;
  }

  /* split paragraphs into what to say: one list per paragraph of { who, text } */
  function lines(paras, st, tag) {
    return (paras || []).map(function (raw, p) {
      const t = strip(raw), parts = t.split(/“([^”]*)”/), out = [];   /* even slots are story-telling, odd slots are speech */
      const fix = st.fix && st.fix[tag + p] ? String(st.fix[tag + p]).split(',') : null;
      let inPara = null, q = 0;
      st.nearHe = st.nearShe = null; st.endWho = null;
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          if (parts[i].trim()) { out.push({ who: 'narrator', text: parts[i] }); mention(parts[i], st); }
          continue;
        }
        const before = parts[i - 1].trim(), after = (parts[i + 1] || '').trim();
        const sb = sentences(before), sa = sentences(after);
        let who = fix ? fix[Math.min(q, fix.length - 1)] : null, tk;
        if (!who && /[,:]$/.test(before)) { tk = tokens(sb[sb.length - 1] || ''); if (tk.length) who = settle(tk[tk.length - 1], st); }
        if (!who && /^[a-z]/.test(after)) { tk = tokens(sa[0] || ''); who = tk.length ? settle(tk[0], st) : settle(oddOne(sa[0] || '') || '?it', st); }
        if (!who && inPara) who = inPara;
        if (!who && before) { tk = tokens(sb[sb.length - 1] || ''); if (tk.length) who = settle(tk[0], st); }
        if (!who && after) { tk = tokens(sa[0] || ''); if (tk.length) who = settle(tk[0], st); }
        if (!who) who = st.prev2 || st.last || st.giver || st.prev || 'narrator';
        inPara = who; q++;
        if (who !== st.prev) { st.prev2 = st.prev; st.prev = who; }
        note(who, st);
        st.endWho = who;
        out.push({ who: who, text: parts[i] });
      }
      return out;
    });
  }
  /* everything spoken on one page. node is the page as shown tonight; base is the hand-written page it came from */
  function page(id, node, base, giver) {
    const own = !!base && node.text === base.text;
    const st = { fix: own ? FIX[id] || null : null, giver: helperOf(giver || GIVER[id] || '') };
    const g = node.riddle || node.maze || node.memory;
    const text = lines(node.text, st, 't');
    /* the riddle is read by whoever asks it: the helper on this page, or whoever spoke last just before it */
    const asker = (st.fix && st.fix.ask) || st.giver || (st.endWho && st.endWho !== 'you' ? st.endWho : null) || 'narrator';
    return { text: text, asker: asker, after: g && g.after ? lines(g.after, st, 'a') : [] };
  }

  /* ---- speaking ---- */
  const synth = typeof window !== 'undefined' && window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function' ? window.speechSynthesis : null;
  const SILLY = /albert|bad news|bahh|bells|boing|bubbles|cellos|wobble|good news|jester|organ|superstar|trinoids|whisper|zarvox|deranged|hysterical|princess|junior|kathy|ralph|fred/i;
  const PLAIN = /eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley/i;
  const FEM = /samantha|ava\b|allison|susan|zoe|karen|moira|tessa|fiona|nicky|kate|serena|martha|catherine|stephanie|isha|veena|female|zira|hazel|jenny|aria|sonia|libby|natasha|victoria|michelle|emma|flo|sandy|shelley|grandma|joanna|salli|kimberly|ivy|amy/i;
  const MALE = /daniel|aaron|arthur|gordon|oliver|rishi|tom\b|alex|evan|nathan|lee\b|david|mark|guy|george|ryan|james|william|liam|male|eddy|reed|rocko|grandpa|christopher|eric|roger|steffan|thomas|brian|andrew/i;
  let book = null, turn = 0, held = [], watch = 0;
  function kindOf(v) { return FEM.test(v.name) ? 'f' : MALE.test(v.name) ? 'm' : ''; }
  function shelf() {
    if (book) return book;
    let all = [];
    try { all = synth.getVoices() || []; } catch (e) { all = []; }
    all = Array.prototype.filter.call(all, function (v) { return /^en([-_]|$)/i.test(v.lang || '') && !SILLY.test(v.name); })
      .sort(function (a, b) { return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
    if (!all.length) return { teller: null, all: [], got: {} };
    function score(v) {
      return (/^en[-_]US/i.test(v.lang) ? 2 : 0) + (/samantha|ava\b|allison|zoe|google us english|aria|jenny|michelle/i.test(v.name) ? 3 : 0) +
        (/premium|enhanced|natural|neural/i.test(v.name) ? 2 : 0) + (v.default ? 1 : 0) - (PLAIN.test(v.name) ? 4 : 0);
    }
    let teller = all[0];
    all.forEach(function (v) { if (score(v) > score(teller)) teller = v; });
    book = { teller: teller, all: all, got: {} };
    return book;
  }
  /* the storyteller gets the best voice on the device; each character gets another one of the right kind when there is one */
  function voiceFor(who) {
    const b = shelf(), pr = profile(who);
    if (!b.teller || pr[2] === 'n') return b.teller;
    if (b.got[who]) return b.got[who];
    const rest = b.all.filter(function (v) { return v !== b.teller; });
    const same = rest.filter(function (v) { return kindOf(v) === pr[2]; });
    let pool = pr[3] ? rest.filter(function (v) { return pr[3].test(v.name); }) : [];
    if (!pool.length) pool = same.filter(function (v) { return !PLAIN.test(v.name); });
    if (!pool.length) pool = same;
    if (!pool.length && kindOf(b.teller) !== pr[2]) pool = rest.filter(function (v) { return !kindOf(v) && !PLAIN.test(v.name); });
    b.got[who] = pool.length ? pool[hash(who) % pool.length] : b.teller;
    return b.got[who];
  }
  /* ---- recorded voices: each page has one sound file with all of its lines; CLIPS says where each line sits ---- */
  const TAPE = typeof CLIPS === 'object' && CLIPS && CLIPS.pages ? CLIPS.pages : {};
  const tape = typeof window !== 'undefined' && typeof window.Audio === 'function' && Object.keys(TAPE).length ? new window.Audio() : null;
  const dead = {}, index = {};
  let onTape = '', primed = false;
  if (tape) tape.preload = 'auto';
  function key(who, text) {   /* same sum as key() in tools/record.py */
    let h = 2166136261; const s = who + '|' + text;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    return h.toString(36);
  }
  function clipAt(page, part) {
    if (!tape || !page || dead[page] || !TAPE[page]) return -1;
    if (!index[page]) { index[page] = {}; TAPE[page].forEach(function (c, i) { index[page][c[0]] = i; }); }
    const i = index[page][key(part.who, part.text)];
    return i === undefined ? -1 : i;
  }
  function load(page) {
    if (onTape === page) return;
    onTape = page; tape.src = 'audio/' + page + '.m4a?v=' + CLIPS.v;
    try { tape.load(); } catch (e) { /* it loads when played */ }
  }
  function stop() {
    turn++; held = []; clearInterval(watch);
    if (synth) try { synth.cancel(); } catch (e) { /* nothing to stop */ }
    if (tape) try { tape.pause(); } catch (e) { /* nothing to stop */ }
  }
  /* say the parts in order: the recorded line when there is one, the device's own voice when there is not
     (a page made fresh for a replay, or a player's own names). onMark(mark) runs as each part starts;
     onEnd(mine, started) runs once at the end, where started is false if nothing could be heard */
  function say(parts, onMark, onEnd, page) {
    stop();
    if (!parts || !parts.length) return false;
    const my = turn, plan = parts.map(function (p) { return { p: p, c: clipAt(page, p) }; });
    const taped = plan.some(function (x) { return x.c >= 0; }), plainOnes = plan.some(function (x) { return x.c < 0; });
    if (!synth && !taped) return false;
    let started = false, over = false, rolling = false;
    function end() { if (over || my !== turn) return; over = true; clearInterval(watch); held = []; if (onEnd) onEnd(true, started); }
    function begin(x) { started = true; if (onMark) onMark(x.p.mark); }
    function onClip(x) { return x.c >= 0 && !dead[page]; }
    function step(i) {
      if (my !== turn) return;
      if (i >= plan.length) return end();
      if (onClip(plan[i])) return play(i);
      let j = i; while (j < plan.length && !onClip(plan[j])) j++;
      if (!synth) return step(j);
      utter(plan.slice(i, j), function () { step(j); });
    }
    /* the device's own voice, for a run of lines with no recording */
    function utter(run, next) {
      const U = window.SpeechSynthesisUtterance, born = Date.now();
      let begun = 0, heard = false, done = false;
      function fin() { if (done || my !== turn) return; done = true; clearInterval(watch); held = []; next(); }
      run.forEach(function (x, n) {
        const u = new U(x.p.text), pr = profile(x.p.who), v = voiceFor(x.p.who);
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
        u.pitch = Math.max(0.5, Math.min(2, pr[0])); u.rate = Math.max(0.5, Math.min(1.4, pr[1])); u.volume = 1;
        u.onstart = function () { if (my !== turn) return; heard = true; begun = Date.now(); begin(x); };
        u.onend = function () { if (my !== turn) return; begun = Date.now(); if (n === run.length - 1) fin(); };
        u.onerror = function () { if (my === turn && n === run.length - 1) fin(); };
        held.push(u);   /* keep hold of them, or some tablets forget to say when they are done */
        try { synth.speak(u); } catch (e) { /* skip this part */ }
      });
      clearInterval(watch);
      watch = setInterval(function () {
        if (my !== turn) { clearInterval(watch); return; }
        if (!heard) { if (Date.now() - born > 6000) { try { synth.cancel(); } catch (e) { /* already quiet */ } fin(); } }
        else if (!synth.speaking && !synth.pending && Date.now() - begun > 900) fin();
      }, 450);
    }
    /* a recorded line; when the next part is the next line on the same tape, it just keeps rolling */
    function play(i) {
      let x = plan[i], c = TAPE[page][x.c], begun = false, moved = Date.now(), lastT = -1;
      function seek() { const to = Math.max(0, c[1] - 0.1); try { if (tape.currentTime < c[1] - 0.2 || tape.currentTime >= c[2]) tape.currentTime = to; } catch (e) { /* not ready yet */ } }
      function fail() { if (my !== turn) return; dead[page] = true; rolling = false; clearInterval(watch); try { tape.pause(); } catch (e) { /* fine */ } tape.muted = false; if (synth) step(i); else end(); }
      rolling = true;
      load(page);
      tape.muted = true;   /* quiet until it is at the right place */
      if (tape.readyState >= 1) seek(); else tape.addEventListener('loadedmetadata', function () { if (my === turn && rolling && !begun) seek(); }, { once: true });
      const pr = tape.play();
      if (pr && pr.catch) pr.catch(function (e) { if (my === turn && rolling && e && e.name !== 'AbortError') fail(); });
      clearInterval(watch);
      watch = setInterval(function () {
        if (my !== turn) { clearInterval(watch); return; }
        if (tape.error) return fail();
        const t = tape.currentTime;
        if (t !== lastT) { lastT = t; moved = Date.now(); } else if (Date.now() - moved > 9000) return fail();
        if (!begun) {
          if (tape.readyState < 2 || tape.seeking) return;
          if (t >= c[1] - 0.2 && t < c[2]) { tape.muted = false; begun = true; begin(x); if (tape.paused) { const again = tape.play(); if (again && again.catch) again.catch(function () { /* the watch will notice */ }); } }
          else seek();
          return;
        }
        const nx = plan[i + 1];
        if (nx && nx.c === x.c + 1 && !tape.ended) {
          if (t >= TAPE[page][nx.c][1] - 0.03) { i++; x = nx; c = TAPE[page][x.c]; begin(x); }
          return;
        }
        if (t >= c[2] + 0.06 || tape.ended) { rolling = false; clearInterval(watch); try { tape.pause(); } catch (e) { /* fine */ } step(i + 1); }
      }, 30);
    }
    /* a tap is needed to let a tablet make sound, so wake both kinds of voice inside this tap if both will be used */
    if (taped && plainOnes && synth && !primed) { primed = true; try { const hush = new window.SpeechSynthesisUtterance(' '); hush.volume = 0; synth.speak(hush); } catch (e) { /* fine */ } }
    if (taped && plan[0].c < 0 && synth) {
      load(page); tape.muted = true;
      const wake = tape.play();
      if (wake && wake.then) wake.then(function () { if (!rolling) tape.pause(); }).catch(function () { /* play() will find out */ });
    }
    step(0);
    return true;
  }
  if (synth && typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', function () { book = null; });
  if (synth) try { synth.getVoices(); } catch (e) { /* voices come later */ }

  return { can: !!synth || !!tape, key: key, cast: CAST, fix: FIX, page: page, plain: plain, helperOf: helperOf, profile: profile, voiceFor: voiceFor, say: say, stop: stop };
})();
