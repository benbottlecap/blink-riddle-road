(function () {
  var KEY = 'riddle-road-v3', OLD_KEY = 'riddle-road-v2', PER = 8, NAMES = ['Maven', 'Ella', 'Sharky'];
  var CH = CHAPTERS, CHI = {};
  CH.forEach(function (c, i) { CHI[c.id] = i; });

  /* tag every stop with its chapter, and work out each chapter's road for the road map */
  STORY.door.riddle.knock = { n: 15, gt: 0, lt: 20, by: [3, 5], verb: 'Knock', noun: 'Knocks', done: 'Open the door' };
  function nexts(id) { return (STORY[id].choices || []).filter(function (c) { return !c.restart && STORY[c.to]; }).map(function (c) { return c.to; }); }
  CH.forEach(function (c) {
    var depth = {}, order = [];
    (function walk(id, d) {
      if (depth[id] === undefined) order.push(id);
      if (depth[id] === undefined || d > depth[id]) { depth[id] = d; nexts(id).forEach(function (t) { walk(t, d + 1); }); }
    })(c.start, 0);
    order.forEach(function (id) { STORY[id].ch = c.id; });
    c.road = { order: order, depth: depth };
  });
  var RIDDLES = Object.keys(STORY).filter(function (id) { return STORY[id].riddle; });

  function fresh(ch) {
    var c = CH[CHI[ch || 'c1']];
    return { screen: 'title', back: 'title', ch: c.id, node: c.start, path: [c.start], solved: [], wrong: {}, stars: {}, fresh: [], knocks: 0, live: false, dyn: {}, fixed: {}, remix: false, salt: 0 };
  }
  var state = fresh();
  function newPlayer() { return { hero: '', s1: '', s2: '', named: false, found: [], seen: [], sound: true, read: false, save: null, ch: {}, remix: true, aiUsed: [] }; }
  var store = { cur: 0, players: [newPlayer()] };
  var keep = store.players[0];
  var memoryOnly = false, removeArmed = false, sure = '';
  var SURE = { over: 'Tap again to start this chapter over', wipe: 'Tap again to erase all stars and start at Chapter 1' };
  var ai = { fn: undefined, off: false, pending: null, seq: 0, timer: 0 };
  var mz = null, mem = null;
  var talk = { on: false, next: '', moved: false, mute: false };

  var scene = document.getElementById('scene');
  var art = document.getElementById('art');
  var hud = document.getElementById('hud');
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- saving: progress stays in this browser only ---- */
  function cleanName(v, max) { return String(v == null ? '' : v).replace(/[^\p{L}\p{N} '’\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, max || 16); }
  function fixPlayer(d) {
    var p = newPlayer(), k; if (!d || typeof d !== 'object') return p;
    p.hero = cleanName(d.hero, 24); p.s1 = cleanName(d.s1); p.s2 = cleanName(d.s2); p.named = !!d.named;
    if (Array.isArray(d.found)) p.found = d.found.filter(function (id) { return STORY[id]; });
    if (Array.isArray(d.seen)) p.seen = d.seen.filter(function (id) { return STORY[id]; });
    if (typeof d.sound === 'boolean') p.sound = d.sound;
    if (typeof d.remix === 'boolean') p.remix = d.remix;
    if (typeof d.read === 'boolean') p.read = d.read;
    if (Array.isArray(d.aiUsed)) p.aiUsed = d.aiUsed.filter(function (x) { return typeof x === 'string'; }).slice(-40);
    if (d.ch && typeof d.ch === 'object') for (k in d.ch) if (CHI[k] !== undefined && d.ch[k]) p.ch[k] = { best: +d.ch[k].best || 0 };
    if (d.save && STORY[d.save.node] && CHI[d.save.ch] !== undefined) p.save = d.save;
    return p;
  }
  function loadKeep() {
    try {
      var raw = window.localStorage.getItem(KEY), d;
      if (raw) {
        d = JSON.parse(raw);
        if (d && Array.isArray(d.players) && d.players.length) { store.players = d.players.slice(0, 8).map(fixPlayer); store.cur = Math.min(Math.max(0, d.cur | 0), store.players.length - 1); }
      } else {
        raw = window.localStorage.getItem(OLD_KEY);
        if (raw) { d = fixPlayer(JSON.parse(raw)); d.hero = NAMES[0]; d.s1 = NAMES[1]; d.s2 = NAMES[2]; d.named = true; store.players = [d]; store.cur = 0; }
      }
    } catch (e) { memoryOnly = true; }
    keep = store.players[store.cur];
  }
  function saveKeep() {
    if (state.live) {
      var done = STORY[state.node].ending && isSolved(state.node);
      keep.save = done ? null : { ch: state.ch, node: state.node, path: state.path, solved: state.solved, wrong: state.wrong, stars: state.stars, fresh: state.fresh, knocks: state.knocks, dyn: state.dyn, fixed: state.fixed, remix: state.remix, salt: state.salt };
    }
    try { window.localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { memoryOnly = true; }
  }
  function names() { return [keep.hero || NAMES[0], keep.s1 || NAMES[1], keep.s2 || NAMES[2]]; }
  function nmText(s) { var n = names(); return String(s).replace(/\b(Maven|Ella|Sharky)\b/g, function (m) { return n[NAMES.indexOf(m)]; }); }
  function nmHtml(s) { var n = names().map(REMIX.esc); return String(s).replace(/\b(Maven|Ella|Sharky)\b/g, function (m) { return n[NAMES.indexOf(m)]; }); }

  /* ---- sound ---- */
  var ac = null;
  function audio() {
    if (!keep.sound) return null;
    try {
      if (!ac) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A(); }
      if (ac.state === 'suspended') ac.resume();
      return ac;
    } catch (e) { return null; }
  }
  function tone(freq, start, dur, type, vol) {
    var a = audio(); if (!a) return;
    try {
      var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + start;
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  }
  var sfx = {
    tap: function () { tone(440, 0, 0.12, 'sine', 0.05); },
    pick: function () { tone(880, 0, 0.18, 'sine', 0.07); tone(1175, 0.08, 0.25, 'sine', 0.06); },
    right: function () { tone(523, 0, 0.5, 'sine', 0.1); tone(659, 0.12, 0.5, 'sine', 0.1); tone(784, 0.24, 0.8, 'sine', 0.1); },
    wrong: function () { tone(220, 0, 0.22, 'triangle', 0.07); tone(196, 0.14, 0.3, 'triangle', 0.07); },
    knock: function () { tone(140, 0, 0.09, 'square', 0.07); tone(90, 0.02, 0.12, 'sine', 0.14); },
    end: function () { [523, 659, 784, 1047, 784, 1047].forEach(function (fq, i) { tone(fq, i * 0.16, 0.9, 'sine', 0.08); }); }
  };

  /* ---- small helpers ---- */
  function isSolved(id) { return state.solved.indexOf(id) !== -1; }
  function game(n) { return n.riddle || n.maze || n.memory || null; }
  function chapter() { return CH[CHI[state.ch]]; }
  function unlocked(i) { return i === 0 || !!keep.ch[CH[i - 1].id]; }
  function N(id) { var b = STORY[id], d = state.dyn && state.dyn[id], o, k; if (!d) return b; o = {}; for (k in b) o[k] = b[k]; for (k in d) o[k] = d[k]; return o; }
  function optIcon(id, i, r) { var o = (r || STORY[id].riddle).options[i]; return o.icon ? ICON.draw(o.icon) : ICON.option(id, i); }
  function rightIndex(id, r) { var o = (r || STORY[id].riddle).options; for (var i = 0; i < o.length; i++) if (o[i].correct) return i; return 0; }
  function rightAnswer(id, r) { return (r || STORY[id].riddle).options[rightIndex(id, r)].label; }
  function starTotal() { var t = 0; for (var k in state.stars) t += state.stars[k]; return t; }
  function allStars() { var t = 0; for (var k in keep.ch) t += keep.ch[k].best || 0; return t; }
  function starsHtml(n) {
    var h = '<span class="stars" role="img" aria-label="' + n + ' of 3 stars">';
    for (var i = 0; i < 3; i++) h += '<span class="' + (i < n ? 'on' : 'off') + '">★</span>';
    return h + '</span>';
  }
  function paras(list) { return '<div class="words">' + list.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>'; }
  function goBtn(label, act, quiet) {
    return '<button class="go' + (quiet ? ' quiet' : '') + '" type="button" data-act="' + act + '"><span>' + label + '</span><span class="arrow" aria-hidden="true">→</span></button>';
  }
  function sureBtn(label, act) {
    return '<button class="go quiet" type="button" data-act="' + act + '" data-label="' + label + '"><span>' + label + '</span><span class="arrow" aria-hidden="true">\u21ba</span></button>';
  }
  function toolsHtml() {
    return '<div class="tools"><button class="chip" type="button" data-act="stop"><span>Save and stop</span></button>' +
      '<button class="chip" type="button" data-act="over" data-label="Start chapter over"><span>Start chapter over</span></button></div>';
  }
  function unsure() {
    var el = sure && document.querySelector('[data-act="' + sure + '"]');
    if (el) el.querySelector('span').textContent = el.getAttribute('data-label');
    sure = '';
  }
  function pic(key) { return '<span class="pic">' + ICON.draw(key) + '</span>'; }
  function seqHtml(seq) { return '<div class="seq" aria-hidden="true">' + seq.map(pic).join('') + pic('unknown') + '</div>'; }

  function knockHint(k, kn) {
    var what = 'That was ' + k + '. ';
    if (k === 0) return 'Tap the big button first.';
    if (k >= kn.lt || k <= kn.gt) return what + 'The riddle says the number is ' + (kn.gt > 0 ? 'more than ' + kn.gt + ' and ' : '') + 'less than ' + kn.lt + '. Try again!';
    if (kn.even && k % 2) return what + k + ' is an odd number. The riddle says even. Try again!';
    if (kn.odd && k % 2 === 0) return what + k + ' is an even number. The riddle says odd. Try again!';
    var words = { 3: 'threes', 4: 'fours', 5: 'fives' };
    for (var i = 0; i < kn.by.length; i++) {
      var b = kn.by[i];
      if (k % b) { var list = []; for (var m = b; m < kn.lt; m += b) list.push(m); return what + 'Count by ' + words[b] + ': ' + list.join(', ') + '. You skip right over ' + k + '. Try again!'; }
    }
    return what + 'Try again!';
  }

  /* ---- mazes ---- */
  var DIRS = [{ dx: 0, dy: -1, b: 1, o: 4 }, { dx: 1, dy: 0, b: 2, o: 8 }, { dx: 0, dy: 1, b: 4, o: 1 }, { dx: -1, dy: 0, b: 8, o: 2 }];
  var THEMES = {
    hedge: ['#0f2a1d', '#4c9b68'], water: ['#0a2742', '#57b0c4'], earth: ['#1a120c', '#9a7450'], crystal: ['#19142e', '#a391ea'],
    cloud: ['#1b2a55', '#e3e9f7'], ice: ['#0f2944', '#c2e4f2'], market: ['#221a2c', '#e9a548'], brass: ['#1c1710', '#cfaa55'],
    library: ['#1a1320', '#bb8660'], sky: ['#0a1330', '#aab7d6'], storm: ['#0a0e1a', '#6a7aa2']
  };
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function buildMaze(id, m) {
    var w = m.w, h = m.h, n = w * h, r = rng(m.seed * 7919 + 13), open = [], vis = [], i, c, d;
    for (i = 0; i < n; i++) { open.push(0); vis.push(0); }
    var stack = [0]; vis[0] = 1;
    while (stack.length) {
      c = stack[stack.length - 1];
      var x = c % w, y = Math.floor(c / w), opts = [];
      for (i = 0; i < 4; i++) { d = DIRS[i]; var nx = x + d.dx, ny = y + d.dy; if (nx >= 0 && ny >= 0 && nx < w && ny < h && !vis[ny * w + nx]) opts.push(d); }
      if (!opts.length) { stack.pop(); continue; }
      d = opts[Math.floor(r() * opts.length)];
      var t = (y + d.dy) * w + (x + d.dx);
      open[c] |= d.b; open[t] |= d.o; vis[t] = 1; stack.push(t);
    }
    for (i = 0; i < Math.floor(n / 14); i++) {
      c = Math.floor(r() * n); d = DIRS[Math.floor(r() * 4)];
      var cx2 = c % w + d.dx, cy2 = Math.floor(c / w) + d.dy;
      if (cx2 >= 0 && cy2 >= 0 && cx2 < w && cy2 < h) { open[c] |= d.b; open[cy2 * w + cx2] |= d.o; }
    }
    var dist = [], q = [0]; for (i = 0; i < n; i++) dist.push(-1); dist[0] = 0;
    while (q.length) { c = q.shift(); for (i = 0; i < 4; i++) { d = DIRS[i]; if (open[c] & d.b) { t = c + d.dx + d.dy * w; if (dist[t] < 0) { dist[t] = dist[c] + 1; q.push(t); } } } }
    var exit = n - 1, ends = [], rest = [];
    for (c = 1; c < n - 1; c++) { var k = open[c]; (k === 1 || k === 2 || k === 4 || k === 8 ? ends : rest).push(c); }
    ends.sort(function (a, b) { return dist[b] - dist[a]; });
    rest.sort(function () { return r() - 0.5; });
    var pool = ends.concat(rest), key = -1, lights = [];
    if (m.kind === 'key') key = pool.shift();
    var take = Math.min(pool.length, Math.max(3, Math.min(ends.length, 7)));
    [0, Math.floor(take / 2), take - 1].forEach(function (ix) { if (pool[ix] !== undefined && lights.indexOf(pool[ix]) === -1) lights.push(pool[ix]); });
    for (i = 0; lights.length < 3 && i < pool.length; i++) if (lights.indexOf(pool[i]) === -1) lights.push(pool[i]);
    var z = { id: id, w: w, h: h, open: open, pos: 0, exit: exit, lights: lights, got: [], key: key, hasKey: false, fog: m.kind === 'fog', seen: {}, theme: THEMES[m.theme] || THEMES.sky, msg: '' };
    look(z);
    return z;
  }
  function look(z) {
    var x = z.pos % z.w, y = Math.floor(z.pos / z.w);
    for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < z.w && ny < z.h) z.seen[ny * z.w + nx] = 1; }
  }
  var S = 40, P = 6;
  function mazeSvg(z) {
    var W = z.w * S + P * 2, H = z.h * S + P * 2, s = '', c, x, y, walls = '';
    function mid(cell) { return [P + (cell % z.w) * S + S / 2, P + Math.floor(cell / z.w) * S + S / 2]; }
    s += '<rect width="' + W + '" height="' + H + '" rx="10" fill="' + z.theme[0] + '"/>';
    var e = mid(z.exit), locked = z.key >= 0 && !z.hasKey;
    s += '<rect x="' + (e[0] - 17) + '" y="' + (e[1] - 17) + '" width="34" height="34" rx="8" fill="' + (locked ? '#6b7186' : '#ffd35c') + '" opacity="' + (locked ? 0.35 : 0.3) + '"/>';
    s += '<path d="M' + (e[0] - 9) + ',' + (e[1] + 12) + ' v-14 a9,9 0 0 1 18,0 v14 z" fill="' + (locked ? '#8b93a3' : '#ffd35c') + '"/><circle cx="' + (e[0] + 4) + '" cy="' + (e[1] + 2) + '" r="1.8" fill="#0a1226"/>';
    z.lights.forEach(function (cell) {
      if (z.got.indexOf(cell) !== -1) return;
      var m = mid(cell);
      s += '<circle cx="' + m[0] + '" cy="' + m[1] + '" r="11" fill="#93dbb0" opacity="0.22"/><circle cx="' + m[0] + '" cy="' + m[1] + '" r="4.6" fill="#93dbb0"/>';
    });
    if (z.key >= 0 && !z.hasKey) {
      var km = mid(z.key);
      s += '<g transform="translate(' + (km[0] - 13) + ',' + (km[1] - 4) + ')"><circle cx="5" cy="4" r="5" fill="none" stroke="#ffd35c" stroke-width="3"/><rect x="9" y="2.6" width="17" height="3" fill="#ffd35c"/><rect x="19" y="5" width="3" height="5" fill="#ffd35c"/><rect x="23.4" y="5" width="2.6" height="4" fill="#ffd35c"/></g>';
    }
    for (c = 0; c < z.w * z.h; c++) {
      x = P + (c % z.w) * S; y = P + Math.floor(c / z.w) * S;
      if (!(z.open[c] & 1)) walls += 'M' + x + ',' + y + ' h' + S + ' ';
      if (!(z.open[c] & 8)) walls += 'M' + x + ',' + y + ' v' + S + ' ';
      if (!(z.open[c] & 2)) walls += 'M' + (x + S) + ',' + y + ' v' + S + ' ';
      if (!(z.open[c] & 4)) walls += 'M' + x + ',' + (y + S) + ' h' + S + ' ';
    }
    s += '<path d="' + walls + '" stroke="' + z.theme[1] + '" stroke-width="5" stroke-linecap="round" fill="none"/>';
    if (z.fog) {
      var px = z.pos % z.w, py = Math.floor(z.pos / z.w);
      for (c = 0; c < z.w * z.h; c++) {
        var cx = c % z.w, cy = Math.floor(c / z.w), near = Math.abs(cx - px) <= 1 && Math.abs(cy - py) <= 1;
        if (near) continue;
        s += '<rect x="' + (P + cx * S - 3) + '" y="' + (P + cy * S - 3) + '" width="' + (S + 6) + '" height="' + (S + 6) + '" fill="#04060c" opacity="' + (z.seen[c] ? 0.5 : 0.97) + '"/>';
      }
      if (c !== z.exit && !z.seen[z.exit]) s += '<circle cx="' + e[0] + '" cy="' + e[1] + '" r="5" fill="#ffd35c" opacity="0.5"/>';
    }
    var p = mid(z.pos);
    s += '<g class="blink"><circle class="halo" cx="' + p[0] + '" cy="' + p[1] + '" r="17" fill="#ffd35c" opacity="0.28"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" fill="#ffd35c" opacity="0.4"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="6" fill="#ffd35c"/></g>';
    return '<svg id="mazeSvg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Maze. Use the arrow buttons or slide your finger to move Blink.">' + s + '</svg>';
  }
  function drawMaze() {
    var box = document.getElementById('mazeBox'); if (!box || !mz) return;
    box.innerHTML = mazeSvg(mz);
    var st = 'Lights: ' + mz.got.length + ' of ' + mz.lights.length;
    if (mz.key >= 0) st += '  ·  Key: ' + (mz.hasKey ? 'found' : 'not yet');
    document.getElementById('mazeStat').textContent = st;
    document.getElementById('hint').textContent = mz.msg;
  }
  function step(di) {
    var z = mz, d = DIRS[di];
    if (!z || !(z.open[z.pos] & d.b)) return false;
    z.pos += d.dx + d.dy * z.w; z.msg = '';
    look(z);
    if (z.lights.indexOf(z.pos) !== -1 && z.got.indexOf(z.pos) === -1) { z.got.push(z.pos); sfx.pick(); }
    if (z.pos === z.key && !z.hasKey) { z.hasKey = true; z.msg = 'You found the key! Now the door will open.'; sfx.pick(); }
    if (z.pos === z.exit) {
      if (z.key >= 0 && !z.hasKey) { z.msg = 'The door is locked. Find the key first.'; }
      else { var stars = Math.max(1, Math.min(3, z.got.length)); mz = null; solve(z.id, stars); return 'done'; }
    }
    return true;
  }
  function moveToward(cell) {
    var z = mz; if (!z || cell === z.pos) return;
    var x = z.pos % z.w, y = Math.floor(z.pos / z.w), tx = cell % z.w, ty = Math.floor(cell / z.w), di;
    if (tx === x) di = ty < y ? 0 : 2; else if (ty === y) di = tx > x ? 1 : 3; else return;
    var n = Math.abs(tx - x) + Math.abs(ty - y), moved = false, res;
    while (n-- > 0) { res = step(di); if (res === 'done') return; if (!res) break; moved = true; }
    if (moved) drawMaze();
  }
  function bindMaze() {
    var box = document.getElementById('mazeBox'); if (!box) return;
    var down = false;
    function at(e) {
      var svg = document.getElementById('mazeSvg'); if (!svg || !mz) return;
      var r = svg.getBoundingClientRect(), W = mz.w * S + P * 2;
      var sx = (e.clientX - r.left) / r.width * W, sy = (e.clientY - r.top) / r.width * W;
      var cx = Math.floor((sx - P) / S), cy = Math.floor((sy - P) / S);
      if (cx < 0 || cy < 0 || cx >= mz.w || cy >= mz.h) return;
      moveToward(cy * mz.w + cx);
    }
    box.onpointerdown = function (e) { down = true; audio(); at(e); e.preventDefault(); };
    box.onpointermove = function (e) { if (down) { at(e); e.preventDefault(); } };
    box.onpointerup = box.onpointercancel = box.onpointerleave = function () { down = false; };
  }
  document.addEventListener('keydown', function (e) {
    if (!mz || state.screen !== 'play') return;
    var di = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 }[e.key];
    if (di === undefined) return;
    e.preventDefault();
    if (step(di) === true) drawMaze();
  });

  /* ---- matching game ---- */
  function buildMem(id, m) {
    var cards = [];
    m.icons.forEach(function (k) { cards.push({ k: k, up: false, done: false }); cards.push({ k: k, up: false, done: false }); });
    for (var i = cards.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = cards[i]; cards[i] = cards[j]; cards[j] = t; }
    return { id: id, cards: cards, first: -1, lock: false, miss: 0 };
  }
  function drawMem() {
    var box = document.getElementById('memBox'); if (!box || !mem) return;
    box.innerHTML = mem.cards.map(function (c, i) {
      var show = c.up || c.done;
      return '<button type="button" class="' + (c.done ? 'done' : c.up ? 'up' : '') + '" data-act="mem:' + i + '" aria-label="' + (show ? 'Card showing' : 'Card face down') + '"' + (c.done ? ' disabled' : '') + '>' + (show ? pic(c.k) : '<span class="back" aria-hidden="true"></span>') + '</button>';
    }).join('');
    document.getElementById('mazeStat').textContent = 'Misses: ' + mem.miss;
  }
  function flip(i) {
    var m = mem; if (!m || m.lock) return;
    var c = m.cards[i]; if (c.up || c.done) return;
    c.up = true;
    if (m.first < 0) { m.first = i; sfx.tap(); drawMem(); return; }
    var a = m.cards[m.first]; m.first = -1;
    if (a.k === c.k) {
      a.done = c.done = true; a.up = c.up = false; sfx.pick(); drawMem();
      if (m.cards.every(function (x) { return x.done; })) {
        var stars = m.miss <= 4 ? 3 : m.miss <= 9 ? 2 : 1, id = m.id;
        m.lock = true;
        setTimeout(function () { if (mem === m) { mem = null; solve(id, stars); } }, 500);
      }
    } else {
      m.miss++; m.lock = true; drawMem();
      setTimeout(function () { a.up = c.up = false; m.lock = false; if (mem === m) drawMem(); }, calm ? 1200 : 900);
    }
  }

  /* ---- players: each one has their own names, stars and saved game ---- */
  function field(id, label, value, hint, max) {
    return '<label class="field" for="f_' + id + '"><span>' + label + '</span><input id="f_' + id + '" name="' + id + '" type="text" maxlength="' + max + '" value="' + value + '" placeholder="' + hint + '" autocapitalize="words" autocomplete="off" spellcheck="false"></label>';
  }
  function whoHtml() {
    var n = [keep.hero, keep.s1, keep.s2].map(REMIX.esc), h = '<h1 id="place" tabindex="-1">Who is playing?</h1>';
    if (store.players.length > 1) {
      h += '<div class="chaps">';
      store.players.forEach(function (p, i) {
        var st = 0, k; for (k in p.ch) st += p.ch[k].best || 0;
        h += '<button class="chap" type="button" data-act="player:' + i + '"' + (i === store.cur ? ' aria-current="true"' : '') + '><span class="n">' + (i + 1) + '</span><span class="t"><b>' + REMIX.esc(p.hero || 'New player') + '</b><span>with ' + REMIX.esc(p.s1 || NAMES[1]) + ' and ' + REMIX.esc(p.s2 || NAMES[2]) + '</span></span><span class="s">' + (i === store.cur ? 'Playing now' : '<span class="on">\u2605</span> ' + st) + '</span></button>';
      });
      h += '</div>';
    }
    h += '<form class="names" id="names" autocomplete="off"><p class="small">Type the names for this player. Friends playing together can share one, like \u201cMaven and Leo\u201d.</p>' +
      field('hero', 'Your name', n[0], NAMES[0], 24) + field('s1', 'Your elephant\u2019s name', n[1], NAMES[1], 16) + field('s2', 'Your shark\u2019s name', n[2], NAMES[2], 16) +
      '<button class="go" type="submit"><span>' + (keep.named ? 'Save names' : 'Start') + '</span><span class="arrow" aria-hidden="true">\u2192</span></button></form><div class="ways">';
    if (keep.named && store.players.length < 8) h += goBtn('Add another player', 'add-player', true);
    if (store.players.length > 1) h += goBtn(removeArmed ? 'Tap again to remove this player and their stars' : 'Remove this player', 'remove-player', true);
    if (keep.named) h += goBtn('Back', 'back', true);
    return h + '</div>';
  }
  document.addEventListener('submit', function (e) {
    if (!e.target || e.target.id !== 'names') return;
    e.preventDefault();
    keep.hero = cleanName(document.getElementById('f_hero').value, 24) || NAMES[0];
    keep.s1 = cleanName(document.getElementById('f_s1').value) || NAMES[1];
    keep.s2 = cleanName(document.getElementById('f_s2').value) || NAMES[2];
    keep.named = true; sfx.tap(); saveKeep();
    state.screen = 'title'; render(true, 'place');
  });

  /* ---- live riddles from Claude on replays, when this page is allowed to ask ---- */
  function aiWaiting(id) { return !!state.remix && ai.pending === state.ch && !!REMIX.ai[id] && !state.dyn[id] && !state.fixed[id] && !isSolved(id); }
  function armWait(id) {
    clearTimeout(ai.timer);
    ai.timer = setTimeout(function () { if (state.node === id && aiWaiting(id)) { state.fixed[id] = 1; saveKeep(); if (state.screen === 'play') { talk.next = 'page'; render(false); } } }, 20000);
  }
  function askAI(chId) {
    if (ai.off || typeof ai.fn !== 'function') return;
    var ids = CH[CHI[chId]].road.order.filter(function (id) { return REMIX.ai[id]; });
    if (!ids.length) return;
    var token = ++ai.seq, salt = state.salt, p;
    ai.pending = chId;
    function done() {
      if (ai.seq !== token) return;
      ai.pending = null; clearTimeout(ai.timer);
      if (state.ch === chId && state.screen === 'play' && REMIX.ai[state.node] && !isSolved(state.node)) { talk.next = 'page'; render(false); }
    }
    try { p = ai.fn(REMIX.prompt(ids, keep.aiUsed), { modelTier: 'default', cache: false }); } catch (e) { done(); return; }
    Promise.resolve(p).then(function (res) {
      if (ai.seq !== token || state.ch !== chId || !state.remix || state.salt !== salt) return;
      REMIX.parse(res && res.text, ids, salt).forEach(function (it) {
        if (isSolved(it.id) || state.fixed[it.id] || (state.wrong[it.id] || []).length) return;
        state.dyn[it.id] = it.node; keep.aiUsed.push(it.answer);
      });
      keep.aiUsed = keep.aiUsed.slice(-40); saveKeep();
    }, function (err) { if (err && err.code === 'not_granted') ai.off = true; }).then(done, done);
  }

  /* ---- maps ---- */
  function worldInfo() {
    return CH.map(function (c, i) { return { id: c.id, n: i + 1, title: c.title, done: !!keep.ch[c.id], open: unlocked(i), here: keep.save ? keep.save.ch === c.id : (unlocked(i) && !keep.ch[c.id]) }; });
  }
  function roadSvg(c) {
    var rd = c.road, rows = {}, maxD = 0, pos = {}, s = '', W = 320, RH = 50;
    rd.order.forEach(function (id) { var d = rd.depth[id]; (rows[d] = rows[d] || []).push(id); if (d > maxD) maxD = d; });
    for (var d = 0; d <= maxD; d++) rows[d].forEach(function (id, i) { pos[id] = [W * (i + 1) / (rows[d].length + 1), 28 + d * RH]; });
    var path = state.ch === c.id ? state.path : [];
    function walked(a, b) { for (var i = 1; i < path.length; i++) if (path[i - 1] === a && path[i] === b) return true; return false; }
    rd.order.forEach(function (id) {
      nexts(id).forEach(function (t) {
        var a = pos[id], b = pos[t], w = walked(id, t);
        s += '<path d="M' + a[0] + ',' + a[1] + ' L' + b[0] + ',' + b[1] + '" stroke="' + (w ? '#ffd35c' : '#aab7d6') + '" stroke-width="' + (w ? 3.4 : 1.6) + '"' + (w ? '' : ' stroke-dasharray="2 6" opacity="0.6"') + ' stroke-linecap="round"/>';
      });
    });
    rd.order.forEach(function (id) {
      var p = pos[id], n = path.indexOf(id), here = id === state.node && state.ch === c.id, before = keep.seen.indexOf(id) !== -1;
      if (here) s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="20" fill="#ffd35c" opacity="0.25"/>';
      if (n !== -1) s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="#ffd35c"/><text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#0a1226">' + (n + 1) + '</text>';
      else if (before) s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="#1b2948" stroke="#93dbb0" stroke-width="2.4"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#93dbb0"/>';
      else s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="#1b2948" stroke="#aab7d6" stroke-width="1.6" stroke-dasharray="3 4"/><text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-size="14" font-weight="700" fill="#aab7d6">?</text>';
    });
    var H = 56 + maxD * RH;
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Road map of this chapter">' + s + '</svg>';
  }

  /* ---- read-aloud: the storyteller reads the page, and each character has their own voice ---- */
  function sayHtml() {
    if (!VOICE.can) return '';
    return '<div class="say"><button class="chip talk" type="button" data-act="say" aria-pressed="false"><span>\u25b6 Read to me</span></button>' +
      '<button class="chip" type="button" data-act="say-all" aria-pressed="' + !!keep.read + '"><span>Read every page: ' + (keep.read ? 'On' : 'Off') + '</span></button>' +
      (talk.mute ? '<p class="small" role="status">This device has no reading voice turned on.</p>' : '') + '</div>';
  }
  function sayList(mode) {
    var out = [];
    function add(who, text, mark) { text = nmText(VOICE.plain(text)); if (/[\p{L}\p{N}]/u.test(text)) out.push({ who: who, text: text, mark: mark }); }
    function each(list, k) { list.forEach(function (ps, i) { ps.forEach(function (p) { add(p.who, p.text, k + i); }); }); }
    if (state.screen === 'title') { add('narrator', 'Blink and the Riddle Road.', 'T'); TITLE.forEach(function (p, i) { add('narrator', p, 't' + i); }); return out; }
    var id = state.node, n = N(id), g = game(n), done = isSolved(id), wait = aiWaiting(id), r = n.riddle, wrong = state.wrong[id] || [];
    var pg = VOICE.page(id, wait ? { text: REMIX.lead(id, state.salt) } : n, STORY[id], REMIX.ai[id] && REMIX.ai[id][0]);
    if (mode !== 'after') {
      each(pg.text, 't');
      if (wait) return out;
      if (r && !done) {
        r.lines.forEach(function (l, i) { add(pg.asker, l, 'l' + i); });
        if (!r.knock) add('narrator', r.options.filter(function (o, i) { return wrong.indexOf(i) === -1; }).map(function (o) { return VOICE.plain(o.label); }).join('. ') + '.', 'o');
      } else if (r) add('narrator', 'The answer is: ' + rightAnswer(id, r) + '.', 'n');
      else if (g && !done) add('narrator', n.maze ? mazeTip(n.maze) : MEM_TIP, 'm');
    }
    if (g && !done) return out;
    if (g) each(pg.after, 'a');
    if (n.ending) add('narrator', endLine(), 'e');
    else { if (n.ask) add('narrator', n.ask, 'w'); add('narrator', n.choices.map(function (c) { return VOICE.plain(c.label); }).join('. ') + '.', 'w'); }
    return out;
  }
  function markEl(mark) {
    var w = scene.querySelectorAll('.words'), k = mark ? mark[0] : '', i = +String(mark).slice(1);
    if (k === 'T') return scene.querySelector('h1');
    if (k === 't') return w[0] && w[0].children[i];
    if (k === 'a') return w[1] && w[1].children[i];
    if (k === 'l') return scene.querySelectorAll('.riddle .lines span')[i];
    return scene.querySelector({ o: '.picks', n: '.answer', m: '.riddle .small', e: '.score', w: '#scene > .ways', h: '#hint' }[k] || '.none');
  }
  function unmark() { var el = scene.querySelector('.now'); if (el) el.classList.remove('now'); }
  function sayBtn() {
    var b = scene.querySelector('[data-act="say"]'); if (!b) return;
    b.setAttribute('aria-pressed', talk.on); b.querySelector('span').textContent = talk.on ? '\u25a0 Stop reading' : '\u25b6 Read to me';
  }
  function stopSay() { talk.on = false; VOICE.stop(); unmark(); sayBtn(); }
  function startSay(parts) {
    talk.moved = false;
    talk.on = VOICE.say(parts, function (mark) {
      unmark(); var el = markEl(mark); if (!el) return;
      el.classList.add('now');
      if (!talk.moved) { var b = el.getBoundingClientRect(); if (b.top < 60 || b.bottom > window.innerHeight - 20) el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' }); }
    }, function (mine, started) {
      if (!mine) return;
      talk.on = false; unmark(); sayBtn();
      if (!started && !talk.mute) { talk.mute = true; var row = scene.querySelector('.say'); if (row) row.insertAdjacentHTML('beforeend', '<p class="small" role="status">This device has no reading voice turned on.</p>'); }
      else if (started) talk.mute = false;
    });
    sayBtn();
  }
  function sayHint(text) { if (keep.read && VOICE.can && text) startSay([{ who: 'narrator', text: nmText(VOICE.plain(text)), mark: 'h' }]); }
  window.addEventListener('touchmove', function () { talk.moved = true; }, { passive: true });
  window.addEventListener('wheel', function () { talk.moved = true; }, { passive: true });
  window.addEventListener('pagehide', function () { stopSay(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopSay(); });

  /* ---- screens ---- */
  function drawHud() {
    var playing = state.screen === 'play' || state.screen === 'road';
    var n = Math.min(state.solved.length, PER), h = '';
    h += state.screen === 'title' ? '<span class="brand"></span>' : '<button class="brand" type="button" data-act="title">' + (playing ? 'Chapter ' + (CHI[state.ch] + 1) + ': ' + chapter().title : 'Blink and the Riddle Road') + '</button>';
    if (playing) {
      h += '<span class="meter" role="img" aria-label="Blink’s glow: ' + n + ' of ' + PER + ' puzzles solved"><span class="dots">';
      for (var i = 0; i < PER; i++) h += '<span class="dot' + (i < n ? ' lit' : '') + '"></span>';
      h += '</span></span><span class="tally" aria-label="' + starTotal() + ' stars in this chapter"><span class="on">★</span> ' + starTotal() + '</span>';
      if (state.screen === 'play') h += '<button class="chip" type="button" data-act="road">Road map</button>';
    }
    if (keep.named && state.screen !== 'world') h += '<button class="chip" type="button" data-act="world">World map</button>';
    if (keep.named && state.screen !== 'book') h += '<button class="chip" type="button" data-act="book">Riddle Book</button>';
    h += '<button class="chip" type="button" data-act="sound" aria-pressed="' + keep.sound + '">Sound ' + (keep.sound ? 'on' : 'off') + '</button>';
    hud.innerHTML = h;
  }

  function drawArt() {
    var key, o = { power: state.solved.length }, n = N(state.node), k;
    art.classList.remove('map');
    if (state.screen === 'world') { art.classList.add('map'); art.innerHTML = ART.world(worldInfo()); return; }
    if (state.screen === 'road') { art.innerHTML = ART.draw(chapter().art, o); return; }
    if (state.screen === 'title') { key = 'bedroom'; o.power = keep.save ? keep.save.solved.length : 0; }
    else if (state.screen === 'book') { key = 'tree'; o.power = 8; o.lights = Math.min(110, keep.found.length * 2); }
    else {
      key = n.art || (state.node === 'start' || state.node === 'home' ? 'bedroom' : ART.has(state.node) ? state.node : chapter().art);
      if (n.ending && isSolved(state.node)) key = 'bedroom';
      if (key === 'tree') o.lights = isSolved('tree') ? 90 : 0;
    }
    if (state.screen === 'play' && n.artOpt) for (k in n.artOpt) o[k] = n.artOpt[k];
    art.innerHTML = nmHtml(ART.draw(key, o));
  }

  var TITLE = [
    'Blink the firefly needs your help, Maven. So do his friends.',
    'There are 10 chapters and 80 puzzles: riddles, mazes, matching games, patterns, and number puzzles.',
    'Earn up to 3 stars on every puzzle. Play a chapter again and its puzzles and mazes change.'
  ];
  function titleHtml() {
    var h = '<h1>Blink and the Riddle Road</h1>', done = Object.keys(keep.ch).length;
    h += sayHtml() + paras(TITLE);
    h += '<p class="small">Chapters finished: <b>' + done + '</b> of ' + CH.length + '  ·  Stars: <b>' + allStars() + '</b> of ' + (CH.length * PER * 3) + '</p>';
    h += '<div class="ways">';
    var note = state.note; state.note = '';
    if (note) h += '<p class="saved" id="note" tabindex="-1" role="status">' + (note === 'wiped' ? 'All clear. Your game is new again.' : memoryOnly ? 'Stopped for now.' : 'Saved. Tap \u201cKeep going\u201d to pick up right where you stopped.') + '</p>';
    if (keep.save) h += goBtn('Keep going: Chapter ' + (CHI[keep.save.ch] + 1), 'resume') + sureBtn('Start Chapter ' + (CHI[keep.save.ch] + 1) + ' over', 'over');
    else if (!done) h += goBtn('Play', 'chapter:c1');
    h += goBtn('World map', 'world', !!keep.save || !done ? true : false);
    h += goBtn('Riddle Book: ' + keep.found.length + ' of ' + RIDDLES.length + ' found', 'book', true);
    h += goBtn('Players: Maven with Ella and Sharky', 'who', true);
    if (keep.save || done || keep.found.length) h += sureBtn('Start the whole game over', 'wipe');
    return h + '</div><p class="small">' + (memoryOnly ? 'This device is not saving your progress right now. It will last until you close the game.' : 'Your game saves by itself after every puzzle, on this device.') + '</p>';
  }

  function worldHtml() {
    var h = '<p class="place" id="place" tabindex="-1">World map</p>';
    h += '<p class="small">Tap a place on the map, or pick a chapter below. Finish a chapter to open the next one. Play a finished chapter again and its puzzles and mazes change.</p>';
    h += '<button class="chip wide" type="button" data-act="remix" aria-pressed="' + keep.remix + '">New puzzles on replays: ' + (keep.remix ? 'On' : 'Off') + '</button><div class="chaps">';
    CH.forEach(function (c, i) {
      var open = unlocked(i), rec = keep.ch[c.id], saved = keep.save && keep.save.ch === c.id;
      h += '<button class="chap" type="button"' + (open ? ' data-act="chapter:' + c.id + '"' : ' disabled') + '><span class="n">' + (i + 1) + '</span><span class="t"><b>' + c.title + '</b><span>' +
        (open ? (saved ? 'In the middle of this one. Tap to keep going.' : c.blurb) : 'Finish chapter ' + i + ' first.') + '</span></span><span class="s">' +
        (rec ? '<span class="on">★</span> ' + rec.best + '/' + (PER * 3) : open ? 'New' : '') + '</span></button>';
    });
    return h + '</div><div class="ways">' + goBtn(state.back === 'play' ? 'Back to the story' : 'Back', 'back', true) + '</div>';
  }

  function roadHtml() {
    var c = chapter(), h = '<p class="place" id="place" tabindex="-1">Road map: ' + c.title + '</p>';
    h += '<div class="road">' + roadSvg(c) + '</div>';
    h += '<p class="small"><span class="key gold"></span> where you went tonight, in order  <span class="key green"></span> places you found on another night  <span class="key none"></span> not explored yet</p>';
    h += '<ol class="trail">' + state.path.map(function (id) { return '<li>' + STORY[id].place + (id === state.node ? ' <b>(you are here)</b>' : '') + '</li>'; }).join('') + '</ol>';
    return h + '<div class="ways">' + goBtn('Back to the story', 'back') + '</div>';
  }

  function bookHtml() {
    var h = '<p class="place" id="place" tabindex="-1">Riddle Book</p>';
    h += '<p class="small">You have found ' + keep.found.length + ' of ' + RIDDLES.length + ' riddles. Each one you find lights up the Lantern Tree. Tap a riddle to read it again.</p><div class="book">';
    CH.forEach(function (c, i) {
      h += '<h2>Chapter ' + (i + 1) + ': ' + c.title + '</h2>';
      c.road.order.forEach(function (id) {
        var n = STORY[id]; if (!n.riddle) return;
        if (keep.found.indexOf(id) !== -1) {
          h += '<details class="entry"><summary><span class="pic">' + optIcon(id, rightIndex(id)) + '</span><span class="ans">' + rightAnswer(id) + '</span><span class="where">' + n.place + '</span></summary>' +
            (n.riddle.seq ? seqHtml(n.riddle.seq) : '') + '<p class="lines">' + n.riddle.lines.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</p></details>';
        } else {
          h += '<div class="entry locked">' + pic('unknown') + '<span class="ans">Not found yet</span><span class="where">' + n.place + '</span></div>';
        }
      });
    });
    h += '</div>';
    if (memoryOnly) h += '<p class="small">This device is not saving your progress right now. It will last until you close the game.</p>';
    return h + '<div class="ways">' + goBtn(state.back === 'play' ? 'Back to the story' : 'Back', 'back') + '</div>';
  }

  function waysHtml(n) {
    var h = '<div class="ways">';
    if (n.ask) h += '<p class="ask">' + n.ask + '</p>';
    n.choices.forEach(function (c, i) { h += goBtn(c.label, 'go:' + i); });
    return h + '</div>';
  }

  function riddleHtml(id, n) {
    var r = n.riddle, done = isSolved(id), wrong = state.wrong[id] || [], h = '';
    h += '<section class="riddle" aria-label="Riddle"><p class="tag">' + (r.seq ? 'Pattern' : 'Riddle') + '</p>';
    if (r.seq) h += seqHtml(r.seq);
    h += '<p class="lines">' + r.lines.map(function (l) { return '<span>' + l + '</span>'; }).join('') + '</p>';
    if (done) {
      h += '<div class="answer" id="answer" tabindex="-1"><span class="pic">' + optIcon(id, rightIndex(id, r), r) + '</span><span>Answer: ' + rightAnswer(id, r) + ' ' + starsHtml(state.stars[id] || 1) + '</span></div>';
    } else if (r.knock) {
      h += '<div class="knock"><button class="knocker" type="button" data-act="knock" aria-label="' + r.knock.verb + '"><span>' + r.knock.verb + '</span></button>' +
        '<p class="count" id="count" aria-live="polite">' + r.knock.noun + ': ' + state.knocks + '</p></div>' +
        '<div class="row"><button class="pick" type="button" data-act="knock-reset">Start over</button>' +
        '<button class="pick strong" type="button" data-act="knock-open">' + r.knock.done + '</button></div>';
      h += '<p class="hint" id="hint" role="status" aria-live="polite">' + (wrong.length ? knockHint(wrong[wrong.length - 1], r.knock) : '') + '</p>';
    } else {
      h += '<div class="picks">';
      r.options.forEach(function (o, i) {
        h += '<button class="pick card" type="button" data-act="pick:' + i + '"' + (wrong.indexOf(i) !== -1 ? ' disabled' : '') + '><span class="pic">' + optIcon(id, i, r) + '</span><span class="lbl">' + o.label + '</span></button>';
      });
      h += '</div><p class="hint" id="hint" role="status" aria-live="polite">' + (wrong.length ? REMIX.esc(r.options[wrong[wrong.length - 1]].hint) : '') + '</p>';
    }
    return h + '</section>';
  }

  var MEM_TIP = 'Tap two cards. If they match, they stay. Find all 6 pairs.';
  function mazeTip(m) {
    var tip = 'Slide your finger along the path to lead Blink, or tap the arrows. Pick up the 3 green lights, then go to the gold door.';
    if (m.kind === 'key') tip += ' The door is locked until you find the key.';
    if (m.kind === 'fog') tip += ' It is dark. You can only see close to Blink.';
    return tip;
  }
  function mazeHtml(id, n) {
    var tip = mazeTip(n.maze);
    return '<section class="riddle maze" aria-label="Maze"><p class="tag">Maze</p><p class="small">' + tip + '</p><div id="mazeBox"></div>' +
      '<p class="count" id="mazeStat" aria-live="polite"></p><div class="pad">' +
      '<button type="button" class="u" data-act="mv:0" aria-label="Up">↑</button><button type="button" class="l" data-act="mv:3" aria-label="Left">←</button>' +
      '<button type="button" class="d" data-act="mv:2" aria-label="Down">↓</button><button type="button" class="r" data-act="mv:1" aria-label="Right">→</button></div>' +
      '<p class="hint" id="hint" role="status" aria-live="polite"></p></section>';
  }
  function memHtml() {
    return '<section class="riddle" aria-label="Matching game"><p class="tag">Matching game</p><p class="small">' + MEM_TIP + '</p>' +
      '<div class="mem" id="memBox"></div><p class="count" id="mazeStat" aria-live="polite"></p></section>';
  }
  function doneHtml(id, label) {
    return '<section class="riddle"><div class="answer" id="answer" tabindex="-1"><span>' + label + ' ' + starsHtml(state.stars[id] || 1) + '</span></div></section>';
  }

  function endLine() { var i = CHI[state.ch]; return CH[i + 1] ? 'Chapter ' + (i + 1) + ' is done. Good night.' : 'The End. You finished the whole game!'; }
  function endHtml() {
    var i = CHI[state.ch], next = CH[i + 1], rec = keep.ch[state.ch] || { best: starTotal() }, last = !next;
    var h = '<div class="score"><p class="end">' + endLine() + '</p>' +
      '<p>Stars this time: <b>' + starTotal() + '</b> of ' + (PER * 3) + '  ·  Your best: <b>' + rec.best + '</b></p>' +
      '<p>Riddle Book: <b>' + keep.found.length + '</b> of ' + RIDDLES.length + ' found' + (state.fresh.length ? ' (' + state.fresh.length + ' new tonight)' : '') + '</p>' +
      (last ? '<p>All your stars: <b>' + allStars() + '</b> of ' + (CH.length * PER * 3) + '</p>' : '<p class="small">The next chapter will be waiting tomorrow night.</p>') + '</div>';
    h += '<div class="ways">';
    if (next) h += goBtn('Next: Chapter ' + (i + 2) + ', ' + next.title, 'chapter:' + next.id);
    h += goBtn('See the road you took', 'road', true) + goBtn('Play this chapter again', 'again', true) + goBtn('World map', 'world', true);
    return h + '</div>';
  }

  function playHtml() {
    var n = N(state.node), h = playBody();
    return n.ending && isSolved(state.node) ? h : h + toolsHtml();
  }
  function playBody() {
    var id = state.node, n = N(id), h = '', g = game(n), done = isSolved(id), wait = aiWaiting(id);
    h += '<p class="place" id="place" tabindex="-1">' + n.place + '</p>' + sayHtml() + paras(wait ? REMIX.lead(id, state.salt) : n.text);
    if (!g) return h + waysHtml(n);
    if (wait) return h + '<section class="riddle" aria-live="polite"><p class="tag">Riddle</p><p class="lines"><span>Blink is thinking up a new riddle\u2026</span></p></section>';
    if (n.riddle) h += riddleHtml(id, n);
    else if (done) h += doneHtml(id, n.maze ? 'Maze done!' : 'All matched!');
    else h += n.maze ? mazeHtml(id, n) : memHtml();
    if (done) { h += paras(g.after); h += n.ending ? endHtml() : waysHtml(n); }
    return h;
  }

  function render(animate, focusId) {
    if (state.screen === 'title' && !keep.named) state.screen = 'who';
    var sc = state.screen, n = N(state.node), next = talk.next;
    sure = ''; talk.next = ''; talk.on = false; VOICE.stop();
    scene.innerHTML = sc === 'who' ? whoHtml() : nmHtml(sc === 'title' ? titleHtml() : sc === 'world' ? worldHtml() : sc === 'road' ? roadHtml() : sc === 'book' ? bookHtml() : playHtml());
    if (sc === 'play' && aiWaiting(state.node)) armWait(state.node);
    if (sc === 'play' && !isSolved(state.node)) {
      if (n.maze) { if (!mz || mz.id !== state.node) mz = buildMaze(state.node, n.maze); drawMaze(); bindMaze(); }
      else mz = null;
      if (n.memory) { if (!mem || mem.id !== state.node) mem = buildMem(state.node, n.memory); drawMem(); }
      else mem = null;
    }
    drawHud();
    drawArt();
    syncFlies();
    if (animate && !calm) { scene.classList.remove('enter'); void scene.offsetWidth; scene.classList.add('enter'); }
    if (focusId) {
      var el = document.getElementById(focusId);
      if (focusId === 'place' || !el) { window.scrollTo(0, 0); if (el) el.focus({ preventScroll: true }); }
      else { el.focus({ preventScroll: true }); el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' }); }
    }
    if (calm) paint(0);
    if (next && keep.read && VOICE.can && sc === 'play') startSay(sayList(next));
  }

  function solve(id, stars) {
    if (isSolved(id)) return;
    var tries = (state.wrong[id] || []).length, n = STORY[id];
    state.solved.push(id);
    state.stars[id] = stars || (tries === 0 ? 3 : tries === 1 ? 2 : 1);
    if (n.riddle && keep.found.indexOf(id) === -1) { keep.found.push(id); state.fresh.push(id); }
    if (n.ending) {
      var best = Math.max(starTotal(), (keep.ch[state.ch] && keep.ch[state.ch].best) || 0);
      keep.ch[state.ch] = { best: best };
      sfx.end();
    } else sfx.right();
    saveKeep();
    talk.next = 'after';
    render(false, 'answer');
  }
  function miss(id, what, hint) {
    if (!state.wrong[id]) state.wrong[id] = [];
    state.wrong[id].push(what);
    sfx.wrong();
    saveKeep();
    document.getElementById('hint').textContent = nmText(hint);
    sayHint(hint);
  }
  function visit(id) {
    state.node = id; state.knocks = 0;
    if (state.path[state.path.length - 1] !== id) state.path.push(id);
    if (keep.seen.indexOf(id) === -1) keep.seen.push(id);
  }
  function startChapter(id) {
    mz = null; mem = null;
    if (keep.save && keep.save.ch === id) { resume(); return; }
    state = fresh(id); state.screen = 'play'; state.live = true;
    if (keep.remix && keep.ch[id]) { var rr = REMIX.roll(CH[CHI[id]].road.order); state.remix = true; state.dyn = rr.dyn; state.salt = rr.salt; }
    if (keep.seen.indexOf(state.node) === -1) keep.seen.push(state.node);
    keep.save = null;
    if (state.remix) askAI(id);
    talk.next = 'page';
    saveKeep(); render(true, 'place');
  }
  function resume() {
    var s = keep.save;
    if (s && STORY[s.node]) {
      state = fresh(s.ch);
      state.node = s.node; state.path = s.path || [s.node]; state.solved = s.solved || []; state.wrong = s.wrong || {}; state.stars = s.stars || {}; state.fresh = s.fresh || []; state.knocks = s.knocks || 0; state.dyn = s.dyn || {}; state.fixed = s.fixed || {}; state.remix = !!s.remix; state.salt = s.salt || 0;
    }
    state.screen = 'play'; state.live = true; talk.next = 'page'; render(true, 'place');
  }

  function act(a, b) {
    var id = state.node, n = N(id);
    if (a !== 'remove-player') removeArmed = false;
    if (a !== sure) unsure();
    if (a === 'over' || a === 'wipe') {
      sfx.tap();
      if (sure !== a) { sure = a; b.querySelector('span').textContent = SURE[a]; return; }
      sure = ''; mz = null; mem = null;
      if (a === 'over') {
        var oc = state.screen === 'play' ? state.ch : keep.save && keep.save.ch;
        if (CHI[oc] === undefined) return;
        keep.save = null; state.live = false; startChapter(oc); return;
      }
      keep.found = []; keep.seen = []; keep.ch = {}; keep.save = null; keep.aiUsed = [];
      ai.pending = null; ai.seq++; clearTimeout(ai.timer);
      state = fresh(); state.note = 'wiped';
      saveKeep(); render(true, 'note'); return;
    }
    if (a === 'say') { if (talk.on) stopSay(); else startSay(sayList('page')); return; }
    if (a === 'say-all') {
      keep.read = !keep.read; saveKeep();
      b.setAttribute('aria-pressed', keep.read); b.querySelector('span').textContent = 'Read every page: ' + (keep.read ? 'On' : 'Off');
      if (keep.read) startSay(sayList('page')); else stopSay();
      return;
    }
    if (a === 'stop') { sfx.tap(); saveKeep(); state.screen = 'title'; state.note = 'saved'; render(true, 'note'); return; }
    if (a === 'sound') { keep.sound = !keep.sound; saveKeep(); drawHud(); if (keep.sound) sfx.tap(); return; }
    if (a === 'title') { sfx.tap(); saveKeep(); state.screen = 'title'; render(true, 'place'); return; }
    if (a === 'world' || a === 'book' || a === 'road') {
      sfx.tap();
      if (state.screen === 'play' || state.screen === 'title') state.back = state.screen;
      state.screen = a; render(true, 'place'); return;
    }
    if (a === 'back') { sfx.tap(); state.screen = state.back === 'play' ? 'play' : 'title'; render(true, 'place'); return; }
    if (a === 'resume') { sfx.tap(); resume(); return; }
    if (a === 'again') { sfx.tap(); keep.save = null; startChapter(state.ch); return; }
    if (a === 'remix') { sfx.tap(); keep.remix = !keep.remix; saveKeep(); render(false); return; }
    if (a === 'who') { sfx.tap(); saveKeep(); state.back = 'title'; state.screen = 'who'; render(true, 'place'); return; }
    if (a.indexOf('player:') === 0 || a === 'add-player' || a === 'remove-player') {
      sfx.tap(); saveKeep();
      if (a === 'remove-player') {
        if (store.players.length < 2) return;
        if (!removeArmed) { removeArmed = true; render(false); return; }
        removeArmed = false; store.players.splice(store.cur, 1); store.cur = 0;
      } else if (a === 'add-player') { if (store.players.length >= 8) return; store.players.push(newPlayer()); store.cur = store.players.length - 1; }
      else { var pi = +a.slice(7); if (!store.players[pi]) return; store.cur = pi; }
      keep = store.players[store.cur]; mz = null; mem = null; ai.pending = null; ai.seq++;
      state = fresh(); state.screen = keep.named ? 'title' : 'who';
      saveKeep(); render(true, 'place'); return;
    }
    if (a.indexOf('chapter:') === 0) {
      var cid = a.slice(8);
      if (CHI[cid] === undefined || !unlocked(CHI[cid])) return;
      sfx.tap(); startChapter(cid); return;
    }
    if (state.screen !== 'play') return;
    if (a.indexOf('go:') === 0) { sfx.tap(); visit(n.choices[+a.slice(3)].to); saveKeep(); talk.next = 'page'; render(true, 'place'); return; }
    if (a.indexOf('pick:') === 0) {
      var i = +a.slice(5), o = n.riddle.options[i];
      if (o.correct) solve(id); else { b.disabled = true; miss(id, i, o.hint); }
      return;
    }
    if (a.indexOf('mv:') === 0) { if (step(+a.slice(3)) === true) drawMaze(); return; }
    if (a.indexOf('mem:') === 0) { flip(+a.slice(4)); return; }
    var kn = n.riddle && n.riddle.knock;
    if (!kn) return;
    if (a === 'knock') {
      state.knocks++; sfx.knock();
      document.getElementById('count').textContent = kn.noun + ': ' + state.knocks;
      if (!calm) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
      return;
    }
    if (a === 'knock-reset') { sfx.tap(); state.knocks = 0; document.getElementById('count').textContent = kn.noun + ': 0'; return; }
    if (a === 'knock-open') {
      if (state.knocks === kn.n) { solve(id); return; }
      var k = state.knocks, hint = knockHint(k, kn);
      if (k === 0) { document.getElementById('hint').textContent = hint; sayHint(hint); return; }
      state.knocks = 0; document.getElementById('count').textContent = kn.noun + ': 0';
      miss(id, k, hint);
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b || b.disabled) return;
    act(b.getAttribute('data-act'), b);
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('spot')) { e.preventDefault(); act(e.target.getAttribute('data-act'), e.target); }
  });

  /* ---- night sky behind everything ---- */
  var cv = document.getElementById('sky'), cx = cv.getContext('2d');
  var W = 0, H = 0, flies = [];
  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * d); cv.height = Math.round(H * d);
    cx.setTransform(d, 0, 0, d, 0, 0);
    if (calm) paint(0);
  }
  function wanted() {
    if (state.screen === 'book') return 4 + Math.min(30, keep.found.length);
    if (state.screen !== 'play') return 6;
    var n = STORY[state.node];
    if (n.ending && isSolved(state.node)) return 46;
    if (state.node === 'tree' && isSolved('tree')) return 40;
    if (n.maze && !isSolved(state.node)) return 0;
    return 3 + state.solved.length * 3;
  }
  function syncFlies() {
    var w = wanted();
    while (flies.length < w) flies.push({ x: Math.random(), y: Math.random(), d: Math.random() * 6.28, sp: 0.00025 + Math.random() * 0.0004, w: 0.6 + Math.random() * 1.2, p: Math.random() * 6.28, r: 1.4 + Math.random() * 1.3 });
    if (flies.length > w) flies.length = w;
  }
  function paint(t) {
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = '#ffd35c';
    for (var j = 0; j < flies.length; j++) {
      var f = flies[j];
      var a = calm ? 0.5 : 0.15 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.001 * f.w + f.p));
      var x = f.x * W, y = f.y * H;
      cx.globalAlpha = a * 0.16;
      cx.beginPath(); cx.arc(x, y, f.r * 4.5, 0, 6.2832); cx.fill();
      cx.globalAlpha = a;
      cx.beginPath(); cx.arc(x, y, f.r, 0, 6.2832); cx.fill();
    }
    cx.globalAlpha = 1;
  }
  function tick(t) {
    for (var j = 0; j < flies.length; j++) {
      var f = flies[j];
      f.d += (Math.random() - 0.5) * 0.12;
      f.x += Math.cos(f.d) * f.sp;
      f.y += Math.sin(f.d) * f.sp;
      if (f.x < -0.03) f.x = 1.03; else if (f.x > 1.03) f.x = -0.03;
      if (f.y < -0.03) f.y = 1.03; else if (f.y > 1.03) f.y = -0.03;
    }
    paint(t);
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', size);

  function start(data) {
    loadKeep();
    if (window.claude && typeof window.claude.use === 'function') window.claude.use('sample').then(function (s) { ai.fn = typeof s === 'function' ? s : null; }, function () { ai.fn = null; });
    else ai.fn = null;
    if (data && typeof data.node === 'string' && STORY[data.node] && CHI[data.ch] !== undefined) {
      var s = fresh(data.ch);
      for (var k in s) if (data[k] !== undefined) s[k] = data[k];
      state = s;
    }
    size();
    render(false);
    if (!calm) requestAnimationFrame(tick);
  }

  window.__rr = { say: sayList, talk: talk, maze: function () { return mz; }, mem: function () { return mem; }, state: function () { return state; }, node: N, ai: ai };
  var hot = window.claude && window.claude.hot;
  if (hot && typeof hot.snapshot === 'function') hot.snapshot(function () { return state; });
  if (hot && typeof hot.ready === 'function') hot.ready(start);
  else start((hot && hot.data) || {});
})();
