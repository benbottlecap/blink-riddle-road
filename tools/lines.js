/* Lists every line the game can read aloud on its hand-written pages, in the order it is said.
   Writes tools/lines.json for tools/record.py, which turns the lines into recorded voices.
   Run after `python3 tools/build.py`:  NODE_PATH=$(npm root -g) node tools/lines.js   (needs Playwright and Chrome) */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
(async () => {
  const root = path.dirname(__dirname);
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage();
  p.on('pageerror', e => { console.error('page error', e.message); process.exitCode = 1; });
  await p.goto('file://' + root + '/index.html', { waitUntil: 'domcontentloaded' });
  await p.fill('#f_hero', 'Maven'); await p.fill('#f_s1', 'Ella'); await p.fill('#f_s2', 'Sharky');
  await p.click('#names button[type=submit]');
  const pages = await p.evaluate(() => {
    const out = {}, s = __rr.state();
    const put = (id, list) => { const page = out[id] || (out[id] = []), seen = new Set(page.map(x => x.who + '|' + x.text));
      list.forEach(x => { const k = x.who + '|' + x.text; if (!seen.has(k)) { seen.add(k); page.push({ who: x.who, text: x.text, mark: x.mark }); } }); };
    s.screen = 'title'; put('title', __rr.say('page'));
    s.screen = 'play'; s.remix = false; s.dyn = {}; s.wrong = {};
    for (const id of Object.keys(STORY)) {
      const n = STORY[id], m = /^(c\d+)_/.exec(id);
      s.ch = m ? m[1] : 'c1'; s.node = id;
      s.solved = []; put(id, __rr.say('page'));
      s.solved = [id]; put(id, __rr.say('page'));
      if (n.riddle) put(id, n.riddle.options.filter(o => o.hint).map(o => ({ who: 'narrator', text: VOICE.plain(o.hint), mark: 'h' })));
    }
    return out;
  });
  await b.close();
  const n = Object.values(pages).reduce((a, l) => a + l.length, 0), chars = Object.values(pages).reduce((a, l) => a + l.reduce((c, x) => c + x.text.length, 0), 0);
  fs.writeFileSync(path.join(__dirname, 'lines.json'), JSON.stringify(pages, null, 0).replace(/\],"/g, '],\n"') + '\n');
  console.log(JSON.stringify({ pages: Object.keys(pages).length, lines: n, characters: chars }));
})();
