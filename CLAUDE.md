# Blink and the Riddle Road

A bedtime riddle and maze game for young readers. Ten chapters, 80 puzzles per full game.
The live site is https://lionellc.com, served by GitHub Pages from the `main` branch of this repository.

## Standing rule from the owner

Every time the game changes, publish the latest version to the website in the same piece of work.
Do not leave a change sitting only in a chat or only on the Claude artifact.

## How to change the game

1. Edit the files in `src/`. Never edit `index.html` by hand; it is generated.
2. Build: `python3 tools/build.py` (writes `index.html` at the repository root).
3. Audit: `node tools/verify.js`. It must end with `"problems":0`. It solves every number, pattern, letter and logic puzzle independently, re-rolls each generator 3,000 times, checks every maze board, and checks who speaks each line against the reviewed list in `tools/voices.json`. If the story text changed, read the new speakers the audit prints, fix any wrong ones in `src/voice.js`, then run `node tools/verify.js --save-voices`.
4. If any words the game reads aloud changed (story, riddles, hints, choices), record them again, then build and audit once more:
   `NODE_PATH=$(npm root -g) node tools/lines.js` then `python tools/record.py` then `python3 tools/build.py`.
   The audit's `linesNotRecorded` should be 0. Lines without a recording still work, but in the device's robotic voice.
   `tools/record.py` explains what it needs (the open-source Kokoro voice model). Only new or changed lines are spoken again.
5. Commit `src/`, `audio/` and `index.html` together and push to `main`. GitHub Pages redeploys in about a minute.
6. If the game is also published as a Claude artifact ("Blink and the Riddle Road"), republish the same `index.html` there too, together with any changed `audio/<page>.m4a` files (same paths).

## Files

- `src/story.js` chapter 1; `src/chapters_a.js` chapters 2 to 5; `src/chapters_b.js` chapters 6 to 10.
- `src/remix.js` puzzle generators for replays, and the live-riddle prompt and its safety filter.
- `src/art.js` scene pictures and the world map; `src/icons.js` answer pictures.
- `src/voice.js` read-aloud: who says each line, playing the recorded voices, and the device-voice fallback.
- `audio/<page>.m4a` the recorded voices, one file per page. `src/clips.js` says where each line sits in them. Both are made by `tools/record.py`; never edit them by hand.
- `tools/lines.js` lists every line to record (`tools/lines.json`). `tools/record.py` holds the voice chosen for each character.
- `src/engine.js` game logic: players, saving, restart buttons, read-aloud buttons, mazes, matching game, maps.
- `src/template.html` page shell and styles.
- `CNAME` holds the site's address (`lionellc.com`). `.nojekyll` tells GitHub Pages to serve files as they are.

## Things to keep true

- Riddles must be original and logically sound: every clue true of the answer, every wrong choice ruled out by at least one clue.
- Third-grade reading level. Calm, bedtime-safe content.
- The story never uses he or she for the two sidekicks; players choose their names.
- The names "Maven", "Ella" and "Sharky" in the source are placeholders that the game swaps for the player's names.
- Live riddles written by Claude only work on the Claude artifact; on lionellc.com the game falls back to the hand-written riddles. Mazes and generated puzzles change on replays everywhere.
- Every story page has "Read to me" and "Read every page". The owner wants a warm, natural storyteller, not a robotic voice: the pages are read by recorded voices (storyteller plus one voice per character, set in `tools/record.py`). The device's built-in voice is only the fallback, for lines that hold a player's own names and for pages re-rolled on replays. A new character needs a line in `src/voice.js` and a voice in `tools/record.py`.
- Progress saves by itself on each device. "Save and stop", "Start chapter over" and "Start the whole game over" must keep working; the two start-over buttons need a second tap.
- Do not touch the domain's mail records (MX, SPF, DKIM) at the registrar.
