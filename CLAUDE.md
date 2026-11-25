# Blink and the Riddle Road

A bedtime riddle and maze game for young readers. Ten chapters, 80 puzzles per full game.
The live site is https://lionellc.com, served by GitHub Pages from the `main` branch of this repository.

## Standing rule from the owner

Every time the game changes, publish the latest version to the website in the same piece of work.
Do not leave a change sitting only in a chat or only on the Claude artifact.

## How to change the game

1. Edit the files in `src/`. Never edit `index.html` by hand; it is generated.
2. Build: `python3 tools/build.py` (writes `index.html` at the repository root).
3. Audit: `node tools/verify.js`. It must end with `"problems":0`. It solves every number, pattern, letter and logic puzzle independently, re-rolls each generator 3,000 times, and checks every maze board.
4. Commit `src/` and `index.html` together and push to `main`. GitHub Pages redeploys in about a minute.
5. If the game is also published as a Claude artifact ("Blink and the Riddle Road"), republish the same `index.html` there too.

## Files

- `src/story.js` chapter 1; `src/chapters_a.js` chapters 2 to 5; `src/chapters_b.js` chapters 6 to 10.
- `src/remix.js` puzzle generators for replays, and the live-riddle prompt and its safety filter.
- `src/art.js` scene pictures and the world map; `src/icons.js` answer pictures.
- `src/engine.js` game logic: players, saving, mazes, matching game, maps.
- `src/template.html` page shell and styles.
- `CNAME` holds the site's address (`lionellc.com`). `.nojekyll` tells GitHub Pages to serve files as they are.

## Things to keep true

- Riddles must be original and logically sound: every clue true of the answer, every wrong choice ruled out by at least one clue.
- Third-grade reading level. Calm, bedtime-safe content.
- The story never uses he or she for the two sidekicks; players choose their names.
- The names "Maven", "Ella" and "Sharky" in the source are placeholders that the game swaps for the player's names.
- Live riddles written by Claude only work on the Claude artifact; on lionellc.com the game falls back to the hand-written riddles. Mazes and generated puzzles change on replays everywhere.
- Do not touch the domain's mail records (MX, SPF, DKIM) at the registrar.
