const STORY = {
  start: {
    place: `Your bedroom`,
    title: `Blink and the Riddle Road`,
    text: [
      `You are snug in bed, Maven. Ella the elephant is under one arm. Sharky the shark is under the other.`,
      `The house is quiet. A full moon hangs outside your window, as round and white as a dinner plate.`,
      `<i>Tap. Tap. Tap.</i>`,
      `Something tiny is knocking on the glass. You pull back the curtain. It is a firefly! But his light is very dim, like a flashlight with tired batteries.`,
      `“Hello,” he whispers. “My name is Blink. I am lost. I need to get home to the Lantern Tree before my light goes out.”`,
      `“I am Maven,” you whisper back. “This is Ella, and this is Sharky. How do you get to the Lantern Tree?”`,
      `“By the Riddle Road,” says Blink. “But every helper on the road asks a riddle. And they are not easy ones. I am terrible at riddles. Are you any good?”`,
      `You grin. You are <i>very</i> good at riddles.`,
      `“Oh, good,” says Blink. “Here is a firefly secret. We glow brighter near bright ideas. Every riddle you solve will make my light stronger. I need eight of them to shine all the way home.”`,
      `You put on your slippers. You tuck Ella under one arm and Sharky under the other. Then you tiptoe outside.`,
      `The grass is cool and wet on your ankles. Crickets are singing. Two paths lead away from your yard. One goes into the dark trees. One runs beside the water.`
    ],
    ask: `Which way do you go?`,
    choices: [
      { label: `Walk into the Whispering Woods`, to: `woods` },
      { label: `Follow the Silver Stream`, to: `stream` }
    ]
  },

  woods: {
    place: `The Whispering Woods`,
    text: [
      `The trees are tall here. Their leaves whisper, <i>shh, shh, shh,</i> as if the whole forest is trying to fall asleep.`,
      `Blink flies ahead. His light is so small that you can hardly see your own slippers. Little hard things crunch under your feet.`,
      `In the crook of a great oak tree sits an owl with round gold eyes.`,
      `“Whooo goes there?” she asks.`,
      `“A lost firefly and his three friends,” you say. “We are looking for the Lantern Tree.”`,
      `The owl turns her head almost all the way around to look at Ella and Sharky.`,
      `“An elephant and a shark in my woods,” she says. “Now I have seen everything. I know the way. But first, tell me what this is.”`
    ],
    riddle: {
      lines: [
        `I am smaller than your thumb, and I wear a little cap.`,
        `A giant is folded up inside me.`,
        `Plant me and wait, and the giant will stand taller than a house.`,
        `What am I?`
      ],
      options: [
        { label: `A mushroom`, hint: `A mushroom is small and wears a cap. That part fits. But there is no giant inside. A mushroom stays small. Try again!` },
        { label: `An egg`, hint: `An egg has a baby animal folded up inside. But an egg wears no cap, and nothing grows if you plant one. Try again!` },
        { label: `An acorn`, correct: true },
        { label: `A sunflower seed`, hint: `So close! A sunflower grows tall, but not taller than a house. And its seed has a striped shell, not a cap. Try again!` }
      ],
      after: [
        `You think about the little hard things under your slippers. You pick one up. It is wearing a tiny brown cap.`,
        `“An acorn!” you say.`,
        `The owl blinks slowly. “Clever. This whole oak tree was once folded up inside an acorn no bigger than your thumb.”`,
        `Blink’s light glows a little brighter. “That was a bright idea!” he says.`,
        `The owl points one wing up the path. “The road splits ahead. Blueberry Hill is up high. The Hollow Log is down low. Both will take you onward.”`
      ]
    },
    ask: `Which way do you go?`,
    choices: [
      { label: `Climb Blueberry Hill`, to: `hill` },
      { label: `Crawl through the Hollow Log`, to: `log` }
    ]
  },

  hill: {
    place: `Blueberry Hill`,
    text: [
      `You climb up, up, up. Blink rides on your shoulder. Ella and Sharky ride in your arms.`,
      `The trees end, and the sky opens wide above you.`,
      `At the top, a hare lies on her back in the clover. Her long ears are spread out like a pillow. She is looking straight up.`,
      `“Four hundred and six,” she mutters. “Four hundred and seven. Oh, bother. Now I have lost my place.”`,
      `“What are you counting?” asks Blink.`,
      `“I count them every night,” says the hare. “I always fall asleep before I finish. You tell me what they are. Then I will show you the way down.”`
    ],
    riddle: {
      lines: [
        `We are up there all day, but the sun hides us.`,
        `The darker it gets, the better we show.`,
        `We look like cold little sparks, but each of us is a fire bigger than the whole world.`,
        `What are we?`
      ],
      options: [
        { label: `Fireflies`, hint: `Blink giggles. “Not me! I show up better in the dark, but I am tiny up close too. And my light is not a fire.” Try again!` },
        { label: `The windows of a faraway town`, hint: `Faraway windows do look like little sparks at night. But a window is not a fire bigger than the world. Try again!` },
        { label: `Stars`, correct: true },
        { label: `Snowflakes`, hint: `Snowflakes are cold and little. But they really are little. These things only look small because they are very far away. Try again!` }
      ],
      after: [
        `You lie down in the clover next to her and look up. Ella and Sharky look up too.`,
        `“Stars!” you say.`,
        `“Yes,” says the hare. “Each star is a giant ball of fire. They only look small because they are so very far away. In the daytime they are still up there. The sun is just too bright for us to see them.”`,
        `“The sun is a star too,” she adds. “It is only the closest one.”`,
        `She points one long ear down the far side of the hill. “Follow the path into the brambles. Mind the weaver. She is fussy about her work.”`
      ]
    },
    choices: [{ label: `Go down into the brambles`, to: `web` }]
  },

  log: {
    place: `The Hollow Log`,
    text: [
      `The Hollow Log is as wide as a tunnel, and very long. Inside it is as dark as a pocket.`,
      `You hold Ella and Sharky tight. Blink’s little light is almost gone. Dry leaves crunch under your slippers.`,
      `Then you see a warm glow ahead. It is a hedgehog, holding a tiny lantern on a stick.`,
      `“Mind your step,” he says. “There are roots. I will light your way to the end of the log. But first, answer me this.”`
    ],
    riddle: {
      lines: [
        `I am joined to your feet, but you can never step on my head.`,
        `Lift the lantern high, and I shrink.`,
        `Set the lantern on the ground, and I stretch out long.`,
        `Blow the lantern out, and I am gone.`,
        `What am I?`
      ],
      options: [
        { label: `Your reflection`, hint: `Your reflection lives in mirrors and in still water. There is no mirror in this log. Try again!` },
        { label: `Your footprints`, hint: `Footprints are made by your feet. But they stay behind when you walk away, and they do not need a lantern. Try again!` },
        { label: `An echo`, hint: `An echo is a sound. Moving a lantern up and down cannot make a sound longer or shorter. Try again!` },
        { label: `Your shadow`, correct: true }
      ],
      after: [
        `“May I hold the lantern?” you ask. The hedgehog hands it over.`,
        `You lift it high. A short dark shape huddles at your feet. You set it on the ground. The dark shape shoots all the way down the log.`,
        `“My shadow!” you say.`,
        `“Right you are,” says the hedgehog. “No light, no shadow. Low light, long shadow.”`,
        `You wiggle Ella’s trunk. A giant dark trunk wiggles on the wall. Sharky’s shadow has very big teeth.`,
        `The hedgehog leads you through to the far end. “Out here and into the brambles,” he says. “Mind the weaver. She is fussy about her work.”`
      ]
    },
    choices: [{ label: `Walk into the brambles`, to: `web` }]
  },

  web: {
    place: `The Bramble Arch`,
    text: [
      `The path dips into a thicket of brambles. The branches bend over your head and make an arch.`,
      `You are about to walk through when Blink squeaks, “Stop!”`,
      `You freeze. Right in front of your nose, something silver is stretched across the arch from side to side. Drops of dew hang on it like tiny glass beads.`,
      `In the very middle sits a small gray weaver. She has more legs than you can count in a hurry.`,
      `“Thank you for stopping,” she says. “The last visitor walked straight through my night’s work. It was a badger. It took me until morning to fix.”`,
      `“We are sorry about the badger,” you say. “Is there a way around?”`,
      `“There is. But first, tell me what you nearly walked into.”`
    ],
    riddle: {
      lines: [
        `I am a trap with no teeth and a net with no knots.`,
        `My maker carried every bit of the thread inside her own body.`,
        `The wind blows right through me, but a fly cannot.`,
        `What am I?`
      ],
      options: [
        { label: `A fishing net`, hint: `A fishing net is full of knots. And its thread came from a shop, not from inside its maker. Try again!` },
        { label: `A cocoon`, hint: `Good thinking! A caterpillar does spin a cocoon with thread from its own body. But a cocoon is a snug sleeping bag, not a trap. Wind cannot blow through it. Try again!` },
        { label: `A spider web`, correct: true },
        { label: `A bird cage`, hint: `A bird cage has bars, not thread. And a fly can zip right between the bars. Try again!` }
      ],
      after: [
        `You look at the silver threads. You look at the weaver and count her legs slowly this time. Eight.`,
        `“A spider web!” you say.`,
        `“Just so,” says the spider. “Every thread came out of me. No knots, no needle, and all of it made since sunset.”`,
        `Sharky thinks a trap with no teeth is a very strange idea.`,
        `The spider points one thin leg at a gap low in the brambles. “Crawl under there. You will come out at the tall hedge. Look for the Round Door.”`
      ]
    },
    choices: [{ label: `Crawl under the brambles`, to: `door` }]
  },

  stream: {
    place: `The Silver Stream`,
    text: [
      `The stream sparkles in the moonlight. It chatters over the pebbles like someone telling a long story.`,
      `You hold Sharky up for a good look. Sharks love water.`,
      `But the stream is too wide to jump, and you do not want wet slippers.`,
      `An old turtle rests on the bank with his chin on a stone.`,
      `“Looking for a way across?” he asks, very slowly. “There is one close by. I have used it for a hundred years. Tell me its name, and I will tell you where it is.”`
    ],
    riddle: {
      lines: [
        `I have one foot on each bank, but I never take a step.`,
        `I am over the water, but I am not a bird.`,
        `Travelers walk across my back, and I stay right where I am.`,
        `What am I?`
      ],
      options: [
        { label: `A rainbow`, hint: `Great thinking! A rainbow curves over the water with one end on each side. But nobody can walk across a rainbow. Try again!` },
        { label: `A boat`, hint: `A boat carries travelers. But a boat sits in the water, not over it. And it moves. Try again!` },
        { label: `A heron`, hint: `A heron stands very still by the water. But a heron is a bird, and nobody walks across its back. Try again!` },
        { label: `A bridge`, correct: true }
      ],
      after: [
        `You think about feet, and backs, and banks.`,
        `“A bridge!” you say.`,
        `The turtle nods, very slowly. It takes a long time. “Just past the reeds.”`,
        `Blink’s light glows a little brighter. “That was a bright idea!” he says.`,
        `You cross the little wooden bridge. Your slippers go <i>clomp, clomp, clomp.</i> Ella looks over one side. Sharky looks over the other.`,
        `On the far side, the road comes to a wide, still pond. The Lantern Tree is somewhere past it.`
      ]
    },
    ask: `How do you cross the pond?`,
    choices: [
      { label: `Hop across the stepping stones`, to: `stones` },
      { label: `Ride the lily pad raft`, to: `raft` }
    ]
  },

  stones: {
    place: `The Stepping Stones`,
    text: [
      `Four stones sit in a row at the edge of the pond. From left to right, there is a gray stone, a white stone, a speckled stone, and a black stone.`,
      `A frog watches you from a lily leaf. Her throat goes in and out.`,
      `“Careful,” she croaks. “Only one of those stones starts the real path. The other three wobble and tip. <i>Splash!</i>”`,
      `You do not want a splash. Ella does not like getting wet. Sharky would not mind at all.`,
      `“Which one is it?” you ask.`,
      `“I will give you two clues,” says the frog. “You need both of them. Think before you hop.”`
    ],
    riddle: {
      lines: [
        `Clue one: the steady stone is not at either end of the row.`,
        `Clue two: the steady stone is not next to the black stone.`,
        `Which stone do you step on?`
      ],
      options: [
        { label: `The gray stone`, hint: `The gray stone is at the left end of the row. Clue one says the steady stone is not at an end. Try again!` },
        { label: `The white stone`, correct: true },
        { label: `The speckled stone`, hint: `The speckled stone is not at an end, so it fits clue one. But look what is right beside it. Try again!` },
        { label: `The black stone`, hint: `The black stone is at the right end of the row. Clue one says the steady stone is not at an end. Try again!` }
      ],
      after: [
        `You point at each stone in turn. The gray stone and the black stone are at the ends, so they are out. That leaves the white one and the speckled one. But the speckled stone sits right next to the black one. So it is out too.`,
        `You step onto the white stone. It holds as still as a table.`,
        `“Well worked out,” says the frog. “Most visitors just guess. Most visitors get wet.”`,
        `More stones rise up in a neat row. <i>Hop, hop, hop.</i> You are across. A muddy slide runs down the bank ahead, and somebody is whistling.`
      ]
    },
    choices: [{ label: `Follow the whistling`, to: `otter` }]
  },

  raft: {
    place: `The Lily Pad Raft`,
    text: [
      `A fat green lily pad bobs by the bank. It is as big as a rug.`,
      `“All aboard,” says a sleepy duck. “No splashing. No standing up. No sharks in the water.” She gives Sharky a long look.`,
      `You sit down in the middle with Ella and Sharky safe in your lap. The duck pushes the lily pad along with her beak. The water goes <i>lap, lap, lap.</i>`,
      `Halfway across, she stops. The pond is as smooth as glass.`,
      `“Look around you,” she says. “It is riddle time.”`
    ],
    riddle: {
      lines: [
        `There is only one of me, but tonight you can see two.`,
        `One is too high to reach.`,
        `The other is close enough to touch. But touch it, and it breaks into wiggly pieces.`,
        `Leave it alone, and it mends itself.`,
        `What am I?`
      ],
      options: [
        { label: `A bubble`, hint: `Touch a bubble and it does break. But it pops for good. It never mends itself. Try again!` },
        { label: `A star`, hint: `There is not only one star. There are too many to count! Try again!` },
        { label: `A fish`, hint: `A fish is close enough to touch. But there are lots of fish in a pond, and a fish does not break into pieces. Try again!` },
        { label: `The moon`, correct: true }
      ],
      after: [
        `You look up. A bright white circle hangs high over the trees. You look down. There it is again, floating beside the lily pad.`,
        `You dip one finger into the water. The circle breaks into wiggly ribbons. Then it slides back together.`,
        `“The moon!” you say.`,
        `“Yes,” says the duck. “The pond is like a mirror. There is one moon, up in the sky. The other one is only its picture.”`,
        `She pushes you the rest of the way. On the far bank, a muddy slide runs down to the water, and somebody is whistling.`
      ]
    },
    choices: [{ label: `Follow the whistling`, to: `otter` }]
  },

  otter: {
    place: `The Otter’s Slide`,
    text: [
      `<i>Whee! Splash!</i> An otter zooms down the muddy slide on his belly. He pops up out of the water right at your feet.`,
      `He climbs out and shakes himself. Then he sees Sharky and jumps a little.`,
      `“Is that a shark?”`,
      `“Sharky is a very gentle shark,” you say. “Sharky only eats pretend fish.”`,
      `“Good,” says the otter. “Because I am a bit short of fish tonight, and I cannot work out why. Help me with my fish problem, and I will show you the path to the tall hedge.”`,
      `He holds up three small fish by their tails.`
    ],
    riddle: {
      lines: [
        `Tonight I caught some fish.`,
        `I gave half of them to my sister.`,
        `Then I ate 2 myself.`,
        `Now I have 3 left.`,
        `How many fish did I catch?`
      ],
      options: [
        { label: `5`, hint: `You cannot share 5 fish fairly in half. Here is a hint. Before he ate 2, he had 5. And those 5 were only half. Try again!` },
        { label: `8`, hint: `Test it. Half of 8 is 4. He eats 2. That leaves 2 fish, not 3. Try again!` },
        { label: `10`, correct: true },
        { label: `12`, hint: `Test it. Half of 12 is 6. He eats 2. That leaves 4 fish, not 3. Try again!` }
      ],
      after: [
        `You work it out backward. He has 3 fish now. Before he ate 2, he had 5. And those 5 were only half. The other half went to his sister. So that is 5, and 5 more.`,
        `“Ten!” you say. “You caught 10 fish.”`,
        `The otter counts on his paws. “Five for her. Five for me. Two in my tummy. Three in my paw. You are right! Nobody took any. I just ate them.”`,
        `He points his tail up the bank. “Follow the path through the tall grass. You will come to the tall hedge. Look for the Round Door.”`
      ]
    },
    choices: [{ label: `Take the path to the hedge`, to: `door` }]
  },

  door: {
    place: `The Round Door`,
    text: [
      `The hedge is taller than your house. It is too tall to climb and too thick to squeeze through. It goes left and right as far as you can see.`,
      `But in the middle is a round wooden door. It has a brass knocker shaped like an acorn.`,
      `A sign on the door says:`,
      `<b>KNOCK THE RIGHT NUMBER OF TIMES.</b>`,
      `“Oh dear,” says Blink. “I always knock the wrong number. Then it will not open until tomorrow.”`,
      `Under the sign, in small curly letters, is a riddle.`
    ],
    riddle: {
      lines: [
        `I am less than 20.`,
        `You say me when you count by threes.`,
        `You say me when you count by fives.`,
        `What number am I?`
      ],
      options: [
        { label: `10`, hint: `Count by fives: 5, 10. Yes! Now count by threes: 3, 6, 9, 12. You skip right over 10. Try again!` },
        { label: `12`, hint: `Count by threes: 3, 6, 9, 12. Yes! Now count by fives: 5, 10, 15. You skip right over 12. Try again!` },
        { label: `18`, hint: `Count by threes: 3, 6, 9, 12, 15, 18. Yes! Now count by fives: 5, 10, 15, 20. You skip right over 18. Try again!` },
        { label: `15`, correct: true }
      ],
      after: [
        `You count by threes on your fingers. 3, 6, 9, 12, 15, 18. Then you count by fives. 5, 10, 15. Only one number is in both lists.`,
        `“Fifteen!” you say.`,
        `You knock fifteen times. It takes a while. Blink counts along so you do not lose your place.`,
        `The round door swings open without a sound.`,
        `Behind it is a garden, silver in the moonlight. A white stone path goes two ways. One way leads to a mossy stump with a tiny light on it. The other way leads to an old stone well.`
      ]
    },
    ask: `Which way do you go?`,
    choices: [
      { label: `Visit the mossy stump`, to: `stump` },
      { label: `Look into the old well`, to: `well` }
    ]
  },

  stump: {
    place: `The Reading Stump`,
    text: [
      `On top of the mossy stump sits a worm. He wears glasses no bigger than two drops of dew. He is reading a leaf. A glowworm holds very still above him for a lamp.`,
      `“Shh,” says the worm, without looking up. “I am at the good part.”`,
      `You wait. Ella waits. Sharky waits. Blink does not wait very well.`,
      `At last the worm turns his leaf over. “I am a bookworm,” he says. “I love words. I love the letters inside them even more. You look like a reader. Are you a reader?”`,
      `“Yes,” you say.`,
      `“Then this one is for you.”`
    ],
    riddle: {
      lines: [
        `I am a letter.`,
        `You can find me in FROG and in HEDGEHOG.`,
        `I am in MOON two times.`,
        `What letter am I?`
      ],
      options: [
        { label: `G`, hint: `G is in FROG and in HEDGEHOG. Good! But now look at MOON. There is no G in it. Try again!` },
        { label: `N`, hint: `N is in MOON, but only one time. And there is no N in FROG. Try again!` },
        { label: `O`, correct: true },
        { label: `R`, hint: `R is in FROG. But there is no R in HEDGEHOG or in MOON. Try again!` }
      ],
      after: [
        `You spell the words in your head. FROG and HEDGEHOG both have a G and an O. But MOON has no G at all. And it has two Os, right in the middle.`,
        `“The letter O!” you say.`,
        `“Oh, yes,” says the bookworm. He looks very pleased. “And look up. Tonight the moon is shaped like one, too.”`,
        `He points his tail down the white path. “The Lantern Tree is just past the roses. Good night, reader.”`
      ]
    },
    choices: [{ label: `Walk past the roses`, to: `tree` }]
  },

  well: {
    place: `The Old Well`,
    text: [
      `The old well is made of round gray stones. A wooden bucket hangs over it on a rope.`,
      `You stand on your tiptoes and look in. It is very deep and very dark. You cannot see the bottom. You take a big breath to call down.`,
      `“Do not shout yet,” says a tiny voice.`,
      `A little brown bat is hanging upside down under the roof of the well.`,
      `“First, guess what lives at the bottom,” she says. “Then you may call down and see if you are right.”`
    ],
    riddle: {
      lines: [
        `I never speak first.`,
        `I have no mouth, but I answer you.`,
        `I only know the words you just gave me.`,
        `I say them softer, and a little late.`,
        `What am I?`
      ],
      options: [
        { label: `A parrot`, hint: `A parrot copies your words. But a parrot has a beak to talk with, and it loves to speak first. Try again!` },
        { label: `Your shadow`, hint: `Your shadow copies you, and it has no mouth. But a shadow never makes a sound. Try again!` },
        { label: `A bell`, hint: `A bell has no mouth, and it rings back when you hit it. But a bell cannot say your words. Try again!` },
        { label: `An echo`, correct: true }
      ],
      after: [
        `“An echo!” you say.`,
        `“Try it,” says the bat.`,
        `You lean over the stones. “Hello, well!”`,
        `<i>“Hello, well,”</i> says the well, softer and a little late.`,
        `“Good night, Sharky!” you call. <i>“Good night, Sharky,”</i> says the well. Ella wants a turn too.`,
        `“I use echoes to find my way in the dark,” says the bat. “I squeak, and I listen for my squeak to bounce back. That is how I know where the trees are.”`,
        `She points one wing down the white path. “And that is how I know the Lantern Tree is just past the roses.”`
      ]
    },
    choices: [{ label: `Walk past the roses`, to: `tree` }]
  },

  tree: {
    place: `The Lantern Tree`,
    text: [
      `Past the roses is a meadow. In the middle stands the biggest tree you have ever seen. Its branches spread wider than your whole house. But it is dark from top to bottom.`,
      `“Oh no,” says Blink. “Everyone is asleep already.”`,
      `“Not everyone,” says a creaky little voice. An old firefly floats down from a branch. Her light is soft and steady. “Blink! We looked for you everywhere.”`,
      `“Grandma Glow!” Blink zips in a happy circle around her.`,
      `“Thank you, Maven,” says Grandma Glow. “And thank you, Ella and Sharky. Now, shall we wake the tree? It asks one riddle first. It always has.”`,
      `The leaves rustle. A deep, slow voice seems to come from everywhere at once.`
    ],
    riddle: {
      lines: [
        `Give me away, and you still have just as much of me.`,
        `I can jump from one candle to the next, and then both have me.`,
        `One puff of breath can end me.`,
        `What am I?`
      ],
      options: [
        { label: `A cookie`, hint: `Give a cookie away and you have less cookie. This thing does not get smaller when you share it. Try again!` },
        { label: `A secret`, hint: `Clever! When you share a secret, you still have it. But a secret cannot jump onto a candle. Try again!` },
        { label: `A flame`, correct: true },
        { label: `A balloon`, hint: `A puff of breath makes a balloon bigger. It does not end it. And if you give a balloon away, it is gone. Try again!` }
      ],
      after: [
        `You think of birthday candles. One candle can light the next, and the first one burns just as bright. And one puff blows them out.`,
        `“A flame!” you say.`,
        `“Just so,” says the deep voice. “Light is a thing you can give away and still keep.”`,
        `“It works for firefly light, too,” says Grandma Glow. “Watch.”`,
        `Blink touches his glowing tail to the nearest leaf. A light wakes up there. That light wakes two more. Then ten. A hundred. A thousand. Soon the whole tree shines like a golden lantern.`,
        `Grandma Glow lands on your thumb. “You brought our Blink home. Now we will take all of <i>you</i> home.”`
      ]
    },
    ask: `How would you like to go home?`,
    choices: [
      { label: `Float home on a dandelion puff`, to: `puff` },
      { label: `Ride home in a leaf boat`, to: `leaf` }
    ]
  },

  puff: {
    place: `High over the meadow`,
    text: [
      `Grandma Glow picks a dandelion puff as big as an umbrella. You tuck Ella and Sharky into your pajama top. Then you hold on to the stem with both hands.`,
      `A thousand fireflies blow all together. <i>Whoosh!</i> Up you go.`,
      `You float over the garden and the round door. You float over the water and the woods. Everything below looks small and soft, like a blanket with trees stitched on it.`,
      `Blink flies beside you. His light is strong now.`,
      `“I made up a riddle,” he says. “My first one ever! It took me the whole trip. Want to hear it?”`
    ],
    riddle: {
      lines: [
        `I spend all night in bed, but I never sleep.`,
        `I have a case, but I never go on a trip.`,
        `All day I do nothing. At night, I hold up just one part of you.`,
        `What am I?`
      ],
      options: [
        { label: `A suitcase`, hint: `A suitcase is a case. But it goes on lots of trips, and it does not spend the night in your bed. Try again!` },
        { label: `A mattress`, hint: `A mattress is in bed all night. But it holds up all of you, not just one part. Try again!` },
        { label: `A blanket`, hint: `A blanket stays in bed. But it lies on top of you. It does not hold up any part of you. Try again!` },
        { label: `A pillow`, correct: true }
      ],
      after: [
        `“A pillow!” you say. “It has a pillowcase!”`,
        `“You got it!” Blink does a happy loop in the air. “I was proud of the case part.”`,
        `“It was the best part,” you say.`,
        `“And look,” says Blink. “Yours is waiting for you.”`,
        `Down below, you can see your own house and your own window. The curtain is still open.`
      ]
    },
    choices: [{ label: `Float down to your window`, to: `home` }]
  },

  leaf: {
    place: `High over the meadow`,
    text: [
      `The fireflies lift a big curled leaf. You climb in with Ella and Sharky. It fits the three of you just right.`,
      `A thousand tiny lights carry you up. You sail over the garden and the round door. You sail over the water and the woods. The leaf rocks like a cradle. Ella’s ears flap a little in the wind.`,
      `Blink sits on your knee. His light is strong now.`,
      `“I made up a riddle,” he says. “My first one ever! It took me the whole trip. Want to hear it?”`
    ],
    riddle: {
      lines: [
        `I show you pictures, but I have no screen and no pages.`,
        `You make me yourself, but I can still surprise you.`,
        `You can only watch me with your eyes shut.`,
        `By breakfast, you may have forgotten me.`,
        `What am I?`
      ],
      options: [
        { label: `A book`, hint: `A book shows you pictures. But a book has pages, and you need your eyes open to read it. Try again!` },
        { label: `A drawing`, hint: `You make a drawing yourself. That part fits. But you cannot see your drawing with your eyes shut. Try again!` },
        { label: `A dream`, correct: true },
        { label: `A movie`, hint: `A movie shows you pictures. But a movie needs a screen, and you watch it with your eyes open. Try again!` }
      ],
      after: [
        `“A dream!” you say.`,
        `“You got it!” Blink does a happy loop in the air. “I was proud of the surprise part. You make your own dreams, but you never know what will happen next.”`,
        `“It was the best part,” you say.`,
        `“And look,” says Blink. “A good one is waiting for you.”`,
        `Down below, you can see your own house and your own window. The curtain is still open.`
      ]
    },
    choices: [{ label: `Glide down to your window`, to: `home` }]
  },

  home: {
    place: `Your bedroom`,
    text: [
      `The fireflies set you down by your window, as soft as a feather. Then they drift away, one by one, back toward the Lantern Tree.`,
      `You climb into bed with Ella on one side and Sharky on the other. The blanket is still warm.`,
      `Blink floats at the glass. He is shining as bright as a little star.`,
      `“One last riddle,” he whispers. “It is my favorite. Here is a hint. The answer is very, very close to you.”`
    ],
    riddle: {
      lines: [
        `You do me thousands of times a day, and you almost never notice.`,
        `I am over faster than you can say my name.`,
        `Each time, the whole world goes dark, but you do not miss a thing.`,
        `What am I?`
      ],
      options: [
        { label: `A breath`, hint: `You do breathe thousands of times a day without noticing. But the world does not go dark when you breathe. Try again!` },
        { label: `A heartbeat`, hint: `Your heart beats thousands of times a day. But the world does not go dark when it beats. Try again!` },
        { label: `A yawn`, hint: `Nobody yawns thousands of times a day. And a yawn is long and slow. Try again!` },
        { label: `A blink`, correct: true }
      ],
      after: [
        `You think. Then you look at the little firefly at your window, and you smile.`,
        `“A blink,” you say. “It is your name!”`,
        `“It is my name!” says Blink, and he glows his brightest yet.`,
        `Then you yawn. It is a big, slow one. Blink catches it and yawns too.`,
        `“Now do one more blink for me,” he whispers. “A very slow one. Close your eyes, and do not finish it until morning.”`,
        `“Good night, Blink.”`,
        `“Good night, Maven. Good night, Ella. Good night, Sharky. Thank you for bringing me home.”`,
        `His light drifts away over the grass. It gets smaller and smaller, until it looks like one more star.`,
        `You close your eyes. Your pillow is soft. Ella and Sharky are close. A good dream is waiting.`
      ]
    },
    ending: true,
    choices: [{ label: `Read it again a new way`, to: `start`, restart: true }]
  }
};
