const CHAPTERS = [{ id: 'c1', title: 'The Riddle Road', blurb: 'Help Blink find his way home.', start: 'start', art: 'bedroom' }];
function addChapter(def) {
  CHAPTERS.push({ id: def.id, title: def.title, blurb: def.blurb, start: def.nodes[0].id, art: def.art });
  def.nodes.forEach(function (n, i) {
    if (!n.choices) {
      var nx = n.to || (def.nodes[i + 1] && def.nodes[i + 1].id);
      n.choices = nx && !n.ending ? [{ label: n.go || 'Go on', to: nx }] : [];
    }
    STORY[n.id] = n;
  });
}
function ok(label, icon) { return { label: label, icon: icon, correct: true }; }
function no(label, icon, hint) { return { label: label, icon: icon, hint: hint + ' Try again!' }; }

/* ---------------- Chapter 2 ---------------- */
addChapter({ id: 'c2', title: 'The Hedge Maze', blurb: 'Find Grandma Glow’s lost glasses.', art: 'garden', nodes: [
  { id: 'c2_0', place: 'Your bedroom', art: 'bedroom', go: 'Follow Blink to the garden', text: [
    `The next night, you are almost asleep when you hear it again. <i>Tap. Tap. Tap.</i>`,
    `It is Blink! His light is bright tonight, but his face is worried.`,
    `“Maven, we need you,” he says. “Grandma Glow has lost her glasses in the Hedge Maze. Without them she cannot read bedtime stories to the baby glowworms. And nobody at the Lantern Tree is as good at puzzles as you.”`,
    `You tuck Ella under one arm and Sharky under the other. Out the window you go.` ] },
  { id: 'c2_1', place: 'The Garden Gate', go: 'Open the gate', text: [
    `The Hedge Maze has a tall iron gate. It is locked. A snail is sliding slowly across the latch.`,
    `“I know how to open it,” says the snail. “The answer is hanging on a hook right beside you. But you must name it first.”` ],
    riddle: { lines: [`I have teeth, but I never chew.`, `I turn, but I never get dizzy.`, `A locked door listens to me, and to nobody else.`, `What am I?`],
      options: [
        no(`A comb`, 'comb', `A comb has teeth and never chews. But a door does not care about a comb.`),
        no(`A clock`, 'clock', `The wheels inside a clock have teeth, and they turn. Good thinking! But a locked door does not listen to a clock.`),
        ok(`A key`, 'key'),
        no(`A bell`, 'bell', `A door may have a bell. But a bell has no teeth, and it does not turn.`) ],
      after: [`“A key!” you say. There it is, on a little hook under the ivy. You turn it. <i>Click.</i>`, `“Slow and steady,” says the snail. “That is how to win a maze.”`] } },
  { id: 'c2_2', place: 'The First Hedges', go: 'Walk on', text: [
    `Green walls rise up on every side. Blink zips ahead and then zips right back.`,
    `“Three baby glowworms wandered in here looking for Grandma’s glasses,” he says. “Can you pick them up on the way through?”` ],
    maze: { w: 5, h: 5, seed: 11, kind: 'plain', theme: 'hedge', after: [`You come out the far side of the hedges. The baby glowworms ride on Ella’s back.`] } },
  { id: 'c2_3', place: 'The Carrot Patch', text: [
    `A field mouse in a straw hat is counting on her paws.`,
    `“Oh, whiskers,” she says. “I planted 4 rows of carrots. Each row had 3 carrots. Then a rabbit ate 5 of them. How many do I have left? Tell me, and I will show you the way on.”` ],
    riddle: { lines: [`4 rows of carrots.`, `3 carrots in each row.`, `A rabbit ate 5.`, `How many carrots are left?`],
      options: [
        no(`5`, 'num:5', `Five is how many the rabbit ate. How many did she plant first?`),
        ok(`7`, 'num:7'),
        no(`9`, 'num:9', `Count the rows again. 3 and 3 and 3 and 3 makes 12. Then take away 5.`),
        no(`12`, 'num:12', `Twelve is how many she planted. Now take away the 5 that the rabbit ate.`) ],
      after: [`“Three and three and three and three is 12,” you say. “Take away 5. That leaves 7.”`, `“Seven!” says the mouse. “Enough for soup.”`, `“The inner gate is locked,” she adds. “The gardener hides the key along one of these two paths. One is narrow and twisty. One is wide and long.”`] },
    ask: `Which path do you take?`, choices: [{ label: `Take the Twisty Path`, to: 'c2_4a' }, { label: `Take the Long Walk`, to: 'c2_4b' }] },
  { id: 'c2_4a', place: 'The Twisty Path', to: 'c2_5', go: 'Go through the inner gate', text: [`The hedges squeeze in close. Somewhere in here is the key to the inner gate.`],
    maze: { w: 6, h: 6, seed: 23, kind: 'key', theme: 'hedge', after: [`The key turns in the inner gate. You are nearly at the middle of the maze.`] } },
  { id: 'c2_4b', place: 'The Long Walk', go: 'Go through the inner gate', text: [`The path is wide here, but it goes on and on. Somewhere along it is the key to the inner gate.`],
    maze: { w: 8, h: 5, seed: 29, kind: 'key', theme: 'hedge', after: [`The key turns in the inner gate. You are nearly at the middle of the maze.`] } },
  { id: 'c2_5', place: 'The Stone Garden', go: 'Walk on', text: [
    `In a little square stands a stone table with a metal fin on top. Numbers are carved around its edge. A sleepy tortoise is leaning on it.`,
    `“Nobody looks at this old thing at night,” he says. “Can you guess why?”` ],
    riddle: { lines: [`I tell the time, but I have no hands and I never tick.`, `My only moving part is a shadow.`, `At night, I am no use at all.`, `What am I?`],
      options: [
        no(`A clock`, 'clock', `A clock tells the time. But it has hands, and it ticks all night long.`),
        no(`A shadow`, 'shadow', `A shadow is the moving part. But a shadow by itself cannot tell you the time.`),
        no(`The moon`, 'moon', `The moon is out at night. This thing is no use at night.`),
        ok(`A sundial`, 'sundial') ],
      after: [`“A sundial!” you say. “The sun makes a shadow, and the shadow points at the hour.”`, `“And no sun, no time,” says the tortoise. “That is why I nap here.”`] } },
  { id: 'c2_6', place: 'The Gnome’s Bench', go: 'Look in the flower bed', text: [
    `A garden gnome sits on a bench with twelve cards face down.`,
    `“I saw something shiny tonight,” he says. “I will tell you where, if you can match all my pairs.”` ],
    memory: { icons: ['mushroom', 'acorn', 'rose', 'snail', 'key', 'web'], after: [`“Well matched,” says the gnome. “The shiny thing is in the flower bed. Look for the pattern.”`] } },
  { id: 'c2_7', place: 'The Flower Bed', go: 'Go to the middle of the maze', text: [
    `The flower bed is planted in a pattern: a rose, then two seeds still waiting to grow, over and over. The last spot is covered by a big leaf.` ],
    riddle: { seq: ['rose', 'seed', 'seed', 'rose', 'seed', 'seed', 'rose', 'seed'], lines: [`Look at the row.`, `What is under the leaf in the last spot?`],
      options: [
        no(`A rose`, 'rose', `After each rose come two seeds. Only one seed has come so far.`),
        ok(`A seed`, 'seed'),
        no(`An acorn`, 'acorn', `There are no acorns in this pattern.`),
        no(`A mushroom`, 'mushroom', `There are no mushrooms in this pattern.`) ],
      after: [`You lift the leaf. Under it is a seed. And next to the seed lies a little empty glasses case.`, `“That is hers!” says Blink. “The glasses must be close.”`] } },
  { id: 'c2_8', place: 'The Middle of the Maze', ending: true, text: [
    `In the very middle of the maze stands a scarecrow. He is wearing a straw hat, an old coat, and something that does not belong to him.`,
    `“I will give them back,” says the scarecrow. “I only wanted to see the stars better. But first, tell me what they are.”` ],
    riddle: { lines: [`I have two windows, but no walls.`, `I sit on a nose and hold on to two ears.`, `Look through me, and blurry things turn clear.`, `What am I?`],
      options: [
        no(`The windows of a house`, 'windows', `Windows belong in walls. These two windows sit on a nose.`),
        ok(`A pair of glasses`, 'glasses'),
        no(`Your eyes`, 'blink', `Your eyes do the looking. But they do not sit on your nose or hold on to your ears.`),
        no(`A book`, 'book', `Grandma Glow reads books. But a book has no windows, and it does not sit on a nose.`) ],
      after: [`“Glasses!” you say.`, `The scarecrow hands them down. Blink flies them straight to Grandma Glow.`, `She puts them on. “Ah,” she says. “There you are, Maven. And Ella. And Sharky. Now, who wants a story?”`, `You listen to one story with the baby glowworms. Then the fireflies carry you home to bed. Ella and Sharky are already asleep.`] } }
] });

/* ---------------- Chapter 3 ---------------- */
addChapter({ id: 'c3', title: 'The Deep Blue Pond', blurb: 'Dive with Sharky to save the Pearl Lamp.', art: 'deep', nodes: [
  { id: 'c3_0', place: 'Your bedroom', art: 'bedroom', go: 'Dive into the pond', text: [
    `<i>Tap. Tap. Tap.</i> Blink is back, and he is dripping wet.`,
    `“The Pearl Lamp has rolled into the deep end of the pond,” he says. “It is the night-light for all the baby fish. They cannot sleep without it. I cannot swim. But I know someone who can.”`,
    `You look at Sharky. Sharky looks very brave.`,
    `At the edge of the pond, an old frog blows a bubble as big as a room. You step inside with Ella and Blink. Sharky swims beside you with a happy flick of the tail. Down you go.` ] },
  { id: 'c3_1', place: 'Under the Lily Pads', go: 'Swim into the reeds', text: [
    `Little silver balls drift up past you. A water beetle rows over.`,
    `“New down here?” he says. “Then tell me what those are.”` ],
    riddle: { lines: [`I am round, and I am made of air inside a thin wet skin.`, `I always travel up, never down.`, `Touch me, and I am gone.`, `What am I?`],
      options: [
        no(`A balloon`, 'balloon', `A balloon is round and full of air. But its skin is dry rubber, and one touch does not end it.`),
        no(`A raindrop`, 'drop', `A raindrop is round and wet. But it travels down, not up.`),
        ok(`A bubble`, 'bubble'),
        no(`An egg`, 'egg', `An egg has a thin shell. But it is not full of air, and it does not float up.`) ],
      after: [`“A bubble!” you say. “We are riding in one.”`, `“So you are,” says the beetle. “Mind the reeds. They are a maze down here.”`] } },
  { id: 'c3_2', place: 'The Reed Forest', go: 'Swim on', text: [
    `Tall reeds grow up from the mud like the bars of a cage. Sharky swims ahead to find the way.`,
    `Three baby fish are lost in here, each with a tiny light.` ],
    maze: { w: 6, h: 6, seed: 31, kind: 'plain', theme: 'water', after: [`Out of the reeds! The baby fish follow Sharky in a neat little line.`] } },
  { id: 'c3_3', place: 'The Fish School', go: 'Swim down to the sunken log', text: [
    `A whole school of fish swims by. Their teacher, a carp with tiny glasses, is counting.`,
    `“Twenty fish in my class,” she says. “Half of them turned left at the rock. Three of those hid in the weeds. How many of the left-turners can I still see?”` ],
    riddle: { lines: [`20 fish in the class.`, `Half of them turn left.`, `3 of the left-turners hide.`, `How many left-turners can she still see?`],
      options: [
        ok(`7`, 'num:7'),
        no(`10`, 'num:10', `Ten fish turned left. But 3 of them hid.`),
        no(`13`, 'num:13', `Half of 20 is 10. Take 3 away from 10. Do not add.`),
        no(`17`, 'num:17', `Only half the class turned left. Start with half of 20.`) ],
      after: [`“Half of 20 is 10,” you say. “Take away 3. Seven!”`, `“Seven. Thank you,” says the carp. “Class, say thank you.” The whole school blows bubbles at you.`] } },
  { id: 'c3_4', place: 'The Sunken Log', text: [
    `On a sunken log sits something small and green, kicking its legs.`,
    `“I was not always like this,” it says. “Guess what I am, and I will tell you where the lamp rolled.”` ],
    riddle: { lines: [`When I was a baby, I had a tail and no legs.`, `Now I have legs and no tail.`, `I began my life under the water, and now I can hop out of it.`, `What am I?`],
      options: [
        no(`A fish`, 'fish', `A fish begins life under the water. But it keeps its tail and never grows legs.`),
        no(`A turtle`, 'turtle', `A turtle has legs from the day it hatches. And it keeps its little tail.`),
        no(`A butterfly`, 'butterfly', `A butterfly changes a lot as it grows. But it was never a baby under the water.`),
        ok(`A frog`, 'frog') ],
      after: [`“A frog!” you say. “You used to be a tadpole.”`, `“I did,” says the frog. “The lamp rolled down into the Dark Deep. Two ways go down. Pick one.”`] },
    ask: `Which way do you go down?`, choices: [{ label: `Swim down the Narrow Crack`, to: 'c3_5a' }, { label: `Swim down the Wide Cave`, to: 'c3_5b' }] },
  { id: 'c3_5a', place: 'The Narrow Crack', to: 'c3_6', go: 'Swim toward the glow', text: [`It is black down here. Blink presses against the wall of the bubble. His light shows only a little way ahead.`],
    maze: { w: 6, h: 6, seed: 37, kind: 'fog', theme: 'water', after: [`A soft glow shines ahead. You are nearly there.`] } },
  { id: 'c3_5b', place: 'The Wide Cave', go: 'Swim toward the glow', text: [`It is black down here. Blink presses against the wall of the bubble. His light shows only a little way ahead.`],
    maze: { w: 7, h: 6, seed: 41, kind: 'fog', theme: 'water', after: [`A soft glow shines ahead. You are nearly there.`] } },
  { id: 'c3_6', place: 'The Shell Path', go: 'Follow the shells', text: [
    `Shells lie in a row on the sand. Each one has a number scratched on it. The last shell is turned over.` ],
    riddle: { seq: ['num:1', 'num:2', 'num:4', 'num:8'], lines: [`1, 2, 4, 8 ...`, `What number is on the last shell?`],
      options: [
        no(`9`, 'num:9', `The numbers do not go up by ones. Each number is double the one before.`),
        no(`10`, 'num:10', `From 4 to 8 is not plus 2. Each number is double the one before.`),
        no(`12`, 'num:12', `Each number is double the one before. Double 8 is not 12.`),
        ok(`16`, 'num:16') ],
      after: [`“Each one is double the one before,” you say. “Double 8 is 16!”`, `The last shell flips over by itself. Sixteen.`] } },
  { id: 'c3_7', place: 'The Four Gems', go: 'Carry the lamp back up', text: [
    `Four gems sit in a row on the pond floor. From left to right, they are red, white, blue, and gold.`,
    `A crayfish taps his claw. “The Pearl Lamp is buried under one of them. I will give you two clues.”` ],
    riddle: { lines: [`Clue one: it is somewhere to the left of the blue gem.`, `Clue two: it is not under the red gem.`, `Which gem do you dig under?`],
      options: [
        no(`The red gem`, 'gem:red', `The red gem is to the left of the blue one. But clue two says it is not the red gem.`),
        ok(`The white gem`, 'gem:white'),
        no(`The blue gem`, 'gem:blue', `The lamp is to the left of the blue gem, not under it.`),
        no(`The gold gem`, 'gem:gold', `The gold gem is to the right of the blue gem. Clue one says left.`) ],
      after: [`Red and white are to the left of blue. It is not red. So it must be white.`, `Sharky digs nose-first. Something round and bright rolls out of the sand. The Pearl Lamp!`] } },
  { id: 'c3_8', place: 'The Catfish’s Cave', ending: true, text: [
    `A huge old catfish blocks the way back up. His whiskers are as long as your arm.`,
    `“You may take the lamp,” he rumbles, “if you can name the thing that is all around you.”` ],
    riddle: { lines: [`I have no color, but I can look blue.`, `I have no shape of my own. I take the shape of whatever holds me.`, `You are inside me right now, and you drink me every day.`, `What am I?`],
      options: [
        no(`Air`, 'breath', `Air has no color and no shape. But you breathe air. You do not drink it.`),
        no(`A shadow`, 'shadow', `A shadow has no color of its own. But you cannot drink a shadow.`),
        ok(`Water`, 'drop'),
        no(`A bubble`, 'bubble', `You are inside a bubble. But a bubble has its own round shape, and you do not drink it.`) ],
      after: [`“Water!” you say.`, `“Water,” says the catfish, and he moves aside.`, `Sharky carries the Pearl Lamp up, very gently, between two rows of teeth, and sets it back on its rock. All over the pond, baby fish close their eyes.`, `The big bubble floats you to the top and pops. Soon you are home in bed, a little damp. Sharky sleeps with a big toothy smile.`] } }
] });

/* ---------------- Chapter 4 ---------------- */
addChapter({ id: 'c4', title: 'The Mole Tunnels', blurb: 'Hunt for the Glow Seed in the dark.', art: 'tunnels', nodes: [
  { id: 'c4_0', place: 'Your bedroom', art: 'bedroom', go: 'Slide down the hole', text: [
    `<i>Tap. Tap. Tap.</i> Blink is at the window. Beside him on the sill sits a mole with dirt on her nose.`,
    `“This is Moss,” says Blink. “The Glow Seed has fallen down her tunnels. It is the seed of the next Lantern Tree. If we do not find it, there will never be a new tree.”`,
    `“It is very dark down there,” says Moss. “I do not mind. I cannot see much anyway. But you will need your firefly.”`,
    `You, Ella, and Sharky follow her to a hole under the old apple tree. Down you slide.` ] },
  { id: 'c4_1', place: 'Under the Apple Tree', go: 'Follow Moss', text: [
    `Thick brown ropes hang down from the roof of the tunnel. Moss pats one.`,
    `“Mind your head,” she says. “Do you know what these are?”` ],
    riddle: { lines: [`I am the part of a tree that never sees the sun.`, `I drink all day, but I have no mouth.`, `The tree stands tall only because I hold on tight in the dark.`, `What am I?`],
      options: [
        no(`A worm`, 'worm', `A worm lives in the dark. But a worm has a mouth, and it does not hold up a tree.`),
        ok(`Roots`, 'roots'),
        no(`An acorn`, 'acorn', `An acorn can become a tree. But it does not drink all day or hold on tight.`),
        no(`A mushroom`, 'mushroom', `A mushroom grows in dark places. But it is not part of a tree, and it does not hold one up.`) ],
      after: [`“Roots!” you say.`, `“Roots,” says Moss. “I use them like street signs. Left at the big one.”`] } },
  { id: 'c4_2', place: 'The Dark Tunnels', go: 'Walk on', text: [
    `The tunnels twist every which way. Blink’s light shows only the walls right beside you.`,
    `Three glow pebbles mark Moss’s favorite spots.` ],
    maze: { w: 6, h: 6, seed: 43, kind: 'fog', theme: 'earth', after: [`“You pick a good path,” says Moss. That is a big thing for a mole to say.`] } },
  { id: 'c4_3', place: 'The Pantry', go: 'Walk on', text: [
    `Moss stops at a little room full of jars.`,
    `“I must count my tunnels,” she says. “I dug 3 on Monday. On Tuesday I dug twice as many as Monday. On Wednesday I was tired, and I dug only 1.”` ],
    riddle: { lines: [`3 tunnels on Monday.`, `Twice as many on Tuesday.`, `1 on Wednesday.`, `How many tunnels in all?`],
      options: [
        no(`7`, 'num:7', `Tuesday was twice as many as Monday. Twice 3 is 6, not 3.`),
        no(`9`, 'num:9', `Do not forget the one tunnel on Wednesday.`),
        ok(`10`, 'num:10'),
        no(`12`, 'num:12', `Twice 3 is 6. Now add 3, and 6, and 1.`) ],
      after: [`“Three, and six, and one,” you say. “Ten tunnels!”`, `“Ten,” says Moss. “No wonder my paws are sore.”`] } },
  { id: 'c4_4', place: 'The Gem Room', go: 'Go deeper', text: [
    `The next room sparkles. Twelve flat stones lie face down on the floor.`,
    `“My matching game,” says Moss. “I play by smell. You may use your eyes.”` ],
    memory: { icons: ['gem:red', 'gem:blue', 'gem:green', 'worm', 'acorn', 'mushroom'], after: [`“All matched,” says Moss. “Now I trust you with the deep tunnels.”`] } },
  { id: 'c4_5', place: 'The Root Cellar', text: [
    `Orange points poke down through the roof like a row of teeth. A fat grub is nibbling one.`,
    `“Shh,” he says. “Do not tell the gardener. Do you know what I am eating?”` ],
    riddle: { lines: [`I grow down into the dark while my green hair grows up into the light.`, `I am orange, but I have never seen the sun.`, `To pick me, you pull me up by my hair.`, `What am I?`],
      options: [
        ok(`A carrot`, 'carrot'),
        no(`Tree roots`, 'roots', `Roots grow down in the dark. But they are not orange, and nobody picks them.`),
        no(`A mushroom`, 'mushroom', `A mushroom has no green hair.`),
        no(`A flame`, 'flame', `A flame is orange. But it does not grow in the ground, and you cannot pull it up.`) ],
      after: [`“A carrot!” you say.`, `The grub points with his tail. “A shiny seed? It rolled down past the crystals. There are two ways. Both are locked by an old iron grate.”`] },
    ask: `Which tunnel do you take?`, choices: [{ label: `Take the Low Tunnel`, to: 'c4_6a' }, { label: `Take the High Tunnel`, to: 'c4_6b' }] },
  { id: 'c4_6a', place: 'The Low Tunnel', to: 'c4_7', go: 'Go through the grate', text: [`Crystals glow in the walls, so you can see the whole cavern. The key to the grate is somewhere in here.`],
    maze: { w: 7, h: 7, seed: 47, kind: 'key', theme: 'crystal', after: [`The grate swings open. Something is glowing green at the end of the tunnel.`] } },
  { id: 'c4_6b', place: 'The High Tunnel', go: 'Go through the grate', text: [`Crystals glow in the walls, so you can see the whole cavern. The key to the grate is somewhere in here.`],
    maze: { w: 8, h: 6, seed: 53, kind: 'key', theme: 'crystal', after: [`The grate swings open. Something is glowing green at the end of the tunnel.`] } },
  { id: 'c4_7', place: 'The Crystal Row', go: 'Step through the stone door', text: [
    `A row of crystals is set into the wall. One is missing.`,
    `“Put the right one in,” says Moss, “and the last door opens.”` ],
    riddle: { seq: ['gem:red', 'gem:blue', 'gem:blue', 'gem:green', 'gem:red', 'gem:blue', 'gem:blue', 'gem:green', 'gem:red', 'gem:blue', 'gem:blue'], lines: [`Look at the row.`, `Which crystal is missing from the end?`],
      options: [
        no(`Red`, 'gem:red', `Red comes after green, not after two blues.`),
        no(`Blue`, 'gem:blue', `There are only two blues in a row, and both are already here.`),
        ok(`Green`, 'gem:green'),
        no(`Gold`, 'gem:gold', `There is no gold in this pattern.`) ],
      after: [`Red, blue, blue, green, over and over. So green comes next! You press the green crystal in. The stone door rolls aside.`] } },
  { id: 'c4_8', place: 'The Deepest Room', ending: true, text: [
    `There it is. The Glow Seed sits on a little hill of dirt, shining soft green. But an old badger is curled around it, half asleep.`,
    `“One riddle, and it is yours,” he mumbles. “You have been walking in the answer all night.”` ],
    riddle: { lines: [`I am a road with a roof.`, `I have two mouths, but I never eat.`, `Go in one mouth in the dark, and come out the other into the light.`, `What am I?`],
      options: [
        no(`A bridge`, 'bridge', `A bridge is a road. But it has no roof and no mouths.`),
        no(`A bird cage`, 'cage', `A cage has a roof. But it is not a road, and you cannot walk through it.`),
        no(`A boat`, 'boat', `A boat can carry you. But it has no roof and no mouths.`),
        ok(`A tunnel`, 'tunnel') ],
      after: [`“A tunnel!” you say.`, `The badger yawns and rolls over. Ella lifts the Glow Seed with one careful trunk. It is warm.`, `Moss leads you up, up, up, and out under the stars. Grandma Glow plants the seed beside the Lantern Tree and pats the dirt down.`, `“Come back in a hundred years,” she says. “It will be taller than a house.”`, `Then it is home to bed, with dirt on your slippers.`] } }
] });

/* ---------------- Chapter 5 ---------------- */
addChapter({ id: 'c5', title: 'The Cloud Castle', blurb: 'Fly up on Ella’s ears to rescue a baby cloud.', art: 'clouds', nodes: [
  { id: 'c5_0', place: 'Your bedroom', art: 'bedroom', go: 'Fly up to the castle', text: [
    `<i>Tap. Tap. Tap.</i> Blink is at the window, pointing up.`,
    `“A baby cloud named Puff has blown away from her flock,” he says. “She is stuck on the weathervane on top of the Cloud Castle. If she is not home by morning, the meadow will have no shade.”`,
    `“How do we get up there?” you ask.`,
    `Blink looks at Ella. “Those are very big ears,” he says. “And tonight there is a very big wind.”`,
    `You hold on tight. Ella spreads two big ears like gray sails. Sharky holds on to your pajamas. Up you go!` ] },
  { id: 'c5_1', place: 'The Windy Stairs', go: 'Climb into the castle', text: [
    `You land on a stair made of cloud. Something pushes you from behind. Something whistles in your ear. But nobody is there.`,
    `“Guess who,” says a voice like a long breath.` ],
    riddle: { lines: [`I have no hands, but I can take your hat.`, `I have no feet, but I can run across a field, and you can watch the grass bend where I go.`, `You can feel me and hear me, but you can never see me.`, `What am I?`],
      options: [
        no(`An echo`, 'echo', `You can hear an echo and never see it. But an echo cannot take your hat.`),
        no(`A shadow`, 'shadow', `A shadow has no hands and no feet. But you can see it, and it makes no sound.`),
        ok(`The wind`, 'breath'),
        no(`A runaway balloon`, 'balloon', `A balloon can run away across a field. But you can see it go.`) ],
      after: [`“The wind!” you say.`, `“Whoo,” laughs the wind, and it gives you a push up the stairs.`] } },
  { id: 'c5_2', place: 'The Cloud Halls', go: 'Step out on the balcony', text: [
    `Inside the castle, the walls are fog and the floors are mist.`,
    `Three sparks of starlight are scattered in the halls.` ],
    maze: { w: 7, h: 7, seed: 59, kind: 'plain', theme: 'cloud', after: [`You step out onto a balcony. The whole world is far below, small and soft.`] } },
  { id: 'c5_3', place: 'The Bird Wire', go: 'Go to the next room', text: [
    `A silver wire runs from tower to tower. A row of sparrows sits on it. The littlest one is trying to count.`,
    `“Nine of us sat here,” she says. “Four flew off. Then two came back, and each one brought a friend. How many of us now?”` ],
    riddle: { lines: [`9 birds on the wire.`, `4 fly away.`, `2 come back, each with 1 friend.`, `How many birds are on the wire now?`],
      options: [
        no(`7`, 'num:7', `Two came back, and each brought a friend. That is 4 birds landing, not 2.`),
        no(`8`, 'num:8', `Count the friends too. Two birds and two friends is 4 birds landing.`),
        ok(`9`, 'num:9'),
        no(`11`, 'num:11', `Do not forget the 4 that flew away at the start.`) ],
      after: [`“Nine take away 4 is 5,” you say. “Then 2 birds and 2 friends land. Nine again!”`, `“Nine! The same as before!” The sparrows think this is the best joke they have ever heard.`] } },
  { id: 'c5_4', place: 'The Kite Room', text: [
    `In the next room, bright shapes bob against the ceiling, each one tied down with string. A heron in a blue cap is the keeper.`,
    `“Name one of these,” he says, “and you may borrow it.”` ],
    riddle: { lines: [`I fly, but I am not alive.`, `I have a tail, but I am not an animal.`, `The harder the wind pulls me away, the tighter someone holds my string.`, `What am I?`],
      options: [
        no(`A balloon`, 'balloon', `A balloon flies on a string. But it has no tail, and it does not need the wind.`),
        no(`A parrot`, 'parrot', `A parrot flies and has a tail. But a parrot is alive.`),
        ok(`A kite`, 'kite'),
        no(`A cloud`, 'cloud', `A cloud flies and is not alive. But nobody holds a cloud on a string.`) ],
      after: [`“A kite!” you say.`, `“Take the red one,” says the heron. “You will need it. The top of the castle is across the Sky Maze. Two doors lead in.”`] },
    ask: `Which door do you take?`, choices: [{ label: `Go through the Sun Door`, to: 'c5_5a' }, { label: `Go through the Rain Door`, to: 'c5_5b' }] },
  { id: 'c5_5a', place: 'The Sun Door', to: 'c5_6', go: 'Ride the kite up', text: [`The Sky Maze is made of thin gold mist. Hold on to the kite string, and do not look down.`],
    maze: { w: 7, h: 7, seed: 61, kind: 'plain', theme: 'cloud', after: [`The wind lifts the kite, and the kite lifts you, right up to the top of the tower.`] } },
  { id: 'c5_5b', place: 'The Rain Door', go: 'Ride the kite up', text: [`The Sky Maze is made of thin gray mist. Hold on to the kite string, and do not look down.`],
    maze: { w: 9, h: 6, seed: 67, kind: 'plain', theme: 'cloud', after: [`The wind lifts the kite, and the kite lifts you, right up to the top of the tower.`] } },
  { id: 'c5_6', place: 'The Weather Clock', go: 'Climb through the hatch', text: [
    `A great dial hangs on the tower wall, with numbers that count down. The last number has blown away.` ],
    riddle: { seq: ['num:20', 'num:17', 'num:14', 'num:11'], lines: [`20, 17, 14, 11 ...`, `What number comes next?`],
      options: [
        no(`10`, 'num:10', `The numbers do not go down by ones. Look at the jump from 20 to 17.`),
        no(`9`, 'num:9', `From 20 to 17 is 3. From 17 to 14 is 3. Take 3 from 11.`),
        ok(`8`, 'num:8'),
        no(`7`, 'num:7', `That is 4 less than 11. Each jump is only 3.`) ],
      after: [`“Each one is 3 less,” you say. “Eleven take away 3 is 8.”`, `You chalk an 8 on the dial. A hatch opens above you.`] } },
  { id: 'c5_7', place: 'The Racing Birds', go: 'Climb to the weathervane', text: [
    `Four birds have been racing around the tower all night: Jay, Dove, Wren, and Owl. Now they are arguing about who came second.` ],
    riddle: { lines: [`Jay finished before Dove.`, `Wren finished after Dove.`, `Owl finished last of all.`, `Who came second?`],
      options: [
        no(`Jay`, 'let:J', `Jay finished before Dove, and Dove was before Wren. So Jay was first, not second.`),
        ok(`Dove`, 'let:D'),
        no(`Wren`, 'let:W', `Wren finished after Dove. So Dove was ahead of Wren.`),
        no(`Owl`, 'let:O', `Owl finished last of all.`) ],
      after: [`“Jay, then Dove, then Wren, then Owl,” you say. “Dove was second!”`, `Dove bows. Owl says he was only resting his eyes.`] } },
  { id: 'c5_8', place: 'The Weathervane', ending: true, text: [
    `At the very top, a small white shape is snagged on the golden weathervane, sniffling. The weathervane is a rooster, and he is cross.`,
    `“I will let her go when someone tells me what she IS,” he says. “I have been asking all night.”` ],
    riddle: { lines: [`I can be white as wool or gray as a mouse.`, `I am heavier than an elephant, but I float.`, `I can hide the sun. And when I cry, the garden drinks.`, `What am I?`],
      options: [
        no(`A pillow`, 'pillow', `A pillow is white and soft. But it does not float, and it cannot hide the sun.`),
        no(`Snow`, 'snow', `Snow is white. But it falls down. It does not float in the sky.`),
        no(`A balloon`, 'balloon', `A balloon floats. But it is light, not heavy, and it does not cry.`),
        ok(`A cloud`, 'cloud') ],
      after: [`“A cloud!” you say.`, `“Hmph. Obviously,” says the rooster. He lifts one golden wing, and Puff floats free.`, `She is so happy that she rains on you a little. Ella does not like getting wet, but tonight Ella lets it go.`, `Puff carries all of you home on her back. It is like riding a very soft, very slow pillow. You are asleep before you land.`] } }
] });
