/* ---------------- Chapter 6 ---------------- */
addChapter({ id: 'c6', title: 'The Snowy Mountain', blurb: 'Find the Ice Bell and relight the Northern Lights.', art: 'snowy', nodes: [
  { id: 'c6_0', place: 'Your bedroom', art: 'bedroom', go: 'Ride up the mountain', text: [
    `<i>Tap. Tap. Tap.</i> There is frost on the window tonight. Blink is wearing a tiny scarf.`,
    `“The Northern Lights have gone out,” he says. “They are the night-light for the whole top of the world. The Light Keeper says her Ice Bell is missing. Without it, she cannot ring them back on.”`,
    `You put on your warmest robe. Ella gets a sock for a hat. Sharky gets a mitten for a sleeping bag.`,
    `A sled is waiting in the yard, pulled by six snow hares. Away you go, up the mountain.` ] },
  { id: 'c6_1', place: 'The Falling Snow', go: 'Ride on', text: [
    `White specks drift down all around the sled. One lands on your nose. A snow hare looks back at you.`,
    `“First mountain riddle,” she says. “What just landed on you?”` ],
    riddle: { lines: [`I fall a very long way, but I never get hurt.`, `I have six arms, and no two of us look the same.`, `Catch me on your tongue, and I am only a drop of water.`, `What am I?`],
      options: [
        no(`A raindrop`, 'drop', `A raindrop falls a long way. But it has no arms, and raindrops all look alike.`),
        no(`A star`, 'star', `A star has points. But it does not land on your tongue.`),
        ok(`A snowflake`, 'snow'),
        no(`A spider`, 'web', `A spider has eight legs, not six arms. And please do not catch one on your tongue.`) ],
      after: [`“A snowflake!” you say, and you catch one.`, `“Six arms, every time,” says the hare. “Count them if you do not believe me.”`] } },
  { id: 'c6_2', place: 'The Ice Maze', go: 'Slide on', text: [
    `The sled stops at a wall of blue ice. The only way on is through.`,
    `Three lost sparks of the Northern Lights flicker inside.` ],
    maze: { w: 7, h: 7, seed: 71, kind: 'plain', theme: 'ice', after: [`You slide out the far side on your slippers. <i>Wheee.</i>`] } },
  { id: 'c6_3', place: 'The Fox Den', go: 'Warm up inside', text: [
    `Four fox cubs tumble out of a snowy den. Their mother is counting boots.`,
    `“Four cubs,” she says. “Four paws each. One boot for every paw. But three boots are lost in the snow. How many boots do we still have?”` ],
    riddle: { lines: [`4 fox cubs.`, `4 boots for each cub.`, `3 boots are lost.`, `How many boots are left?`],
      options: [
        no(`11`, 'num:11', `Count 4 and 4 and 4 and 4. Then take away 3.`),
        no(`12`, 'num:12', `Four cubs with four boots each is 16. Then take away 3.`),
        ok(`13`, 'num:13'),
        no(`16`, 'num:16', `Sixteen is how many boots they started with. Now take away the 3 lost ones.`) ],
      after: [`“Four fours are 16,” you say. “Take away 3. Thirteen boots.”`, `“Thirteen,” sighs the mother fox. “Somebody is going to hop.”`] } },
  { id: 'c6_4', place: 'The Warm Cave', go: 'Go back out', text: [
    `The foxes invite you in to warm up. On the floor are twelve chips of ice with pictures scratched underneath.`,
    `“It is our matching game,” says the smallest cub. “Nobody has ever finished it.”` ],
    memory: { icons: ['snow', 'drop', 'star', 'moon', 'bell', 'flame'], after: [`You are warm again, and the cubs have seen how the game is done.`] } },
  { id: 'c6_5', place: 'The Frozen Lake', text: [
    `The path crosses a wide, flat lake. It is as hard as a floor and as clear as a window. The otter’s cousin slides past on her belly.`,
    `“Do you know what you are standing on?” she calls.` ],
    riddle: { lines: [`I am water, but you can walk on me.`, `I am as hard as a stone, but I float.`, `Hold me in a warm hand, and I cry myself away.`, `What am I?`],
      options: [
        no(`A stone`, 'stone-gray', `A stone is hard. But a stone sinks, and it is not water.`),
        no(`A bridge`, 'bridge', `You can walk over water on a bridge. But a bridge is not made of water.`),
        ok(`Ice`, 'ice'),
        no(`A bubble`, 'bubble', `A bubble floats. But you cannot walk on a bubble.`) ],
      after: [`“Ice!” you say.`, `“Ice,” she says. “The best thing water ever turned into.”`, `“The Ice Bell is up at the peak,” she calls. “A snowstorm is coming. Two trails go up.”`] },
    ask: `Which trail do you take?`, choices: [{ label: `Take the Pine Trail`, to: 'c6_6a' }, { label: `Take the Rock Trail`, to: 'c6_6b' }] },
  { id: 'c6_6a', place: 'The Pine Trail', to: 'c6_7', go: 'Climb to the peak', text: [`Snow whirls so thick that you can see only a step or two. Stay close to Blink’s light.`],
    maze: { w: 7, h: 7, seed: 73, kind: 'fog', theme: 'ice', after: [`The storm blows itself out. The peak is right above you, sharp against the stars.`] } },
  { id: 'c6_6b', place: 'The Rock Trail', go: 'Climb to the peak', text: [`Snow whirls so thick that you can see only a step or two. Stay close to Blink’s light.`],
    maze: { w: 8, h: 7, seed: 79, kind: 'fog', theme: 'ice', after: [`The storm blows itself out. The peak is right above you, sharp against the stars.`] } },
  { id: 'c6_7', place: 'The Carved Steps', go: 'Take the bell to the Light Keeper', text: [
    `Steps are cut into the rock. Each one has a letter. The top step is covered in snow.` ],
    riddle: { seq: ['let:A', 'let:C', 'let:E', 'let:G'], lines: [`A, C, E, G ...`, `What letter is on the top step?`],
      options: [
        no(`H`, 'let:H', `H comes right after G. But this pattern skips a letter each time.`),
        ok(`I`, 'let:I'),
        no(`J`, 'let:J', `That skips two letters. This pattern skips only one.`),
        no(`K`, 'let:K', `That skips three letters. This pattern skips only one.`) ],
      after: [`“A, skip B. C, skip D. E, skip F. G, skip H,” you say. “It is I!”`, `You brush off the snow. There is the letter I. And beside it, half buried, is a little silver bell made of ice.`] } },
  { id: 'c6_8', place: 'The Peak', ending: true, text: [
    `The Light Keeper is a great white owl. She takes the Ice Bell gently in her beak.`,
    `“You found it,” she says. “One last riddle before I ring it. How will you get home?”` ],
    riddle: { lines: [`I race down the hill, but I must be dragged back up.`, `I have no wheels, no legs, and no engine.`, `The snow is my road. Without it, I only sit.`, `What am I?`],
      options: [
        no(`A boat`, 'boat', `A boat has no wheels and no legs. But its road is water, not snow.`),
        no(`A kite`, 'kite', `A kite has no wheels. But it rides the wind, not the snow.`),
        no(`A snowflake`, 'snow', `A snowflake comes down the hill. But nobody drags it back up.`),
        ok(`A sled`, 'sled') ],
      after: [`“A sled!” you say.`, `“Then hold on,” says the Light Keeper. She rings the Ice Bell. <i>Ting.</i>`, `Green and pink and purple light pours across the sky like spilled paint. All over the top of the world, little animals stop being afraid of the dark.`, `Your sled races all the way home under the lights. You are asleep before it stops.`] } }
] });

/* ---------------- Chapter 7 ---------------- */
addChapter({ id: 'c7', title: 'The Night Market', blurb: 'Earn moon coins for a birthday present.', art: 'market', nodes: [
  { id: 'c7_0', place: 'Your bedroom', art: 'bedroom', go: 'Go to the market', text: [
    `<i>Tap. Tap. Tap.</i> Blink is hopping from foot to foot on the windowsill.`,
    `“Tomorrow is Grandma Glow’s birthday,” he says. “She will be three hundred and one. I want to buy her a present at the Night Market. But the stalls only take moon coins, and you only get moon coins for solving puzzles.”`,
    `“Then you need us,” you say.`,
    `The Night Market is under the old stone bridge. Paper lanterns swing on strings. Every stall has a puzzle and a jar of silver coins.` ] },
  { id: 'c7_1', place: 'The Weighing Stall', go: 'Go to the next stall', text: [
    `A raccoon sells nuts by the scoop. On her counter stands a shiny thing with two little dishes hanging from a bar.`,
    `“One coin if you can name it,” she says.` ],
    riddle: { lines: [`I have two arms and two dishes, but I never eat.`, `I cannot count, but I always know which side is heavier.`, `When both sides are fair, I stand perfectly level.`, `What am I?`],
      options: [
        no(`A clock`, 'clock', `A clock has two hands, not two dishes. And it cannot tell you which side is heavier.`),
        ok(`A scale`, 'scale'),
        no(`A bell`, 'bell', `A bell hangs from a bar. But it has no dishes.`),
        no(`A bridge`, 'bridge', `A bridge stands level. But it has no dishes, and it cannot tell which side is heavier.`) ],
      after: [`“A scale!” you say.`, `“One moon coin,” says the raccoon, and she drops it in your hand. It is cold and bright.`] } },
  { id: 'c7_2', place: 'The Fruit Stall', go: 'Walk into the lanes', text: [
    `A hedgehog sells fruit. “My cousin lives in a log,” he tells you.`,
    `“Apples are 2 coins. Pears are 3 coins. Pretend you have 10 coins, and you buy 2 apples. How many pears can you buy with what is left?”` ],
    riddle: { lines: [`You have 10 coins.`, `Apples cost 2. Pears cost 3.`, `You buy 2 apples.`, `How many pears can you buy with what is left?`],
      options: [
        no(`1`, 'num:1', `You can do better. After the apples you have 6 coins. How many 3s are in 6?`),
        ok(`2`, 'num:2'),
        no(`3`, 'num:3', `Three pears cost 9 coins. After the apples, you have only 6.`),
        no(`4`, 'num:4', `Four pears cost 12 coins. After the apples, you have only 6.`) ],
      after: [`“Two apples cost 4,” you say. “That leaves 6. Two pears cost 6. Two pears!”`, `“Sharp,” says the hedgehog. Another coin. That makes two.`] } },
  { id: 'c7_3', place: 'The Lantern Lanes', go: 'Stop at the bead stall', text: [
    `The market is a maze of stalls and strings of lights.`,
    `Three moon coins are shining on the ground where shoppers dropped them. Finders keepers.` ],
    maze: { w: 8, h: 7, seed: 83, kind: 'plain', theme: 'market', after: [`The coins clink in your pajama pocket.`] } },
  { id: 'c7_4', place: 'The Bead Stall', go: 'Go to the next stall', text: [
    `A spider sells necklaces. Each string has more beads than the last.`,
    `“How many beads go on my next string?” she asks. “Here is a hint. Add.”` ],
    riddle: { seq: ['num:1', 'num:1', 'num:2', 'num:3', 'num:5'], lines: [`1, 1, 2, 3, 5 ...`, `How many beads come next?`],
      options: [
        no(`6`, 'num:6', `The numbers do not go up by ones. Try adding the last two numbers together.`),
        no(`7`, 'num:7', `Close! Add the last two numbers: 3 and 5.`),
        ok(`8`, 'num:8'),
        no(`10`, 'num:10', `Add only the last two numbers: 3 and 5.`) ],
      after: [`“Each number is the two before it, added together,” you say. “3 and 5 is 8!”`, `“Most grown-ups miss that one,” says the spider. She pays you two coins.`] } },
  { id: 'c7_5', place: 'The Rain Stall', text: [
    `<i>Drip. Drip.</i> Rain is coming through the cracks in the bridge. A duck is doing very good business at the next stall.`,
    `“Name what I sell,” she says, “and I will lend you one.”` ],
    riddle: { lines: [`I open when the sky cries, and I close when it stops.`, `I have ribs, but no heart.`, `I keep you dry by getting wet myself.`, `What am I?`],
      options: [
        no(`A cloud`, 'cloud', `A cloud is what makes the sky cry. It does not keep you dry.`),
        no(`A mushroom`, 'mushroom', `A mushroom is the right shape. But it has no ribs, and it does not open and close.`),
        ok(`An umbrella`, 'umbrella'),
        no(`A blanket`, 'blanket', `A blanket covers you. But it has no ribs, and a wet blanket keeps nobody dry.`) ],
      after: [`“An umbrella!” you say.`, `The duck gives you a coin and lends you a big green umbrella. Ella is very glad.`, `“The present stall is behind the night gate,” says the duck. “The watchman hides the key. Go by Spice Row or by Cloth Row.”`] },
    ask: `Which row do you take?`, choices: [{ label: `Go by Spice Row`, to: 'c7_6a' }, { label: `Go by Cloth Row`, to: 'c7_6b' }] },
  { id: 'c7_6a', place: 'Spice Row', to: 'c7_7', go: 'Go through the night gate', text: [`Spice Row smells of pepper and cinnamon. Find the watchman’s key, and pick up any coins you see.`],
    maze: { w: 8, h: 7, seed: 89, kind: 'key', theme: 'market', after: [`The night gate creaks open. You count your coins. Almost enough.`] } },
  { id: 'c7_6b', place: 'Cloth Row', go: 'Go through the night gate', text: [`Cloth Row is hung with flags and scarves. Find the watchman’s key, and pick up any coins you see.`],
    maze: { w: 7, h: 8, seed: 97, kind: 'key', theme: 'market', after: [`The night gate creaks open. You count your coins. Almost enough.`] } },
  { id: 'c7_7', place: 'The Market Bell', go: 'Go to the present stall', text: [
    `A big brass bell hangs in the middle of the market. A sign says:`,
    `<b>RING THE RIGHT NUMBER FOR A PRIZE.</b>` ],
    riddle: { knock: { n: 12, gt: 10, lt: 15, even: true, by: [3], verb: 'Ring', noun: 'Rings', done: 'Done ringing' },
      lines: [`I am more than 10 and less than 15.`, `I am an even number.`, `You say me when you count by threes.`, `What number am I?`],
      options: [ok(`12`, 'num:12')],
      after: [`Only 12 and 14 are even. And counting by threes goes 3, 6, 9, 12. Twelve!`, `<i>Dong. Dong. Dong.</i> Twelve times. The whole market claps. The prize is a fat bag of moon coins.`] } },
  { id: 'c7_8', place: 'The Present Stall', ending: true, text: [
    `The last stall is run by an old toad in a velvet coat. He has music boxes, and silver thimbles, and tiny lanterns. Blink cannot choose.`,
    `“The best present in my stall is not for sale,” says the toad. “Guess it, and take anything else you like.”` ],
    riddle: { lines: [`You can give me away and still keep me.`, `I cost nothing, but I am worth a lot.`, `I am one small curve that changes a whole face.`, `Give me to someone, and you often get one right back.`, `What am I?`],
      options: [
        no(`A secret`, 'secret', `You do still have a secret after you share it. But a secret is not a curve on a face.`),
        no(`A flame`, 'flame', `A flame can be given and kept. Good remembering! But it does not change a face.`),
        no(`A yawn`, 'yawn', `You do often get a yawn right back. But a yawn is a big open circle, not a small curve.`),
        ok(`A smile`, 'smile') ],
      after: [`“A smile!” you say. You are wearing one.`, `The toad gives one right back. “Take the little lantern,” he says. “No charge.”`, `Blink cannot wait until tomorrow. He flies the present straight to the Lantern Tree. Grandma Glow gives him the biggest smile of her three hundred years.`, `You can see it from your bedroom window, all the way across the meadow. Then you fall asleep, smiling too.`] } }
] });

/* ---------------- Chapter 8 ---------------- */
addChapter({ id: 'c8', title: 'The Clock Tower', blurb: 'Wind the Great Clock so morning can come.', art: 'clock', nodes: [
  { id: 'c8_0', place: 'Your bedroom', art: 'bedroom', go: 'Go to the Clock Tower', text: [
    `<i>Tap. Tap. Tap.</i> You look at your clock. It says eight. That is odd. It said eight a long time ago.`,
    `“Every clock has stopped,” says Blink at the window. “The Great Clock in the tower has run down, and all the little clocks follow it. If nobody winds it, morning will never come.”`,
    `“No morning?” you say. “No breakfast?”`,
    `Ella and Sharky agree that this is serious. Off you go to the Clock Tower in the middle of town.` ] },
  { id: 'c8_1', place: 'The Tower Door', go: 'Go inside', text: [
    `A mouse in a waistcoat opens the tower door. He holds up a glass thing with sand inside.`,
    `“I am the Clock Mouse,” he says. “Before you come in, tell me what I use to time my tea.”` ],
    riddle: { lines: [`I have two rooms and one tiny door between them.`, `I am full of sand, but I am not a beach.`, `When my top room is empty, your time is up. Flip me over, and it starts again.`, `What am I?`],
      options: [
        no(`A clock`, 'clock', `A clock tells time. But it has no sand and no rooms.`),
        no(`A sundial`, 'sundial', `A sundial tells time with a shadow, not with sand.`),
        ok(`A sand timer`, 'hourglass'),
        no(`An egg`, 'egg', `You can time an egg with it. But an egg has no sand inside.`) ],
      after: [`“A sand timer!” you say.`, `“Three minutes for tea,” says the Clock Mouse. “Come in. Mind the gears.”`] } },
  { id: 'c8_2', place: 'The Gear Room', go: 'Climb the stairs', text: [
    `The bottom of the tower is packed with wheels and gears, all standing still. You have to squeeze between them.`,
    `Three bright little springs have popped loose. The clock will need them.` ],
    maze: { w: 8, h: 8, seed: 101, kind: 'plain', theme: 'brass', after: [`The springs are safe in your pocket.`] } },
  { id: 'c8_3', place: 'The Sleeping Bells', go: 'Climb higher', text: [
    `Halfway up, a bat hangs beside a row of bells.`,
    `“I ring the hours,” she says. “But I have lost track. When the clock stopped, it was 7 o’clock. Then I napped for 2 hours and ate moths for 1 hour. What time should it be now?”` ],
    riddle: { lines: [`The clock stopped at 7 o’clock.`, `The bat napped for 2 hours.`, `Then she ate for 1 hour.`, `What time should it be?`],
      options: [
        no(`8 o’clock`, 'num:8', `That is only 1 hour after 7. She napped for 2 hours and ate for 1.`),
        no(`9 o’clock`, 'num:9', `That counts her nap. Now add the hour she spent eating.`),
        ok(`10 o’clock`, 'num:10'),
        no(`11 o’clock`, 'num:11', `That is 4 hours after 7. She napped for 2 and ate for 1.`) ],
      after: [`“Seven and 2 is 9. One more is 10,” you say. “It should be 10 o’clock.”`, `“Ten! Long past bedtime,” says the bat.`] } },
  { id: 'c8_4', place: 'The Cake on the Stairs', text: [
    `On the next landing, someone has left a cake with candles. A cuckoo pops out of a little door in the wall.`,
    `“Cuckoo! It is nobody’s cake until the clock starts,” it says. “Guess what kind of day is stuck.”` ],
    riddle: { lines: [`I come once a year, but I am not a season.`, `Everybody has one, and nobody can borrow yours.`, `Each time I visit, your number goes up by one.`, `What am I?`],
      options: [
        no(`Winter`, 'snow', `Winter comes once a year. But winter is a season, and everybody shares it.`),
        no(`A full moon`, 'moon', `A full moon comes about once a month, not once a year.`),
        ok(`A birthday`, 'cake'),
        no(`A candle`, 'flame', `Candles come with it. But a candle is not a day.`) ],
      after: [`“A birthday!” you say.`, `“Grandma Glow’s,” whispers Blink. “She cannot turn three hundred and one until the clock moves.”`, `Two stairways go up from here.`] },
    ask: `Which stairs do you take?`, choices: [{ label: `Take the Front Stairs`, to: 'c8_5a' }, { label: `Take the Back Stairs`, to: 'c8_5b' }] },
  { id: 'c8_5a', place: 'The Front Stairs', to: 'c8_6', go: 'Step out behind the clock face', text: [`The stairs are pitch dark, and they twist and split like a maze.`],
    maze: { w: 8, h: 8, seed: 103, kind: 'fog', theme: 'brass', after: [`You come out high up, behind the giant clock face. The moon shines through the glass numbers.`] } },
  { id: 'c8_5b', place: 'The Back Stairs', go: 'Step out behind the clock face', text: [`The stairs are pitch dark, and they twist and split like a maze.`],
    maze: { w: 9, h: 7, seed: 107, kind: 'fog', theme: 'brass', after: [`You come out high up, behind the giant clock face. The moon shines through the glass numbers.`] } },
  { id: 'c8_6', place: 'The Clockmaker’s Table', go: 'Carry the key to the clock', text: [
    `The Clock Mouse keeps his tools up here, and a set of worn old cards.`,
    `“The winding key is under one of these pairs,” he says. “I forget which. Match them all.”` ],
    memory: { icons: ['clock', 'hourglass', 'sundial', 'bell', 'key', 'moon'], after: [`Under the last pair is a big brass winding key.`] } },
  { id: 'c8_7', place: 'The Clock Face', go: 'Go to the Great Clock', text: [
    `To set the clock, the mouse hops around the giant clock face. He lands on 1, then 4, then 7, then 10. Then he stops, puzzled.`,
    `“A clock has no 13,” he says. “Where do I land next?”` ],
    riddle: { seq: ['num:1', 'num:4', 'num:7', 'num:10'], lines: [`He hops 3 numbers each time.`, `After 12, a clock starts again at 1.`, `Where does he land next?`],
      options: [
        no(`11`, 'num:11', `He hops 3 numbers each time, not 1.`),
        no(`12`, 'num:12', `From 10, hop three numbers: 11, 12, and then one more. What comes after 12 on a clock?`),
        ok(`1`, 'num:1'),
        no(`2`, 'num:2', `That is four hops from 10. He hops only three.`) ],
      after: [`“Eleven, twelve, one,” you say. “He lands on 1!”`, `The mouse lands on the 1. Something deep in the tower goes <i>clunk.</i>`] } },
  { id: 'c8_8', place: 'The Great Clock', ending: true, text: [
    `The Great Clock itself speaks, in a voice like a slow drum.`,
    `“Wind me, and I will run. But first, tell me what it is that I count.”` ],
    riddle: { lines: [`I never stop, and I never go back.`, `Clocks can count me, but they cannot hold me.`, `You can spend me, save me, or waste me, but you can never buy more.`, `What am I?`],
      options: [
        no(`Money`, 'coin', `You can spend, save, or waste money. But you can get more of it, and clocks do not count it.`),
        no(`The wind`, 'breath', `The wind stops sometimes. This never does.`),
        no(`A river`, 'drop', `A river keeps going. But clocks do not count rivers.`),
        ok(`Time`, 'clock') ],
      after: [`“Time!” you say.`, `You fit the springs back in. You turn the big brass key. <i>Tick. Tock. Tick. Tock.</i>`, `All over town, clocks start again. Far away in the meadow, Grandma Glow turns three hundred and one.`, `“Now it can be morning,” says Blink. “But first it has to be bedtime.” And it is.`] } }
] });

/* ---------------- Chapter 9 ---------------- */
addChapter({ id: 'c9', title: 'The Library of Lost Words', blurb: 'Put the letters back in the books.', art: 'library', nodes: [
  { id: 'c9_0', place: 'Your bedroom', art: 'bedroom', go: 'Go to the library', text: [
    `<i>Tap. Tap. Tap.</i> Blink is at the window. Riding on his back is a worm in tiny glasses.`,
    `“I am the Bookworm,” he says. “There has been an accident at the Library of Lost Words. Somebody sneezed. All the letters blew out of the books. I need a reader to help me put them back.”`,
    `“I am a reader,” you say.`,
    `The library is inside a hollow hill. Its shelves go up and up, out of sight. Loose letters drift in the air like snow.` ] },
  { id: 'c9_1', place: 'The Front Desk', go: 'Walk into the shelves', text: [
    `Three letters are spinning above the front desk. The Bookworm squints at them.`,
    `“This word fell out of a book about owls,” he says. “Which word is it?”` ],
    riddle: { lines: [`I am a word with three letters.`, `Read me forward or backward, and I do not change.`, `You have two of me on your face.`, `What word am I?`],
      options: [
        no(`EAR`, 'txt:EAR', `You do have two ears. But read EAR backward and you get RAE.`),
        ok(`EYE`, 'txt:EYE'),
        no(`MOM`, 'txt:MOM', `MOM is the same forward and backward. But you do not have two of them on your face.`),
        no(`POP`, 'txt:POP', `POP is the same forward and backward. But you do not have two of them on your face.`) ],
      after: [`“EYE!” you say. “E, Y, E. It is the same both ways.”`, `The three letters zip back into the book about owls.`] } },
  { id: 'c9_2', place: 'The Tall Shelves', go: 'Tiptoe to the reading nook', text: [
    `The shelves make narrow halls that turn and turn.`,
    `Three bright letters have rolled far into the stacks.` ],
    maze: { w: 8, h: 8, seed: 109, kind: 'plain', theme: 'library', after: [`The letters are back where they belong.`] } },
  { id: 'c9_3', place: 'The Reading Nook', go: 'Go to the big table', text: [
    `In a soft chair sits a very old moth, asleep with a book on her lap. Something thin is sticking out of the pages.`,
    `“Do not pull it out,” whispers the Bookworm. “Just tell me what it is.”` ],
    riddle: { lines: [`I am as thin as a leaf, and I sleep between pages.`, `I never read a single word.`, `But I always know exactly where you stopped.`, `What am I?`],
      options: [
        no(`A book`, 'book', `A book has the pages. This thing sleeps between them.`),
        no(`A bookworm`, 'worm', `“I read every word!” says the Bookworm.`),
        ok(`A bookmark`, 'bookmark'),
        no(`A pillow`, 'pillow', `A pillow is for sleeping. But it is not thin, and it does not fit in a book.`) ],
      after: [`“A bookmark!” you whisper.`, `The moth opens one eye. “Do not lose my place,” she says, and she goes back to sleep.`] } },
  { id: 'c9_4', place: 'The Mixed-Up Table', text: [
    `Four letters lie on a table, spelling STAR. The Bookworm frowns.`,
    `“That is not right,” he says. “This page was about animals. Try reading it the other way.”` ],
    riddle: { lines: [`Start with the word STAR.`, `Read it backward, from the last letter to the first.`, `What animals do you get?`],
      options: [
        no(`ARTS`, 'txt:ARTS', `ARTS uses the same letters. But it is not STAR read backward. Start with the R.`),
        ok(`RATS`, 'txt:RATS'),
        no(`CATS`, 'txt:CATS', `There is no C in STAR.`),
        no(`TSAR`, 'txt:TSAR', `That is mixed up, not backward. Start with the last letter, R.`) ],
      after: [`“R, A, T, S,” you say. “Rats!”`, `Four letters scurry back to their page. A picture of rats waves at you.`, `“The oldest books are locked in the Deep Stacks,” says the Bookworm. “The key is on one of two floors.”`] },
    ask: `Which floor do you search?`, choices: [{ label: `Climb to the Upper Stacks`, to: 'c9_5a' }, { label: `Go down to the Lower Stacks`, to: 'c9_5b' }] },
  { id: 'c9_5a', place: 'The Upper Stacks', to: 'c9_6', go: 'Unlock the Deep Stacks', text: [`Dust lies thick up here. Find the key to the Deep Stacks, and gather any letters you see.`],
    maze: { w: 8, h: 8, seed: 113, kind: 'key', theme: 'library', after: [`The old lock opens with a sound like a book closing.`] } },
  { id: 'c9_5b', place: 'The Lower Stacks', go: 'Unlock the Deep Stacks', text: [`Dust lies thick down here. Find the key to the Deep Stacks, and gather any letters you see.`],
    maze: { w: 9, h: 7, seed: 127, kind: 'key', theme: 'library', after: [`The old lock opens with a sound like a book closing.`] } },
  { id: 'c9_6', place: 'The Alphabet Stair', go: 'Go through the door', text: [
    `The stair down to the Deep Stacks has a letter on every step. The last one is worn away.` ],
    riddle: { seq: ['let:Z', 'let:X', 'let:V', 'let:T'], lines: [`Z, X, V, T ...`, `What letter is on the last step?`],
      options: [
        no(`S`, 'let:S', `S comes right before T. But this pattern skips a letter each time.`),
        ok(`R`, 'let:R'),
        no(`Q`, 'let:Q', `That skips two letters. This pattern skips only one.`),
        no(`P`, 'let:P', `That skips three letters. This pattern skips only one.`) ],
      after: [`“Z, skip Y. X, skip W. V, skip U. T, skip S,” you say. “It is R!”`, `You step on the R. A door swings open.`] } },
  { id: 'c9_7', place: 'The Writing Desk', go: 'Open the Great Book', text: [
    `A desk stands in the Deep Stacks, with paper ready. A yellow stick with a pink tip lies beside it. A cricket is the clerk here.`,
    `“Name it,” says the cricket, “and you may use it.”` ],
    riddle: { lines: [`The more I work, the shorter I get.`, `I wear a little hat that fixes my mistakes.`, `I am full of words that nobody has written yet.`, `What am I?`],
      options: [
        no(`A candle`, 'flame', `A candle gets shorter as it works. But it has no hat that fixes mistakes.`),
        ok(`A pencil`, 'pencil'),
        no(`A book`, 'book', `A book is full of words that are already written.`),
        no(`A drawing`, 'drawing', `A drawing is what you make with it.`) ],
      after: [`“A pencil!” you say. “The hat is the eraser.”`, `“Then write,” says the cricket. “The last book has lost its very first words.”`] } },
  { id: 'c9_8', place: 'The Great Book', ending: true, text: [
    `The biggest book in the library lies open. Its first page is blank. You hold the pencil. The Bookworm holds his breath.`,
    `“Write what I am,” whispers the book.` ],
    riddle: { lines: [`I can be told a thousand times and never wear out.`, `I live in a book, but I also live in a voice in the dark at bedtime.`, `I often begin with “once” and finish with “the end.”`, `You are inside one right now.`, `What am I?`],
      options: [
        no(`A song`, 'note', `A song can be sung a thousand times. But it does not begin with “once.”`),
        no(`A dream`, 'dream', `A dream comes in the dark at bedtime. But nobody can tell the same dream a thousand times.`),
        ok(`A story`, 'book'),
        no(`A secret`, 'secret', `Tell a secret a thousand times, and it is not a secret anymore.`) ],
      after: [`You write: ONCE UPON A TIME.`, `“A story,” sighs the book. All through the library, letters fly home to their pages like birds to their nests.`, `“Thank you, reader,” says the Bookworm. “You may borrow any book you like. Forever.”`, `You pick one. But you are asleep before the fireflies get you home. Ella holds your place.`] } }
] });

/* ---------------- Chapter 10 ---------------- */
addChapter({ id: 'c10', title: 'The Star Ladder', blurb: 'Take a fallen star home before sunrise.', art: 'ladder', nodes: [
  { id: 'c10_0', place: 'Your yard', go: 'Climb Blueberry Hill', text: [
    `<i>Tap. Tap. Tap.</i> But tonight it is not the window. Something bright has landed in your yard with a soft <i>thump.</i>`,
    `You run outside with Ella and Sharky. Blink is already there. In the grass sits a very small star, holding one of her points and crying sparkly tears.`,
    `“I fell,” she says. “I leaned out too far to watch you solve riddles. Now I cannot get home, and the sun comes up soon. Stars cannot be on the ground when the sun comes up.”`,
    `“We will take you home,” you say. “All of us.”`,
    `Blink whistles. From the woods, the pond, the tunnels, and the clouds, your friends start to come.` ] },
  { id: 'c10_1', place: 'The Foot of the Sky', go: 'Start climbing', text: [
    `The owl from the Whispering Woods swoops down first. She points one wing. At the top of Blueberry Hill, something tall and silver is leaning against the sky.`,
    `“Whooo can tell me what it is?” she asks.` ],
    riddle: { lines: [`I have two long legs, but I never walk.`, `Between my legs are many steps, and you climb every one.`, `I lean against things, but I am never tired.`, `What am I?`],
      options: [
        no(`A heron`, 'heron', `A heron has two long legs. But a heron walks, and nobody climbs one.`),
        no(`A bridge`, 'bridge', `You walk across a bridge. You do not climb it, and it does not lean.`),
        ok(`A ladder`, 'ladder'),
        no(`A spider`, 'web', `A spider has eight legs, not two. And you should not climb one.`) ],
      after: [`“A ladder!” you say.`, `“The Star Ladder,” says the owl. “It only shows up when a star needs it. Climb fast.”`] } },
  { id: 'c10_2', place: 'The Lower Rungs', go: 'Climb on', text: [
    `The ladder goes up into a tangle of low clouds. There it splits into a hundred little ladders.`,
    `Three of the star’s sparkles are caught in the mist.` ],
    maze: { w: 9, h: 8, seed: 131, kind: 'plain', theme: 'sky', after: [`Above the clouds, the air is cold and clear. The little star rides on Ella’s head.`] } },
  { id: 'c10_3', place: 'The Slippery Part', go: 'Climb on', text: [
    `The otter is here, holding on to a rung.`,
    `“It gets icy,” he says. “I climbed 8 rungs. I slipped back 3. Then I climbed 6 more. What rung am I on? I have lost count again.”` ],
    riddle: { lines: [`He climbs 8 rungs.`, `He slips back 3.`, `He climbs 6 more.`, `What rung is he on?`],
      options: [
        no(`9`, 'num:9', `Eight take away 3 is 5. Now add 6.`),
        ok(`11`, 'num:11'),
        no(`14`, 'num:14', `Do not forget the slip. Eight take away 3 comes first.`),
        no(`17`, 'num:17', `He slipped back 3. Take them away. Do not add them.`) ],
      after: [`“Eight take away 3 is 5,” you say. “And 6 more is 11.”`, `“Eleven,” says the otter. “I knew that.” He did not know that.`] } },
  { id: 'c10_4', place: 'The Cloud Bench', go: 'Climb on', text: [
    `Halfway up there is a bench made of cloud. Puff the baby cloud has saved it for you.`,
    `Your friends have left a matching game on the seat.` ],
    memory: { icons: ['frog', 'turtle', 'snail', 'parrot', 'heron', 'fish'], after: [`The little star claps her points. She has stopped crying.`] } },
  { id: 'c10_5', place: 'The Dark Cloud', go: 'Climb on', text: [
    `A huge dark cloud sits right across the ladder. There is no way around it. Inside, you can see nothing but Blink.`,
    `“Stay close,” he says. “I am bright enough now. You made me that way.”` ],
    maze: { w: 9, h: 9, seed: 137, kind: 'fog', theme: 'storm', after: [`You burst out of the top of the cloud. The stars are so close that you could count their points.`] } },
  { id: 'c10_6', place: 'The Three Boxes', text: [
    `The Bookworm is waiting with three little boxes: gold, silver, and blue.`,
    `“The star’s missing sparkle is in one of these,” he says. “Each box has a note on it. But be careful. Only ONE of the three notes is true.”` ],
    riddle: { lines: [`Gold box: “The sparkle is in here.”`, `Silver box: “The sparkle is not in here.”`, `Blue box: “The sparkle is not in the gold box.”`, `Only one note is true. Which box holds the sparkle?`],
      options: [
        no(`The gold box`, 'gem:gold', `Test it. If it is in the gold box, the gold note is true. But then the silver note is true too. That is two true notes.`),
        ok(`The silver box`, 'gem:white'),
        no(`The blue box`, 'gem:blue', `Test it. If it is in the blue box, the silver note is true, and the blue note is true. That is two true notes.`) ],
      after: [`You test each box. If the sparkle is in the silver box, the gold note is false and the silver note is false. Only the blue note is true. One true note!`, `You open the silver box. The sparkle jumps out and sticks itself back on the little star’s point.`, `“The hardest one yet,” says the Bookworm, “and you worked it out.”`, `“The Sky Gate is just above,” says Blink. “It is locked at night. Two ways lead to the key.”`] },
    ask: `Which way do you go?`, choices: [{ label: `Go by the Milky Way`, to: 'c10_7a' }, { label: `Go by the Moon Path`, to: 'c10_7b' }] },
  { id: 'c10_7a', place: 'The Milky Way', to: 'c10_8', go: 'Open the Sky Gate', text: [`This is the top of everything. Find the key to the Sky Gate. Morning is coming.`],
    maze: { w: 9, h: 9, seed: 139, kind: 'key', theme: 'sky', after: [`The Sky Gate swings open. Behind it is the Moon, as big as a house and as kind as a grandmother.`] } },
  { id: 'c10_7b', place: 'The Moon Path', go: 'Open the Sky Gate', text: [`This is the top of everything. Find the key to the Sky Gate. Morning is coming.`],
    maze: { w: 10, h: 8, seed: 149, kind: 'key', theme: 'sky', after: [`The Sky Gate swings open. Behind it is the Moon, as big as a house and as kind as a grandmother.`] } },
  { id: 'c10_8', place: 'The Moon', ending: true, text: [
    `“Little star,” says the Moon, “you are home. And you, Maven. You have solved riddles on the road, under the pond, in the dark, in the clouds, on the mountain, in the market, in the tower, and in the library.”`,
    `“Here is my only one.”` ],
    riddle: { lines: [`I am not a thing you can buy or build.`, `You cannot be one all by yourself. It takes two.`, `Share a trouble with me, and it gets smaller. Share a joy with me, and it grows.`, `You have one under each arm.`, `What am I?`],
      options: [
        no(`A secret`, 'secret', `It takes two to share a secret. But a secret does not make a trouble smaller.`),
        no(`A smile`, 'smile', `A smile is free, and it is good to share. But you can smile all by yourself.`),
        no(`A shadow`, 'shadow', `A shadow stays with you. But you cannot share a joy with a shadow.`),
        ok(`A friend`, 'friend') ],
      after: [`You look at Ella. You look at Sharky. You look at Blink, and the owl, and the otter, and all the rest.`, `“A friend,” you say.`, `“The best answer there is,” says the Moon.`, `The little star hops up into her place in the sky and shines. She is the bright one just over your house. Look for her tomorrow.`, `The Moon carries you down herself and tucks you in. Ella on one side. Sharky on the other. Blink glows at the window like a night-light.`, `“Good night, Maven,” he whispers. “Thank you for everything.”`] } }
] });
