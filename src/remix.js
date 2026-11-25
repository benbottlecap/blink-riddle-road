/* Fresh puzzles for replays. Number, pattern and logic puzzles are re-rolled here and are always correct.
   Word riddles can be written live by Claude when the page is allowed to ask; otherwise the hand-written ones stay. */
const REMIX = (function () {
  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four', 'twenty-five', 'twenty-six', 'twenty-seven', 'twenty-eight', 'twenty-nine', 'thirty'];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const word = n => WORDS[n] || String(n), Word = n => cap(word(n));
  const int = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const T = ' Try again!';
  const pl = (n, s) => n === 1 ? s : s + 's';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  function nums(ans, wrongs, lab) {
    lab = lab || String;
    const out = [{ label: lab(ans), icon: 'num:' + ans, correct: true, v: ans }], used = {}; used[ans] = 1;
    wrongs.forEach(function (w) { if (out.length < 4 && Number.isInteger(w[0]) && w[0] > 0 && !used[w[0]]) { used[w[0]] = 1; out.push({ label: lab(w[0]), icon: 'num:' + w[0], hint: w[1] + T, v: w[0] }); } });
    [1, -1, 2, -2, 3, 4].forEach(function (d) { const v = ans + d; if (out.length < 4 && v > 0 && !used[v]) { used[v] = 1; out.push({ label: lab(v), icon: 'num:' + v, hint: 'Check your counting once more.' + T, v: v }); } });
    return out.sort(function (a, b) { return a.v - b.v; }).map(function (o) { delete o.v; return o; });
  }

  /* a row of four things, two clues, one answer */
  function rowLogic(names, noun, icon) {
    const P = shuffle(names).slice(0, 4), a = pick([1, 2]), other = a === 1 ? 2 : 1, side = Math.random() < 0.5, dir = a === 1 ? 'left' : 'right';
    const X = a === 1 ? P[3] : P[0];
    const clue2 = side ? `Clue two: it is somewhere to the ${dir} of the ${P[other]} ${noun}.` : `Clue two: it is not next to the ${X} ${noun}.`;
    const options = P.map(function (c, i) {
      if (i === a) return { label: `The ${c} ${noun}`, icon: icon(c), correct: true };
      let hint;
      if (i === 0 || i === 3) hint = `The ${c} ${noun} is at the ${i === 0 ? 'left' : 'right'} end of the row. Clue one says it is not at an end.`;
      else hint = side ? `The ${c} ${noun} is not at an end. But clue two says to the ${dir} of the ${c} ${noun}, not the ${c} ${noun} itself.` : `The ${c} ${noun} is not at an end, so it fits clue one. But look what is right beside it.`;
      return { label: `The ${c} ${noun}`, icon: icon(c), hint: hint + T };
    });
    const why = side ? `the ${P[other]} ${noun} cannot be to the ${dir} of itself` : `the ${P[other]} ${noun} sits right next to the ${X} one`;
    return { P: P, ans: P[a], other: P[other], lines: [`Clue one: it is not at either end of the row.`, clue2], options: options, why: why };
  }

  /* a repeating row of pictures with the last one hidden */
  function picPattern(pool, label) {
    const forms = [[0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 2], [0, 0, 1, 1], [0, 1, 0, 2], [0, 1, 2, 1]], form = pick(forms), keys = shuffle(pool);
    const n = form.length * 2 + int(0, form.length - 1), seq = [];
    for (let i = 0; i < n; i++) seq.push(keys[form[i % form.length]]);
    const ansKey = keys[form[n % form.length]], inUnit = keys.slice(0, Math.max.apply(null, form) + 1);
    const unit = form.map(function (i) { return label(keys[i]).toLowerCase(); }).join(', ');
    const options = shuffle(keys.slice(0, 4)).map(function (k) {
      if (k === ansKey) return { label: label(k), icon: k, correct: true };
      return { label: label(k), icon: k, hint: (inUnit.indexOf(k) === -1 ? `There is no ${label(k).toLowerCase()} in this pattern.` : `Find the part that repeats: ${unit}. Then see where the row stops.`) + T };
    });
    return { seq: seq, options: options, ans: label(ansKey), unit: unit };
  }

  function numPattern(kinds) {
    const kind = pick(kinds); let seq, ans, rule;
    if (kind === 'double') { const s = pick([2, 3, 5]); seq = [s, 2 * s, 4 * s, 8 * s]; ans = 16 * s; rule = 'Each number is double the one before.'; }
    else if (kind === 'plus') { const k = pick([2, 3, 4, 5, 10]), a = int(1, 9); seq = [a, a + k, a + 2 * k, a + 3 * k]; ans = a + 4 * k; rule = `Each number is ${k} more than the one before.`; }
    else if (kind === 'minus') { const k = pick([2, 3, 4, 5]), a = int(4 * k + 1, 4 * k + 12); seq = [a, a - k, a - 2 * k, a - 3 * k]; ans = a - 4 * k; rule = `Each number is ${k} less than the one before.`; }
    else if (kind === 'grow') { const a = pick([1, 3, 4, 5, 6]); seq = [a, a + 1, a + 3, a + 6]; ans = a + 10; rule = 'The jumps grow by one each time: +1, +2, +3, and then +4.'; }
    else { let a = int(1, 3), b = int(1, 4); if (a === 1 && b === 1) b = 3; seq = [a, b, a + b, a + 2 * b, 2 * a + 3 * b]; ans = 3 * a + 5 * b; rule = 'Each number is the two before it, added together.'; }
    const last = seq[seq.length - 1], near = ans > last ? last + 1 : last - 1;
    const options = nums(ans, [[near, 'The numbers do not move by ones. ' + rule], [ans + 1, 'Close. ' + rule], [ans - 1, 'Close. ' + rule], [ans + 2, 'Close. ' + rule]]);
    return { seq: seq.map(function (v) { return 'num:' + v; }), text: seq.join(', '), ans: ans, rule: rule, options: options, last: last, prev: seq[seq.length - 2] };
  }

  function letterPattern() {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', dir = pick([1, -1]), skip = pick([1, 2]), step = (skip + 1) * dir;
    const start = dir === 1 ? int(0, 25 - 4 * (skip + 1)) : int(4 * (skip + 1), 25);
    const seq = [0, 1, 2, 3].map(function (i) { return A[start + i * step]; }), ai = start + 4 * step, used = {}; used[ai] = 1;
    const options = [{ label: A[ai], icon: 'let:' + A[ai], correct: true, v: ai }];
    [ai - dir, ai + dir, ai - 2 * dir, ai + 2 * dir, ai + 3 * dir].forEach(function (v) { if (options.length < 4 && v >= 0 && v < 26 && !used[v]) { used[v] = 1; options.push({ label: A[v], icon: 'let:' + A[v], hint: `Say the alphabet ${dir === 1 ? 'forward' : 'backward'}. This pattern skips ${word(skip)} ${pl(skip, 'letter')} each time.` + T, v: v }); } });
    options.sort(function (a, b) { return a.v - b.v; }).forEach(function (o) { delete o.v; });
    return { seq: seq.map(function (l) { return 'let:' + l; }), text: seq.join(', '), ans: A[ai], options: options };
  }

  const KNOCKS = [{ n: 15, gt: 0, lt: 20, by: [3, 5] }, { n: 12, gt: 6, lt: 18, by: [3, 4] }, { n: 10, gt: 0, lt: 20, by: [5], even: true }, { n: 6, gt: 0, lt: 12, by: [3], even: true }, { n: 9, gt: 6, lt: 15, by: [3], odd: true }, { n: 8, gt: 4, lt: 12, by: [4] }, { n: 18, gt: 12, lt: 20, by: [3], even: true }, { n: 12, gt: 10, lt: 15, by: [3], even: true }];
  const BYW = { 3: 'threes', 4: 'fours', 5: 'fives' };
  function knock(base, notN) {
    const k = pick(KNOCKS.filter(function (x) { return x.n !== notN; })), kn = Object.assign({}, k, { verb: base.verb, noun: base.noun, done: base.done });
    const lines = [k.gt > 0 ? `I am more than ${k.gt} and less than ${k.lt}.` : `I am less than ${k.lt}.`];
    if (k.even) lines.push('I am an even number.');
    if (k.odd) lines.push('I am an odd number.');
    k.by.forEach(function (b) { lines.push(`You say me when you count by ${BYW[b]}.`); });
    lines.push('What number am I?');
    return { kn: kn, lines: lines, n: k.n };
  }

  const BANK = ['FROG', 'HEDGEHOG', 'MOON', 'OWL', 'DUCK', 'OTTER', 'TURTLE', 'STAR', 'BRIDGE', 'NEST', 'POND', 'HILL', 'BELL', 'TREE', 'LEAF', 'SEED', 'BOOK', 'DOOR', 'WELL', 'STONE', 'SHADOW', 'PILLOW', 'BUBBLE', 'RABBIT', 'KITTEN', 'PUPPY', 'BALLOON', 'COOKIE', 'SPIDER', 'LETTER', 'BUTTER', 'HAMMER', 'MITTEN', 'RIBBON', 'PEPPER', 'PUDDLE', 'APPLE', 'BERRY', 'CHERRY', 'CARROT', 'PARROT', 'MIRROR', 'BOTTLE', 'KETTLE', 'YELLOW', 'LADDER', 'BANANA', 'WINDOW', 'FEATHER', 'SUMMER'];
  const count = (w, l) => w.split(l).length - 1;
  function letterHunt() {
    for (let tries = 0; tries < 4000; tries++) {
      const A = pick(BANK), B = pick(BANK), C = pick(BANK);
      if (A === B || A === C || B === C) continue;
      const common = Array.from(new Set(A.split(''))).filter(function (l) { return B.indexOf(l) !== -1; });
      if (common.length < 2) continue;
      const fit = common.filter(function (l) { return count(C, l) === 2; });
      if (fit.length !== 1) continue;
      const L = fit[0], pool = shuffle(common.filter(function (l) { return l !== L; })).concat(shuffle(Array.from(new Set((C + A + B).split(''))).filter(function (l) { return l !== L && common.indexOf(l) === -1; })));
      const opts = [{ label: L, icon: 'let:' + L, correct: true }];
      pool.slice(0, 3).forEach(function (X) {
        let hint;
        if (A.indexOf(X) === -1) hint = `There is no ${X} in ${A}.`;
        else if (B.indexOf(X) === -1) hint = `${X} is in ${A}. But there is no ${X} in ${B}.`;
        else { const c = count(C, X); hint = `${X} is in ${A} and in ${B}. Good! But ${c === 0 ? `there is no ${X} in ${C}` : `${X} is in ${C} only one time`}.`; }
        opts.push({ label: X, icon: 'let:' + X, hint: hint + T });
      });
      if (opts.length === 4) return { A: A, B: B, C: C, L: L, options: opts.sort(function (a, b) { return a.label < b.label ? -1 : 1; }) };
    }
    return null;
  }

  const PALS = [
    { w: 'PUP', clue: 'I am a baby dog.', near: 'CUB', why: 'A cub is a baby animal. But read CUB backward and you get BUC.' },
    { w: 'MOM', clue: 'I am another name for a mother.', near: 'MAMA', why: 'MAMA is a name for a mother. But read it backward and you get AMAM.' },
    { w: 'DAD', clue: 'I am another name for a father.', near: 'PAPA', why: 'PAPA is a name for a father. But read it backward and you get APAP.' },
    { w: 'BIB', clue: 'A baby wears me at dinner to stay clean.', near: 'CAP', why: 'A baby can wear a cap. But read CAP backward and you get PAC.' },
    { w: 'POP', clue: 'I am the sound a balloon makes when it breaks.', near: 'BANG', why: 'BANG is a loud sound. But read it backward and you get GNAB.' },
    { w: 'WOW', clue: 'I am what you say when something amazes you.', near: 'OOH', why: 'You might say OOH. But read it backward and you get HOO.' },
    { w: 'NOON', clue: 'I am the middle of the day.', near: 'DAWN', why: 'DAWN is a time of day. But read it backward and you get NWAD.' },
    { w: 'TOOT', clue: 'I am the sound a little horn makes.', near: 'HONK', why: 'A horn can HONK. But read it backward and you get KNOH.' },
    { w: 'PEEP', clue: 'I am the sound a baby chick makes.', near: 'COO', why: 'COO is a bird sound. But read it backward and you get OOC.' }
  ];
  const FLIPS = [['POTS', 'STOP'], ['WOLF', 'FLOW'], ['PETS', 'STEP'], ['TOPS', 'SPOT'], ['LOOP', 'POOL'], ['PANS', 'SNAP'], ['NOW', 'WON'], ['TEN', 'NET'], ['GUM', 'MUG'], ['BUS', 'SUB'], ['PAN', 'NAP'], ['POT', 'TOP'], ['TUB', 'BUT'], ['PIN', 'NIP'], ['RAT', 'TAR'], ['DRAW', 'WARD']];

  const G = {
    stones: function () {
      const r = rowLogic(['gray', 'white', 'speckled', 'black'], 'stone', function (c) { return 'stone-' + c; }), P = r.P;
      return { artOpt: { order: P }, text: [
        `Four stones sit in a row at the edge of the pond. From left to right, there is a ${P[0]} stone, a ${P[1]} stone, a ${P[2]} stone, and a ${P[3]} stone.`,
        `The frog has moved them around since last time. “Only one of them starts the real path tonight,” she croaks. “Two clues. You need both.”`],
        riddle: { lines: r.lines.concat([`Which stone do you step on?`]), options: r.options, after: [
          `The two stones at the ends are out. That leaves two in the middle. But ${r.why}. So that one is out too.`,
          `You step onto the ${r.ans} stone. It holds as still as a table.`,
          `More stones rise up in a neat row. <i>Hop, hop, hop.</i> You are across. A muddy slide runs down the bank ahead, and somebody is whistling.`] } };
    },
    otter: function () {
      const half = int(3, 8), e = int(1, Math.min(3, half - 1)), L = half - e, x = half * 2;
      const t = function (v) { return `Test it. Half of ${v} is ${v / 2}. He eats ${e}. That leaves ${v / 2 - e}, not ${L}.`; };
      return { text: [
        `<i>Whee! Splash!</i> The otter zooms down his muddy slide and pops up at your feet.`,
        `“You again!” he says. “Good. I have a new fish problem tonight.”`,
        `He holds up ${word(L)} small ${L === 1 ? 'fish by its tail' : 'fish by their tails'}.`],
        riddle: { lines: [`Tonight I caught some fish.`, `I gave half of them to my sister.`, `Then I ate ${e} myself.`, `Now I have ${L} left.`, `How many fish did I catch?`],
          options: nums(x, [[half, `Before he ate ${e}, he had ${half}. But those ${half} were only half.`], [x + 2, t(x + 2)], [x - 2 > half ? x - 2 : x + 4, t(x - 2 > half ? x - 2 : x + 4)]]),
          after: [
            `You work it out backward. He has ${L} now. Before he ate ${e}, he had ${half}. And those ${half} were only half. So that is ${half}, and ${half} more.`,
            `“${Word(x)}!” you say. “You caught ${x} fish.”`,
            `The otter counts on his paws. “You are right! Nobody took any. I just ate them.”`,
            `He points his tail up the bank. “Follow the path through the tall grass. You will come to the tall hedge. Look for the Round Door.”`] } };
    },
    door: function () {
      const k = knock({ verb: 'Knock', noun: 'Knocks', done: 'Open the door' }, 15);
      return { riddle: { knock: k.kn, lines: k.lines, options: [{ label: String(k.n), icon: 'num:' + k.n, correct: true }], after: [
        `You go through the clues one at a time. Only one number fits them all.`,
        `“${Word(k.n)}!” you say.`,
        `You knock ${word(k.n)} times. Blink counts along so you do not lose your place.`,
        `The round door swings open without a sound.`,
        `Behind it is a garden, silver in the moonlight. A white stone path goes two ways. One way leads to a mossy stump with a tiny light on it. The other way leads to an old stone well.`] } };
    },
    stump: function () {
      const h = letterHunt(); if (!h) return null;
      return { text: [`The bookworm is still on his mossy stump, reading a new leaf.`, `“Ah, the reader,” he says. “I have a fresh letter puzzle for you.”`],
        riddle: { lines: [`I am a letter.`, `You can find me in ${h.A} and in ${h.B}.`, `I am in ${h.C} two times.`, `What letter am I?`], options: h.options, after: [
          `You spell the words in your head. Only one letter is in ${h.A} and in ${h.B}, and in ${h.C} two times.`,
          `“The letter ${h.L}!” you say.`,
          `“Just so,” says the bookworm. He looks very pleased.`,
          `He points his tail down the white path. “The Lantern Tree is just past the roses. Good night, reader.”`] } };
    },
    c2_3: function () {
      const r = int(3, 5), c = int(2, 4), tot = r * c, e = int(2, Math.min(6, tot - 2)), ans = tot - e, sum = Array(r).fill(c).join(' and ');
      return { text: [`The field mouse in the straw hat is counting on her paws again.`,
        `“Oh, whiskers,” she says. “This time I planted ${r} rows of carrots. Each row had ${c} carrots. Then a rabbit ate ${e} of them. How many do I have left?”`],
        riddle: { lines: [`${r} rows of carrots.`, `${c} carrots in each row.`, `A rabbit ate ${e}.`, `How many carrots are left?`],
          options: nums(ans, [[e, `${Word(e)} is how many the rabbit ate. How many did she plant first?`], [tot, `${Word(tot)} is how many she planted. Now take away the ${e} that the rabbit ate.`], [ans + 2, `Count the rows again. ${sum} makes ${tot}. Then take away ${e}.`]]),
          after: [`“${cap(sum)} is ${tot},” you say. “Take away ${e}. That leaves ${ans}.”`, `“${Word(ans)}!” says the mouse. “Enough for soup.”`,
            `“The inner gate is locked,” she adds. “The gardener hides the key along one of these two paths. One is narrow and twisty. One is wide and long.”`] } };
    },
    c2_7: function () {
      const p = picPattern(['rose', 'seed', 'acorn', 'mushroom', 'snail'], function (k) { return LIB[k]; });
      return { text: [`The flower bed has been planted again, in a new pattern. The last spot is covered by a big leaf.`],
        riddle: { seq: p.seq, lines: [`Look at the row.`, `What is under the leaf in the last spot?`], options: p.options, after: [
          `The row repeats: ${p.unit}. You lift the leaf, and you are right.`,
          `Next to it lies a little empty glasses case. “That is hers!” says Blink. “The glasses must be close.”`] } };
    },
    c3_3: function () {
      const half = int(6, 12), N = half * 2, h = int(2, 4), ans = half - h;
      return { text: [`The carp with tiny glasses is counting her class again.`,
        `“${Word(N)} fish in my class tonight,” she says. “Half of them turned left at the rock. ${Word(h)} of those hid in the weeds. How many of the left-turners can I still see?”`],
        riddle: { lines: [`${N} fish in the class.`, `Half of them turn left.`, `${h} of the left-turners hide.`, `How many left-turners can she still see?`],
          options: nums(ans, [[half, `${Word(half)} fish turned left. But ${h} of them hid.`], [half + h, `Half of ${N} is ${half}. Take ${h} away from ${half}. Do not add.`], [N - h, `Only half the class turned left. Start with half of ${N}.`]]),
          after: [`“Half of ${N} is ${half},” you say. “Take away ${h}. ${Word(ans)}!”`, `“Thank you,” says the carp. “Class, say thank you.” The whole school blows bubbles at you.`] } };
    },
    c3_6: function () {
      const p = numPattern(['double', 'plus', 'grow']);
      return { text: [`The shells on the sand have new numbers scratched on them tonight. The last shell is turned over.`],
        riddle: { seq: p.seq, lines: [`${p.text} ...`, `What number is on the last shell?`], options: p.options, after: [`“${p.rule}” you say. “So the last one is ${p.ans}!”`, `The last shell flips over by itself. You were right.`] } };
    },
    c3_7: function () {
      const r = rowLogic(['red', 'white', 'blue', 'gold', 'green', 'purple'], 'gem', function (c) { return 'gem:' + c; }), P = r.P;
      return { text: [`Four gems sit in a row on the pond floor again. Tonight, from left to right, they are ${P[0]}, ${P[1]}, ${P[2]}, and ${P[3]}.`,
        `The crayfish taps his claw. “I buried the Pearl Lamp under a different one this time. Two clues.”`],
        riddle: { lines: r.lines.concat([`Which gem do you dig under?`]), options: r.options, after: [
          `The gems at the two ends are out. That leaves two in the middle. But ${r.why}. So it must be the ${r.ans} gem.`,
          `Sharky digs nose-first. Something round and bright rolls out of the sand. The Pearl Lamp!`] } };
    },
    c4_3: function () {
      const m = int(2, 5), w = int(1, 3), ans = 3 * m + w;
      return { text: [`Moss stops at the little room full of jars.`,
        `“I must count my tunnels again,” she says. “I dug ${m} on Monday. On Tuesday I dug twice as many as Monday. On Wednesday I was tired, and I dug only ${w}.”`],
        riddle: { lines: [`${m} tunnels on Monday.`, `Twice as many on Tuesday.`, `${w} on Wednesday.`, `How many tunnels in all?`],
          options: nums(ans, [[2 * m + w, `Tuesday was twice as many as Monday. Twice ${m} is ${2 * m}, not ${m}.`], [3 * m, `Do not forget Wednesday.`], [ans + 2, `Twice ${m} is ${2 * m}. Now add ${m}, and ${2 * m}, and ${w}.`]]),
          after: [`“${Word(m)}, and ${word(2 * m)}, and ${word(w)},” you say. “${Word(ans)} tunnels!”`, `“${Word(ans)},” says Moss. “No wonder my paws are sore.”`] } };
    },
    c4_7: function () {
      const names = { 'gem:red': 'Red', 'gem:blue': 'Blue', 'gem:green': 'Green', 'gem:gold': 'Gold', 'gem:purple': 'Purple', 'gem:white': 'White' };
      const p = picPattern(Object.keys(names), function (k) { return names[k]; });
      return { text: [`A row of crystals is set into the wall, in a new order tonight. One is missing.`, `“Put the right one in,” says Moss, “and the last door opens.”`],
        riddle: { seq: p.seq, lines: [`Look at the row.`, `Which crystal is missing from the end?`], options: p.options, after: [`The row repeats: ${p.unit}. You press the ${p.ans.toLowerCase()} crystal in. The stone door rolls aside.`] } };
    },
    c5_3: function () {
      const b = int(7, 10), f = int(3, 5), k = int(2, 3), ans = b - f + 2 * k;
      return { text: [`The sparrows are back on the silver wire. The littlest one is counting again.`,
        `“${Word(b)} of us sat here,” she says. “${Word(f)} flew off. Then ${word(k)} came back, and each one brought a friend. How many of us now?”`],
        riddle: { lines: [`${b} birds on the wire.`, `${f} fly away.`, `${k} come back, each with 1 friend.`, `How many birds are on the wire now?`],
          options: nums(ans, [[b - f + k, `${Word(k)} came back, and each brought a friend. That is ${2 * k} birds landing, not ${k}.`], [b + 2 * k, `Do not forget the ${f} that flew away at the start.`], [b - f, `Then ${2 * k} birds landed. Add them on.`]]),
          after: [`“${Word(b)} take away ${f} is ${b - f},” you say. “Then ${2 * k} birds land. ${Word(ans)}!”`, `The sparrows cheer so hard that they nearly fall off the wire.`] } };
    },
    c5_6: function () {
      const p = numPattern(['minus']);
      return { text: [`The great dial on the tower wall has new numbers tonight. The last one has blown away again.`],
        riddle: { seq: p.seq, lines: [`${p.text} ...`, `What number comes next?`], options: p.options, after: [`“${p.rule}” you say. “So next comes ${p.ans}.”`, `You chalk the number ${p.ans} on the dial. A hatch opens above you.`] } };
    },
    c5_7: function () {
      const n = shuffle(['Jay', 'Dove', 'Wren', 'Owl', 'Lark', 'Crow', 'Swan', 'Hawk', 'Robin', 'Finch']).slice(0, 4), qi = pick([0, 1, 2]), q = ['first', 'second', 'third'][qi];
      const clues = shuffle([`${n[0]} finished before ${n[1]}.`, `${n[2]} finished after ${n[1]}.`]).concat([`${n[3]} finished last of all.`]);
      const places = ['first', 'second', 'third', 'last'];
      const options = shuffle(n.map(function (name, i) {
        return i === qi ? { label: name, icon: 'let:' + name[0], correct: true } : { label: name, icon: 'let:' + name[0], hint: (i === 3 ? `${name} finished last of all.` : `Line them up. ${n[1]} is in the middle of two clues. Who is before ${n[1]}, and who is after?`) + T };
      }));
      return { text: [`Four birds have been racing around the tower again: ${n.slice().sort().join(', ')}. Now they are arguing about who came ${q}.`],
        riddle: { lines: clues.concat([`Who came ${q}?`]), options: options, after: [`“${n[0]}, then ${n[1]}, then ${n[2]}, then ${n[3]},” you say. “${n[qi]} was ${places[qi]}!”`, `${n[qi]} bows. The others say they were only resting their eyes.`] } };
    },
    c6_3: function () {
      const c = int(3, 5), l = int(2, 5), tot = 4 * c, ans = tot - l, sum = Array(c).fill(4).join(' and ');
      return { text: [`The fox cubs tumble out of the snowy den again. Tonight there are ${word(c)} of them, and their mother is counting boots.`,
        `“${Word(c)} cubs,” she says. “Four paws each. One boot for every paw. But ${word(l)} boots are lost in the snow. How many boots do we still have?”`],
        riddle: { lines: [`${c} fox cubs.`, `4 boots for each cub.`, `${l} boots are lost.`, `How many boots are left?`],
          options: nums(ans, [[tot, `${Word(tot)} is how many boots they started with. Now take away the ${l} lost ones.`], [ans - 1, `Count ${sum}. Then take away ${l}.`], [c + 4 - l > 0 && c + 4 - l !== ans ? c + 4 - l : ans + 1, `Every cub needs 4 boots. Count ${sum}. Then take away ${l}.`]]),
          after: [`“${cap(sum)} is ${tot},” you say. “Take away ${l}. ${Word(ans)} boots.”`, `“${Word(ans)},” sighs the mother fox. “Somebody is going to hop.”`] } };
    },
    c6_7: function () {
      const p = letterPattern();
      return { text: [`The steps cut into the rock have new letters tonight. The top step is covered in snow.`],
        riddle: { seq: p.seq, lines: [`${p.text} ...`, `What letter is on the top step?`], options: p.options, after: [`You say the alphabet and count the skips. “It is ${p.ans}!”`,
          `You brush off the snow. There is the letter ${p.ans}. And beside it, half buried, is a little silver bell made of ice.`] } };
    },
    c7_2: function () {
      const a = pick([2, 3]), p = pick([2, 3, 4]), k = int(1, 3), ans = int(1, 3), left = p * ans, C = k * a + left;
      return { text: [`The hedgehog has new prices at the fruit stall tonight.`,
        `“Apples are ${a} coins. Pears are ${p} coins. Pretend you have ${C} coins, and you buy ${k} ${pl(k, 'apple')}. How many pears can you buy with what is left?”`],
        riddle: { lines: [`You have ${C} coins.`, `Apples cost ${a}. Pears cost ${p}.`, `You buy ${k} ${pl(k, 'apple')}.`, `How many pears can you buy with what is left?`],
          options: nums(ans, [[ans + 1, `${Word(ans + 1)} pears cost ${(ans + 1) * p} coins. After the ${pl(k, 'apple')}, you have only ${left}.`], [ans + 2, `${Word(ans + 2)} pears cost ${(ans + 2) * p} coins. After the ${pl(k, 'apple')}, you have only ${left}.`], [ans - 1, `You can do better. After the ${pl(k, 'apple')} you have ${left} coins. How many ${p}s are in ${left}?`]]),
          after: [`“${Word(k)} ${pl(k, 'apple')} ${k === 1 ? 'costs' : 'cost'} ${k * a},” you say. “That leaves ${left}. ${Word(ans)} ${pl(ans, 'pear')} ${ans === 1 ? 'costs' : 'cost'} ${left}.”`, `“Sharp,” says the hedgehog. Another coin for your pocket.`] } };
    },
    c7_4: function () {
      const p = numPattern(['fib']);
      return { text: [`The spider has new necklaces tonight. Each string has more beads than the last.`, `“How many beads go on my next string?” she asks. “Same hint as always. Add.”`],
        riddle: { seq: p.seq, lines: [`${p.text} ...`, `How many beads come next?`], options: p.options, after: [`“${p.rule}” you say. “${p.prev} and ${p.last} is ${p.ans}!”`, `“Most grown-ups miss that one,” says the spider. She pays you two coins.`] } };
    },
    c7_7: function () {
      const k = knock({ verb: 'Ring', noun: 'Rings', done: 'Done ringing' }, 12);
      return { riddle: { knock: k.kn, lines: k.lines, options: [{ label: String(k.n), icon: 'num:' + k.n, correct: true }], after: [
        `You go through the clues one at a time. Only one number fits them all. ${Word(k.n)}!`,
        `<i>Dong. Dong. Dong.</i> ${Word(k.n)} times. The whole market claps. The prize is a fat bag of moon coins.`] } };
    },
    c8_3: function () {
      const t = int(5, 8), n = int(1, 3), e = int(1, 2), ans = t + n + e, lab = function (v) { return v + ' o’clock'; };
      return { text: [`The bat is hanging beside the row of bells again.`,
        `“I have lost track again,” she says. “When the clock stopped, it was ${t} o’clock. Then I napped for ${n} ${pl(n, 'hour')} and ate moths for ${e} ${pl(e, 'hour')}. What time should it be now?”`],
        riddle: { lines: [`The clock stopped at ${t} o’clock.`, `The bat napped for ${n} ${pl(n, 'hour')}.`, `Then she ate for ${e} ${pl(e, 'hour')}.`, `What time should it be?`],
          options: nums(ans, [[t + n, `That counts her nap. Now add the time she spent eating.`], [t + e, `That counts her snack. Now add the time she spent napping.`], [ans + 1, `That is one hour too many. Add ${n} and ${e} to ${t}.`]], lab),
          after: [`“${Word(t)} and ${n} is ${t + n}. And ${e} more is ${ans},” you say. “It should be ${ans} o’clock.”`, `“${Word(ans)}! Long past bedtime,” says the bat.`] } };
    },
    c8_7: function () {
      const c = pick([[[2, 5, 8, 11], 3], [[3, 6, 9, 12], 3], [[5, 7, 9, 11], 2], [[6, 8, 10, 12], 2], [[3, 5, 7, 9, 11], 2], [[4, 6, 8, 10, 12], 2], [[4, 8, 12], 4], [[3, 7, 11], 4]]), seq = c[0], k = c[1], last = seq[seq.length - 1], ans = last + k - 12;
      const list = seq.slice(0, -1).join(', then ') + ', then ' + last;
      return { text: [`To set the clock, the mouse hops around the giant clock face again. Tonight he lands on ${list}. Then he stops, puzzled.`, `“A clock has no ${last + k},” he says. “Where do I land next?”`],
        riddle: { seq: seq.map(function (v) { return 'num:' + v; }), lines: [`He hops ${k} numbers each time.`, `After 12, a clock starts again at 1.`, `Where does he land next?`],
          options: nums(ans, [[last === 12 ? 11 : 12, `Count ${k} hops on from ${last}. After 12, a clock starts again at 1.`], [ans + 1, `That is one hop too many. He hops only ${k}.`], [last + 1 <= 12 ? last + 1 : ans + 2, `He hops ${k} numbers each time, not 1.`]]),
          after: [`You count ${k} hops on from ${last}, ${last === 12 ? '' : 'past the 12 and '}around to the start. “He lands on ${ans}!”`, `The mouse lands on the ${ans}. Something deep in the tower goes <i>clunk.</i>`] } };
    },
    c9_1: function () {
      const p = pick(PALS), others = shuffle(PALS.filter(function (x) { return x.w !== p.w && x.w.length === p.w.length; }).map(function (x) { return x.w; }).concat(p.w.length === 3 ? ['EYE'] : ['DEED'])).slice(0, 2);
      const options = shuffle([{ label: p.w, icon: 'txt:' + p.w, correct: true }, { label: p.near, icon: 'txt:' + p.near, hint: p.why + T }].concat(others.map(function (w) { return { label: w, icon: 'txt:' + w, hint: `${w} is the same forward and backward. But it does not fit the last clue.` + T }; })));
      return { text: [`More letters are spinning above the front desk. The Bookworm squints at them.`, `“Another word has fallen out of its book,” he says. “Which word is it?”`],
        riddle: { lines: [`I am a word with ${word(p.w.length)} letters.`, `Read me forward or backward, and I do not change.`, p.clue, `What word am I?`], options: options, after: [`“${p.w}!” you say. “It is the same both ways.”`, `The letters zip back into their book.`] } };
    },
    c9_4: function () {
      const f = pick(FLIPS), W = f[0], R = f[1], l = R.split(''), seen = {}; seen[W] = seen[R] = 1;
      const cand = [l[1] + l[0] + l.slice(2).join(''), l.slice(0, -2).join('') + l[l.length - 1] + l[l.length - 2], l.slice(1).join('') + l[0], l[l.length - 1] + l.slice(0, -1).join(''), l[0] + l.slice(1).reverse().join('')];
      const options = [{ label: R, icon: 'txt:' + R, correct: true }];
      cand.forEach(function (c) { if (options.length < 4 && !seen[c]) { seen[c] = 1; options.push({ label: c, icon: 'txt:' + c, hint: `That uses the same letters. But it is not ${W} read backward. Start with the last letter, ${W[W.length - 1]}.` + T }); } });
      return { text: [`New letters lie on the table tonight, spelling ${W}. The Bookworm frowns.`, `“That is not right,” he says. “Try reading it the other way.”`],
        riddle: { lines: [`Start with the word ${W}.`, `Read it backward, from the last letter to the first.`, `What word do you get?`], options: shuffle(options), after: [
          `“${l.join(', ')},” you say. “${R}!”`, `The letters scurry back to their page.`,
          `“The oldest books are locked in the Deep Stacks,” says the Bookworm. “The key is on one of two floors.”`] } };
    },
    c9_6: function () {
      const p = letterPattern();
      return { text: [`The stair down to the Deep Stacks has new letters on its steps tonight. The last one is worn away.`],
        riddle: { seq: p.seq, lines: [`${p.text} ...`, `What letter is on the last step?`], options: p.options, after: [`You say the alphabet and count the skips. “It is ${p.ans}!”`, `You step on the ${p.ans}. A door swings open.`] } };
    },
    c10_3: function () {
      const a = int(6, 9), s = int(2, 4), b = int(3, 7), ans = a - s + b;
      return { text: [`The otter is holding on to a rung again.`, `“It is icy tonight,” he says. “I climbed ${a} rungs. I slipped back ${s}. Then I climbed ${b} more. What rung am I on?”`],
        riddle: { lines: [`He climbs ${a} rungs.`, `He slips back ${s}.`, `He climbs ${b} more.`, `What rung is he on?`],
          options: nums(ans, [[a + s + b, `He slipped back ${s}. Take them away. Do not add them.`], [a + b, `Do not forget the slip. ${Word(a)} take away ${s} comes first.`], [a - s, `${Word(a)} take away ${s} is ${a - s}. Now add ${b}.`]]),
          after: [`“${Word(a)} take away ${s} is ${a - s},” you say. “And ${b} more is ${ans}.”`, `“${Word(ans)},” says the otter. “I knew that.” He did not know that.`] } };
    },
    c10_6: function () {
      const cols = shuffle([['gold', 'gem:gold'], ['silver', 'gem:white'], ['blue', 'gem:blue'], ['red', 'gem:red'], ['green', 'gem:green']]).slice(0, 3), n = cols.map(function (c) { return c[0]; });
      const forms = [
        [function (w) { return w === 0; }, function (w) { return w !== 1; }, function (w) { return w !== 0; }, [`“The sparkle is in here.”`, `“The sparkle is not in here.”`, `“The sparkle is not in the ${n[0]} box.”`]],
        [function (w) { return w !== 0; }, function (w) { return w === 0; }, function (w) { return w !== 2; }, [`“The sparkle is not in here.”`, `“The sparkle is in the ${n[0]} box.”`, `“The sparkle is not in here.”`]],
        [function (w) { return w === 1; }, function (w) { return w === 1; }, function (w) { return w !== 2; }, [`“The sparkle is in the ${n[1]} box.”`, `“The sparkle is in here.”`, `“The sparkle is not in here.”`]]
      ], form = pick(forms), truths = [0, 1, 2].map(function (w) { return [0, 1, 2].filter(function (i) { return form[i](w); }).length; });
      const ans = truths.indexOf(1); if (ans === -1 || truths.lastIndexOf(1) !== ans) return null;
      const options = cols.map(function (c, i) { return i === ans ? { label: `The ${c[0]} box`, icon: c[1], correct: true } : { label: `The ${c[0]} box`, icon: c[1], hint: `Test it. If the sparkle is in the ${c[0]} box, then ${truths[i] === 0 ? 'none of the notes are' : word(truths[i]) + ' of the notes are'} true. You need exactly one.` + T }; });
      return { text: [`The Bookworm is waiting with three little boxes again: ${n[0]}, ${n[1]}, and ${n[2]}.`, `“The sparkle is in one of these,” he says. “Each box has a note on it. And once again, only ONE of the three notes is true.”`],
        riddle: { lines: [0, 1, 2].map(function (i) { return `${cap(n[i])} box: ${form[3][i]}`; }).concat([`Only one note is true. Which box holds the sparkle?`]), options: options, after: [
          `You test each box in turn. Only the ${n[ans]} box leaves exactly one true note.`,
          `You open the ${n[ans]} box. The sparkle jumps out and sticks itself back on the little star’s point.`,
          `“The Sky Gate is just above,” says Blink. “It is locked at night. Two ways lead to the key.”`] } };
    }
  };

  /* word riddles Claude may rewrite: who asks it, and how many closing story lines to keep */
  const AI = {
    woods: ['the owl', 1], hill: ['the hare', 1], log: ['the hedgehog', 1], web: ['the spider', 1], stream: ['the old turtle', 2], raft: ['the duck', 1], well: ['the little bat', 0], tree: ['the Lantern Tree', 2], puff: ['Blink', 1], leaf: ['Blink', 1], home: ['Blink', 4],
    c2_1: ['the snail', 0], c2_5: ['the sleepy tortoise', 0], c2_8: ['the scarecrow', 3], c3_1: ['the water beetle', 0], c3_4: ['the little frog', 0], c3_8: ['the old catfish', 2],
    c4_1: ['Moss the mole', 0], c4_5: ['the fat grub', 1], c4_8: ['the old badger', 4], c5_1: ['the wind', 0], c5_4: ['the heron', 1], c5_8: ['the weathervane rooster', 3],
    c6_1: ['the snow hare', 0], c6_5: ['the otter’s cousin', 1], c6_8: ['the Light Keeper', 3], c7_1: ['the raccoon', 1], c7_5: ['the duck', 1], c7_8: ['the old toad', 2],
    c8_1: ['the Clock Mouse', 0], c8_4: ['the cuckoo', 1], c8_8: ['the Great Clock', 3], c9_3: ['the Bookworm', 0], c9_7: ['the cricket', 1], c9_8: ['the Great Book', 2], c10_1: ['the owl', 1], c10_8: ['the Moon', 3]
  };
  const LIB = {
    mushroom: 'A mushroom', egg: 'An egg', acorn: 'An acorn', seed: 'A seed', fireflies: 'Fireflies', stars: 'Stars', snow: 'A snowflake', reflection: 'Your reflection', footprints: 'Footprints', echo: 'An echo', shadow: 'A shadow',
    net: 'A fishing net', cocoon: 'A cocoon', web: 'A spider web', cage: 'A bird cage', rainbow: 'A rainbow', boat: 'A boat', heron: 'A heron', bridge: 'A bridge', bubble: 'A bubble', star: 'A star', fish: 'A fish', moon: 'The moon',
    parrot: 'A parrot', bell: 'A bell', cookie: 'A cookie', secret: 'A secret', flame: 'A candle flame', balloon: 'A balloon', suitcase: 'A suitcase', mattress: 'A mattress', blanket: 'A blanket', pillow: 'A pillow', book: 'A book',
    drawing: 'A drawing', dream: 'A dream', movie: 'A movie', breath: 'The wind', heartbeat: 'A heartbeat', yawn: 'A yawn', blink: 'A blink', comb: 'A comb', key: 'A key', clock: 'A clock', sundial: 'A sundial', glasses: 'A pair of glasses',
    snail: 'A snail', rose: 'A rose', turtle: 'A turtle', frog: 'A frog', butterfly: 'A butterfly', drop: 'A raindrop', roots: 'Tree roots', worm: 'A worm', carrot: 'A carrot', tunnel: 'A tunnel', kite: 'A kite', cloud: 'A cloud',
    ice: 'An ice cube', sled: 'A sled', scale: 'A scale', umbrella: 'An umbrella', smile: 'A smile', hourglass: 'A sand timer', cake: 'A birthday cake', coin: 'A coin', bookmark: 'A bookmark', pencil: 'A pencil', note: 'A song', ladder: 'A ladder', friend: 'A friend', 'stone-gray': 'A stone'
  };
  const MEMPOOL = Object.keys(LIB).filter(function (k) { return ['secret', 'dream', 'breath', 'heartbeat', 'reflection', 'echo', 'friend', 'note'].indexOf(k) === -1; });

  function hash(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }
  function lead(id, salt) {
    const who = AI[id][0], k = (hash(id) + (salt || 0)) % 3;
    if (k === 0) return [`${cap(who)} is waiting in the same spot as before.`, `“Back again? Good. I have a brand new riddle tonight.”`];
    if (k === 1) return [`${cap(who)} looks up as you come near.`, `“I made up a new riddle since last time. See if you can get this one.”`];
    return [`“There you are!” says ${who}. “My old riddle is worn out. Try this new one.”`];
  }
  function praise(id, salt) {
    const who = AI[id][0], k = (hash(id) + (salt || 0)) % 3;
    if (k === 0) return `“Right,” says ${who}. “You are too quick for me.”`;
    if (k === 1) return `“Yes! That is it,” says ${who}.`;
    return `“You got it,” says ${who}. “I will need a harder one next time.”`;
  }

  function prompt(ids, avoid) {
    const slots = ids.map(function (id) { return { slot: id, place: STORY[id].place, asked_by: AI[id][0] }; });
    return [
      'You are writing riddles for a bedtime game played by a smart 6-year-old who reads at a third-grade level and loves riddles.',
      'Write one new riddle for each slot below.',
      'Rules:',
      '- The answer must be one of the PICTURES listed (give its key). Use a different answer for every slot. Do not use any answer in the AVOID list.',
      '- Each riddle is 3 short clue lines spoken by the thing itself ("I ..."), then a last line that is exactly "What am I?" (or "What are we?" if the answer is plural).',
      '- Third-grade words and short sentences.',
      '- Every clue must be literally true of the answer. Together the clues must fit only the answer.',
      '- Make it a real challenge: look at the thing in a surprising but fair way. Never name the answer, or a word made from it, in the clues. Do not reuse famous riddles.',
      '- Give exactly 3 wrong choices, also from the PICTURES list. Each wrong choice should fit at least one clue, so it is tempting, but must clearly fail another clue.',
      '- For each wrong choice, write a hint of 1 or 2 short sentences for the child: say what fits, then which clue rules it out. Never reveal the right answer in a hint.',
      '- Gentle and calm. Nothing scary, sad, or rude.',
      '- If you can, loosely suit each riddle to the place where it is asked.',
      '- Before you answer, test each riddle: read every clue against the answer, then against each wrong choice. Fix any clue that is not strictly true, and any wrong choice that fits all the clues.',
      'Return only JSON, with no other text: [{"slot":"<id>","lines":["...","...","...","What am I?"],"answer":"<key>","wrong":[{"key":"<key>","hint":"..."},{"key":"<key>","hint":"..."},{"key":"<key>","hint":"..."}]}]',
      'SLOTS: ' + JSON.stringify(slots),
      'PICTURES (key = what the child sees): ' + Object.keys(LIB).map(function (k) { return k + ' = ' + LIB[k]; }).join('; '),
      'AVOID: ' + JSON.stringify(avoid || [])
    ].join('\n');
  }
  function okText(s, max) { return typeof s === 'string' && s.trim().length > 2 && s.length <= max; }
  function parse(text, ids, salt) {
    let arr; const out = [], usedAns = {};
    try { const a = String(text).indexOf('['), b = String(text).lastIndexOf(']'); arr = JSON.parse(String(text).slice(a, b + 1)); } catch (e) { return out; }
    if (!Array.isArray(arr)) return out;
    arr.forEach(function (it) {
      if (!it || ids.indexOf(it.slot) === -1 || !LIB[it.answer] || usedAns[it.answer]) return;
      if (!Array.isArray(it.lines) || it.lines.length < 3 || it.lines.length > 5 || !it.lines.every(function (l) { return okText(l, 170); })) return;
      if (!Array.isArray(it.wrong) || it.wrong.length < 3) return;
      const seen = {}; seen[it.answer] = 1;
      const wrong = it.wrong.slice(0, 3).filter(function (w) { if (!w || !LIB[w.key] || seen[w.key] || !okText(w.hint, 280)) return false; seen[w.key] = 1; return true; });
      if (wrong.length !== 3) return;
      if (out.some(function (o) { return o.id === it.slot; })) return;
      const words = LIB[it.answer].toLowerCase().replace(/^(a|an|the|your) /, '').split(' ').filter(function (w) { return w.length > 2; });
      const names = function (s) { return words.some(function (w) { return new RegExp('\\b' + w + '(s|es)?\\b', 'i').test(s); }); };
      if (it.lines.some(names) || wrong.some(function (w) { return names(w.hint); })) return;
      usedAns[it.answer] = 1;
      const lines = it.lines.map(function (l) { return esc(l.trim()); });
      if (!/\?$/.test(lines[lines.length - 1])) lines.push('What am I?');
      const options = shuffle([{ label: LIB[it.answer], icon: it.answer, correct: true }].concat(wrong.map(function (w) { return { label: LIB[w.key], icon: w.key, hint: w.hint.trim().replace(/\s*Try again!?\s*$/i, '') + T }; })));
      const base = STORY[it.slot].riddle.after, keep = AI[it.slot][1], tail = keep ? base.slice(-keep) : [];
      out.push({ id: it.slot, answer: it.answer, node: { text: lead(it.slot, salt), riddle: { live: true, lines: lines, options: options, after: [`“${LIB[it.answer]}!” you say.`, praise(it.slot, salt)].concat(tail) } } });
    });
    return out;
  }

  function roll(order) {
    const dyn = {}, salt = int(1, 99999);
    order.forEach(function (id, i) {
      const n = STORY[id];
      if (G[id]) { const d = G[id](); if (d) dyn[id] = d; }
      else if (n.maze) dyn[id] = { maze: Object.assign({}, n.maze, { seed: n.maze.seed + salt + i * 17 }) };
      else if (n.memory) dyn[id] = { memory: { icons: shuffle(MEMPOOL).slice(0, 6), after: n.memory.after } };
    });
    return { dyn: dyn, salt: salt };
  }

  return { roll: roll, gen: G, ai: AI, lib: LIB, lead: lead, prompt: prompt, parse: parse, knocks: KNOCKS, esc: esc };
})();
