"""Build the game: glue the source files in src/ into the single page index.html."""
import os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
read = lambda name: open(os.path.join(root, 'src', name), encoding='utf-8').read()
page = read('template.html')
parts = (('/*STORY*/', ['story.js']), ('/*CHAPTERS*/', ['chapters_a.js', 'chapters_b.js', 'remix.js']),
         ('/*ART*/', ['art.js']), ('/*ICONS*/', ['icons.js']), ('/*ENGINE*/', ['clips.js', 'voice.js', 'engine.js']))
for mark, names in parts:
    assert page.count(mark) == 1, mark
    page = page.replace(mark, '\n'.join(read(n) for n in names))
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(page)
print('built index.html', len(page), 'characters')
