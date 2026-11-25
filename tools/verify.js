const fs = require('fs'), d = require('path').join(__dirname, '..', 'src') + '/';
const src = ['story.js', 'chapters_a.js', 'chapters_b.js', 'icons.js', 'remix.js', 'voice.js'].map(f => fs.readFileSync(d + f, 'utf8')).join('\n') + '\nreturn {STORY, CHAPTERS, ICON, REMIX, VOICE};';
const { STORY, CHAPTERS, ICON, REMIX, VOICE } = new Function(src)();
const bad = [], ints = s => (String(s).match(/\d+/g) || []).map(Number), strip = s => String(s).replace(/<[^>]+>/g, '');
const right = r => r.options.find(o => o.correct).label;
const flag = (id, m, r) => bad.push(id + ': ' + m + ' :: ' + (r ? r.lines.join(' / ') + ' => ' + r.options.map(o => (o.correct ? '*' : '') + o.label).join(' | ') : ''));
const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextNumber(seq) { // independent solver: constant step, doubling, growing step, or sum of the two before
  const dif = seq.slice(1).map((v, i) => v - seq[i]), out = new Set();
  if (dif.every(x => x === dif[0])) out.add(seq[seq.length - 1] + dif[0]);
  if (seq.slice(1).every((v, i) => v === 2 * seq[i])) out.add(seq[seq.length - 1] * 2);
  if (dif.slice(1).every((x, i) => x - dif[i] === 1)) out.add(seq[seq.length - 1] + dif[dif.length - 1] + 1);
  if (seq.length > 3 && seq.slice(2).every((v, i) => v === seq[i] + seq[i + 1])) out.add(seq[seq.length - 1] + seq[seq.length - 2]);
  return [...out];
}
function period(seq) { for (let p = 1; p < seq.length; p++) if (seq.every((v, i) => i < p || v === seq[i - p])) return p; return seq.length; }
function perms(a) { return a.length < 2 ? [a] : a.flatMap((x, i) => perms(a.filter((_, j) => j !== i)).map(p => [x, ...p])); }
const SOLVE = {
  row(id, n) { // order comes from the story text; clues from the riddle lines
    const r = n.riddle, cols = ['gray', 'white', 'speckled', 'black', 'red', 'blue', 'gold', 'green', 'purple'], t = strip(n.text[0]).split('From left to right')[1] || strip(n.text[0]).split('from left to right')[1];
    const order = (t.match(new RegExp('\\b(' + cols.join('|') + ')\\b', 'g')) || []);
    if (order.length !== 4) return flag(id, 'row order not readable', r);
    let cand = [0, 1, 2, 3];
    r.lines.forEach(l => {
      let m;
      if (/not at either end/.test(l)) cand = cand.filter(i => i !== 0 && i !== 3);
      else if ((m = l.match(/not next to the (\w+)/))) { const x = order.indexOf(m[1]); cand = cand.filter(i => Math.abs(i - x) !== 1); }
      else if ((m = l.match(/to the (left|right) of the (\w+)/))) { const x = order.indexOf(m[2]); cand = cand.filter(i => m[1] === 'left' ? i < x : i > x); }
      else if ((m = l.match(/not under the (\w+)/))) { const x = order.indexOf(m[1]); cand = cand.filter(i => i !== x); }
    });
    if (cand.length !== 1) return flag(id, 'row logic has ' + cand.length + ' answers', r);
    if (!new RegExp('\\b' + order[cand[0]] + '\\b').test(right(r))) flag(id, 'row logic answer mismatch, solver says ' + order[cand[0]], r);
    if (r.options.map(o => o.label.match(/The (\w+)/)[1]).join() !== order.join()) flag(id, 'choices not in row order', r);
    r.options.forEach((o, i) => { if (!o.correct && /at the (left|right) end/.test(o.hint)) { const side = o.hint.match(/at the (left|right) end/)[1]; if ((side === 'left') !== (i === 0) || (i !== 0 && i !== 3)) flag(id, 'end hint wrong for ' + o.label, r); } });
  },
  num(id, n, f) { const r = n.riddle, v = f(r.lines.map(ints)); if (String(v) !== String(ints(right(r))[0]) || !Number.isInteger(v) || v < 1) flag(id, 'arithmetic: solver says ' + v, r); },
  numSeq(id, n) { const r = n.riddle, seq = r.seq.map(k => +k.slice(4)), nx = nextNumber(seq); if (nx.length !== 1 || nx[0] !== ints(right(r))[0]) flag(id, 'number pattern: solver says ' + nx, r); if (r.lines[0].includes('...') && ints(r.lines[0]).join() !== seq.join()) flag(id, 'pattern text differs from pictures', r); },
  letSeq(id, n) { const r = n.riddle, ix = r.seq.map(k => A.indexOf(k.slice(4))), st = ix[1] - ix[0]; if (!ix.slice(1).every((v, i) => v - ix[i] === st) || A[ix[ix.length - 1] + st] !== right(r)) flag(id, 'letter pattern', r); },
  picSeq(id, n) { const r = n.riddle, p = period(r.seq), want = r.seq[r.seq.length - p], ans = r.options.find(o => o.correct).icon; if (p > r.seq.length / 2) flag(id, 'pattern does not repeat fully (period ' + p + ' of ' + r.seq.length + ')', r); if (want !== ans) flag(id, 'picture pattern: solver says ' + want, r); },
  clock(id, n) { const r = n.riddle, seq = r.seq.map(k => +k.slice(4)), k = ints(r.lines[0])[0]; if (!seq.slice(1).every((v, i) => v - seq[i] === k)) flag(id, 'clock hops uneven', r); const nx = ((seq[seq.length - 1] + k - 1) % 12) + 1; if (nx !== ints(right(r))[0] || seq[seq.length - 1] + k <= 12) flag(id, 'clock: solver says ' + nx, r); },
  race(id, n) {
    const r = n.riddle, names = r.options.map(o => o.label), q = ['first', 'second', 'third', 'last'].indexOf(r.lines[r.lines.length - 1].match(/Who came (\w+)/)[1]);
    const okp = perms(names).filter(p => r.lines.every(l => { let m; if ((m = l.match(/^(\w+) finished before (\w+)/))) return p.indexOf(m[1]) < p.indexOf(m[2]); if ((m = l.match(/^(\w+) finished after (\w+)/))) return p.indexOf(m[1]) > p.indexOf(m[2]); if ((m = l.match(/^(\w+) finished last/))) return p.indexOf(m[1]) === 3; return true; }));
    if (okp.length !== 1 || okp[0][q] !== right(r)) flag(id, 'race: ' + okp.length + ' orders fit', r);
    if (new Set(r.options.map(o => o.icon)).size !== 4) flag(id, 'race: two birds share a letter', r);
  },
  boxes(id, n) {
    const r = n.riddle, notes = r.lines.slice(0, 3).map(l => { const m = l.match(/^(\w+) box: “The sparkle is (not )?in (here|the (\w+) box)/); return { box: m[1].toLowerCase(), neg: !!m[2], where: m[4] || m[1].toLowerCase() }; });
    const fit = notes.map(b => b.box).filter(loc => notes.filter(t => (t.where === loc) !== t.neg).length === 1);
    if (fit.length !== 1 || !right(r).includes(fit[0])) flag(id, 'boxes: solver says ' + fit, r);
  },
  hunt(id, n) { const r = n.riddle, w = r.lines.join(' ').match(/\b[A-Z]{3,}\b/g), fit = [...new Set(w[0])].filter(l => w[1].includes(l) && w[2].split(l).length - 1 === 2); if (fit.length !== 1 || fit[0] !== right(r)) flag(id, 'letter hunt: solver says ' + fit, r); r.options.forEach(o => { if (!o.correct && w[0].includes(o.label) && w[1].includes(o.label) && w[2].split(o.label).length - 1 === 2) flag(id, 'second letter also fits', r); }); },
  pal(id, n) { const r = n.riddle, rev = s => s.split('').reverse().join(''), c = right(r); if (rev(c) !== c) flag(id, 'not a palindrome', r); if (c.length !== ({ three: 3, four: 4 })[r.lines[0].match(/with (\w+) letters/)[1]]) flag(id, 'letter count', r); },
  flip(id, n) { const r = n.riddle, W = r.lines[0].match(/word ([A-Z]+)/)[1], rev = W.split('').reverse().join(''); if (right(r) !== rev) flag(id, 'not the word backward', r); if (r.options.filter(o => o.label === rev).length !== 1) flag(id, 'backward word appears twice', r); },
  knock(id, n) { const k = n.riddle.knock, fits = []; for (let v = 1; v < 60; v++) if (v > k.gt && v < k.lt && (!k.even || v % 2 === 0) && (!k.odd || v % 2 === 1) && k.by.every(b => v % b === 0)) fits.push(v); if (fits.length !== 1 || fits[0] !== k.n) flag(id, 'knock: fits ' + fits, n.riddle); const L = n.riddle.lines.join(' '); if (k.gt > 0 !== /more than/.test(L) || !L.includes('less than ' + k.lt) || !!k.even !== /even number/.test(L) || !!k.odd !== /odd number/.test(L)) flag(id, 'knock clues do not match the rule', n.riddle); }
};
const HOW = {
  stones: 'row', c3_7: 'row', door: 'knock', c7_7: 'knock', stump: 'hunt', c9_1: 'pal', c9_4: 'flip', c5_7: 'race', c10_6: 'boxes', c8_7: 'clock',
  c3_6: 'numSeq', c5_6: 'numSeq', c7_4: 'numSeq', c6_7: 'letSeq', c9_6: 'letSeq', c2_7: 'picSeq', c4_7: 'picSeq',
  otter: L => 2 * (L[3][0] + L[2][0]), c2_3: L => L[0][0] * L[1][0] - L[2][0], c3_3: L => L[0][0] / 2 - L[2][0], c4_3: L => L[0][0] * 3 + L[2][0], c5_3: L => L[0][0] - L[1][0] + L[2][0] * (1 + L[2][1]),
  c6_3: L => L[0][0] * L[1][0] - L[2][0], c7_2: L => (L[0][0] - L[2][0] * L[1][0]) / L[1][1], c8_3: L => L[0][0] + L[1][0] + L[2][0], c10_3: L => L[0][0] - L[1][0] + L[2][0]
};
function structure(id, n, src) {
  const r = n.riddle, o = r.options;
  if (o.filter(x => x.correct).length !== 1) flag(id, src + ' needs exactly one right answer', r);
  if (!r.knock && (o.length < 3 || o.length > 4)) flag(id, src + ' choice count', r);
  if (new Set(o.map(x => x.label)).size !== o.length) flag(id, src + ' repeated choice', r);
  if (new Set(o.map(x => x.icon || id + x.label)).size !== o.length) flag(id, src + ' two choices share a picture', r);
  o.forEach((x, i) => { const ic = x.icon || (ICON.map[id] || [])[i]; if (!ic || !ICON.has(ic)) flag(id, src + ' missing picture for ' + x.label, r); if (!x.correct && !(x.hint && x.hint.length > 20)) flag(id, src + ' missing hint for ' + x.label, r); if (!x.correct && new RegExp('\\b' + right(r).replace(/^(A|An|The|Your) /, '').replace(/[.*+?^${}()|[\]\\]/g, '') + '\\b', 'i').test(x.hint) && !HOW[id]) flag(id, src + ' hint gives away the answer: ' + x.hint, r); });
  const all = strip((n.text || []).concat(r.lines, r.after, o.map(x => x.hint || '')).join(' '));
  if (/undefined|NaN|\[object|\bnull\b/.test(all)) flag(id, src + ' broken text', r);
  if (!/\?$/.test(r.lines[r.lines.length - 1])) flag(id, src + ' last line is not a question', r);
}
function check(id, n, src) { structure(id, n, src); const h = HOW[id]; if (typeof h === 'function') SOLVE.num(id, n, h); else if (h) SOLVE[h](id, n); }
// 1. the hand-written version of every riddle
STORY.door.riddle.knock = { n: 15, gt: 0, lt: 20, by: [3, 5] };
let hand = 0, solved = 0;
Object.keys(STORY).forEach(id => { const n = STORY[id]; if (!n.riddle) return; hand++; if (HOW[id]) solved++; check(id, n, 'hand-written'); });
// 2. every re-rolled version, many times
const RUNS = 3000; let rolls = 0;
Object.keys(REMIX.gen).forEach(id => { if (!HOW[id]) bad.push('no solver for ' + id); for (let t = 0; t < RUNS; t++) { const g = REMIX.gen[id](); rolls++; if (!g) { bad.push(id + ' made nothing'); continue; } check(id, Object.assign({}, STORY[id], g), 're-rolled'); } });
// 3. replay extras and story wiring
let rollsCh = 0;
CHAPTERS.forEach(c => { for (let t = 0; t < 200; t++) { const order = Object.keys(STORY).filter(id => id === c.start || true).filter(id => STORY[id]); } });
Object.keys(STORY).forEach(id => { const n = STORY[id]; (n.choices || []).forEach(c => { if (!STORY[c.to]) bad.push(id + ' leads nowhere: ' + c.to); }); if (n.memory && (n.memory.icons.length !== 6 || new Set(n.memory.icons).size !== 6 || !n.memory.icons.every(k => ICON.has(k)))) bad.push(id + ' matching game cards'); if ((n.riddle || n.maze || n.memory) && !(n.riddle || n.maze || n.memory).after.length) bad.push(id + ' no closing text'); });
for (let t = 0; t < 300; t++) { const r = REMIX.roll(Object.keys(STORY)); Object.keys(r.dyn).forEach(id => { const g = r.dyn[id]; if (g.memory && (new Set(g.memory.icons).size !== 6 || !g.memory.icons.every(k => ICON.has(k)))) bad.push(id + ' re-rolled matching cards'); }); }
// each chapter: every path has exactly 8 puzzles and ends
CHAPTERS.forEach(c => { let paths = 0; (function walk(id, k, seen) { const n = STORY[id]; if (seen.includes(id)) return; const g = n.riddle || n.maze || n.memory ? 1 : 0; const nx = (n.choices || []).filter(x => !x.restart); if (n.ending || !nx.length) { paths++; if (k + g !== 8 || !n.ending) bad.push(c.id + ' path ends at ' + id + ' with ' + (k + g) + ' puzzles'); return; } nx.forEach(x => walk(x.to, k + g, seen.concat(id))); })(c.start, 0, []); c.paths = paths; });
// 4. mazes: pull the builder out of the game code and test it directly
const eng = fs.readFileSync(d + 'engine.js', 'utf8'), mazeSrc = eng.slice(eng.indexOf('  var DIRS = '), eng.indexOf('  var S = 40, P = 6;'));
const buildMaze = new Function(mazeSrc + '\nreturn buildMaze;')();
function testMaze(id, m) {
  const z = buildMaze(id, m), n = z.w * z.h, D = [[0, -1, 1, 4], [1, 0, 2, 8], [0, 1, 4, 1], [-1, 0, 8, 2]], dist = new Array(n).fill(-1), q = [0]; dist[0] = 0;
  while (q.length) { const c = q.shift(), x = c % z.w, y = Math.floor(c / z.w); D.forEach(([dx, dy, b, o]) => { if (!(z.open[c] & b)) return; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= z.w || ny >= z.h) { bad.push(id + ' maze opens off the board'); return; } const t = ny * z.w + nx; if (!(z.open[t] & o)) bad.push(id + ' one-way wall'); if (dist[t] < 0) { dist[t] = dist[c] + 1; q.push(t); } }); }
  if (dist.some(v => v < 0)) bad.push(id + ' maze has a closed-off square (seed ' + m.seed + ')');
  if (z.exit !== n - 1 || dist[z.exit] < 1) bad.push(id + ' door unreachable');
  const spots = z.lights.concat(z.key >= 0 ? [z.key] : []);
  if (z.lights.length !== 3 || new Set(spots).size !== spots.length || spots.some(c => c === 0 || c === z.exit || c < 0 || c >= n)) bad.push(id + ' lights or key misplaced (seed ' + m.seed + '): ' + spots);
  if ((m.kind === 'key') !== (z.key >= 0) || (m.kind === 'fog') !== z.fog) bad.push(id + ' wrong maze kind');
  return dist[z.exit];
}
let boards = 0, mazeRuns = 0, shortest = 99, longest = 0;
Object.keys(STORY).forEach(id => { const m = STORY[id].maze; if (!m) return; boards++; const len = testMaze(id, m); shortest = Math.min(shortest, len); longest = Math.max(longest, len); for (let t = 0; t < 1500; t++) { testMaze(id, Object.assign({}, m, { seed: m.seed + 1 + Math.floor(Math.random() * 100000) + t * 17 })); mazeRuns++; } });
// 5. the live-riddle gate: only well-formed riddles get through
const ids = ['c2_1', 'c2_5', 'c2_8'], mk = (o) => JSON.stringify([Object.assign({ slot: 'c2_1', lines: ['I fly on a string.', 'I have a tail.', 'Wind lifts me.', 'What am I?'], answer: 'kite', wrong: [{ key: 'balloon', hint: 'It has no tail.' }, { key: 'parrot', hint: 'It is alive.' }, { key: 'cloud', hint: 'Nobody holds it.' }] }, o)]);
const gate = [['good one', mk({}), 1], ['clue names the answer', mk({ lines: ['I am a kite.', 'I have a tail.', 'Wind lifts me.', 'What am I?'] }), 0], ['hint names the answer', mk({ wrong: [{ key: 'balloon', hint: 'A kite has a tail.' }, { key: 'parrot', hint: 'It is alive.' }, { key: 'cloud', hint: 'No.' + ' x' }] }), 0], ['unknown picture', mk({ answer: 'dragon' }), 0], ['same picture twice', mk({ wrong: [{ key: 'kite', hint: 'It has no tail.' }, { key: 'parrot', hint: 'It is alive.' }, { key: 'cloud', hint: 'Nobody holds it.' }] }), 0], ['only two wrong choices', mk({ wrong: [{ key: 'balloon', hint: 'It has no tail.' }, { key: 'parrot', hint: 'It is alive.' }] }), 0], ['not JSON', 'Here are some riddles!', 0], ['wrong slot', mk({ slot: 'zzz' }), 0]];
gate.forEach(([name, text, want]) => { const got = REMIX.parse(text, ids, 1).length; if (got !== want) bad.push('live gate: ' + name + ' gave ' + got); });
// 6. read-aloud: every spoken line belongs to a known character, every character sounds different,
//    and the speakers still match the reviewed list in tools/voices.json (refresh it with: node tools/verify.js --save-voices)
const cast = VOICE.cast, sound = {}, speakers = {}; let spoken = 0;
Object.keys(cast).forEach(k => { const key = cast[k][0] + '/' + cast[k][1] + '/' + cast[k][2]; if (sound[key]) bad.push('voices: ' + k + ' sounds the same as ' + sound[key]); sound[key] = k; if (!(cast[k][0] >= 0.4 && cast[k][0] <= 2 && cast[k][1] >= 0.6 && cast[k][1] <= 1.3 && /^[nfm]$/.test(cast[k][2]))) bad.push('voices: ' + k + ' has a setting out of range'); });
Object.keys(VOICE.fix).forEach(id => { if (!STORY[id]) return bad.push('voices: fix for a page that is gone: ' + id); const g = STORY[id].riddle || STORY[id].maze || STORY[id].memory; Object.keys(VOICE.fix[id]).forEach(k => { const par = k === 'ask' ? '“”' : k[0] === 't' ? STORY[id].text[+k.slice(1)] : g && g.after && g.after[+k.slice(1)]; if (!par || !/“/.test(par)) bad.push('voices: fix ' + id + '.' + k + ' points at no spoken line'); String(VOICE.fix[id][k]).split(',').forEach(w => { if (!cast[w]) bad.push('voices: fix ' + id + '.' + k + ' names nobody: ' + w); }); }); });
Object.keys(STORY).forEach(id => { const n = STORY[id], pg = VOICE.page(id, n, n, REMIX.ai[id] && REMIX.ai[id][0]), rows = [];
  const walk = (list, k) => list.forEach((ps, i) => ps.forEach(p => { if (!cast[p.who]) bad.push('voices: ' + id + ' has a line with no speaker'); if (p.who !== 'narrator') { rows.push(k + i + ' ' + p.who); spoken++; } }));
  walk(pg.text, 't'); if (n.riddle) { if (!cast[pg.asker]) bad.push('voices: ' + id + ' riddle has no asker'); rows.push('ask ' + pg.asker); } walk(pg.after, 'a'); if (rows.length) speakers[id] = rows.join(' | '); });
Object.keys(REMIX.ai).forEach(id => { for (let salt = 0; salt < 3; salt++) VOICE.page(id, { text: REMIX.lead(id, salt) }, STORY[id], REMIX.ai[id][0]).text.forEach(ps => ps.forEach(p => { if (p.who !== 'narrator' && p.who !== VOICE.helperOf(REMIX.ai[id][0])) bad.push('voices: replay lead-in on ' + id + ' is read by ' + p.who); })); });
const vfile = require('path').join(__dirname, 'voices.json');
if (process.argv.includes('--save-voices')) fs.writeFileSync(vfile, JSON.stringify(speakers, null, 1) + '\n');
const reviewed = fs.existsSync(vfile) ? JSON.parse(fs.readFileSync(vfile, 'utf8')) : {};
Object.keys(speakers).concat(Object.keys(reviewed)).forEach(id => { if (speakers[id] !== reviewed[id]) bad.push('voices: speakers on ' + id + ' differ from the reviewed list :: now ' + speakers[id]); });
console.log(JSON.stringify({ handWritten: hand, handWrittenSolvedByChecker: solved, handWrittenWordRiddles: hand - solved, rerolled: rolls, generators: Object.keys(REMIX.gen).length, mazeBoards: boards, mazeVariations: mazeRuns, firstPlayPathLen: [shortest, longest], chapterPaths: CHAPTERS.map(c => c.paths).join(','), liveGateCases: gate.length, spokenLines: spoken, voices: Object.keys(cast).length, problems: bad.length }));
const uniq = {}; bad.forEach(b => { const k = b.split(' :: ')[0]; uniq[k] = uniq[k] || b; }); Object.values(uniq).slice(0, 25).forEach(b => console.log('PROBLEM', b.slice(0, 330)));
