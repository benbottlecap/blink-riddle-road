# Blink and the Riddle Road

A bedtime riddle and maze game in ten chapters. Play it at https://lionellc.com

The game is the single page `index.html`, built from the files in `src/` by `python3 tools/build.py`.
Run `node tools/verify.js` before publishing; it checks every puzzle and maze.
Pushing to `main` publishes the site.

The read-aloud voices in `audio/` were made with the open-source Kokoro voice model (Apache 2.0 licence) by `tools/record.py`.
