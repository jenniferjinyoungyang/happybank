import 'dotenv/config';

// Ensure DATABASE_URL is set BEFORE importing PrismaClient
const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL or POSTGRES_PRISMA_URL environment variable is not set. Please check your .env file.',
  );
}

// Set DATABASE_URL explicitly - PrismaClient reads this from process.env
process.env.DATABASE_URL = databaseUrl;

// Wrap everything in async function to avoid top-level await TypeScript errors
async function main() {
  // Prisma 7 requires a driver adapter - use dynamic import to ensure DATABASE_URL is set
  const adapterPgModule = await import('@prisma/adapter-pg');
  const pgModule = await import('pg');
  const prismaModule = await import('@prisma/client');

  const { PrismaPg } = adapterPgModule;
  const { Pool } = pgModule;
  const { AuthType, PrismaClient } = prismaModule;

  // Create PostgreSQL adapter
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  // Create PrismaClient with adapter (required in Prisma 7)
  const prisma = new PrismaClient({ adapter });

  async function seed() {
    const barbie = await prisma.user.upsert({
      where: { email: 'barbie@happybank.io' },
      create: {
        id: 'cm0ll6qxq00003b6se4csrall',
        email: 'barbie@happybank.io',
        name: 'Barbie',
        createdAt: new Date('2024-06-17T06:00:00'),
        updatedAt: new Date('2024-07-17T06:00:00'),
        password: '$2a$10$Z/y1FlZtTMR.zZZnLeLGPOiIsVVR5oV14SW/vCgOK67kek.GnKKDS',
        authType: AuthType.CREDENTIALS,
      },
      update: {},
    });

    const bob = await prisma.user.upsert({
      where: { email: 'bob@happybank.io' },
      create: {
        id: 'cm7v7x3qs0000ya8wu3sh1tb9',
        email: 'bob@happybank.io',
        name: 'Bob Sang',
        createdAt: new Date('2025-03-05T01:07:19.732Z'),
        updatedAt: new Date('2025-03-05T01:07:19.732Z'),
        password: '$2b$10$GpaxCs8FwfKU/3uIACeeaeKBhzkTXaBDObP06Drr2StwjPeUOEFC6',
        authType: AuthType.CREDENTIALS,
      },
      update: {},
    });

    // Create memories individually (createMany doesn't support nested relations)

    const barbieMemory1 = await prisma.memory.create({
      data: {
        userId: 'cm0ll6qxq00003b6se4csrall',
        title: 'Moved into a new office!',
        message:
          'Our team finally moved into our brand new office located in the downtown. I am excited for this new start!',
        createdAt: new Date('2024-09-14'),
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'celebration' },
                create: { name: 'celebration' },
              },
            },
          },
        },
      },
    });

    // Barbie's memories from memories-data.json
    const barbieMemory2 = await prisma.memory.create({
      data: {
        userId: 'cm0ll6qxq00003b6se4csrall',
        title: 'saw Taffy',
        message: 'I met Taffy today',
        createdAt: new Date('2024-12-28T22:22:10.462Z'),
        imageId: 't-r-photography-TzjMd7i5WQI-unsplash_t0kgio',
      },
    });

    const barbieMemory3 = await prisma.memory.create({
      data: {
        userId: 'cm0ll6qxq00003b6se4csrall',
        title: 'saw Ginger',
        message: 'I saw Ginger play with toilet paper today',
        createdAt: new Date('2024-12-28T22:30:53.230Z'),
        imageId: 'daniel-maas-RR-FwGB6PEU-unsplash_vjron9',
      },
    });

    // Bob's memories from memories-data.json
    const bobMemory01 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Surprise Birthday Party',
        message:
          "Today, Sarah threw me a surprise birthday party, and I'm still grinning ear to ear. I honestly had no idea! I came home from work, and the house was filled with balloons and decorations. All our friends and family were there, and the kids were so excited to surprise me. Liam made me a card that said 'Happy Birthday, Dad! You're the best!', and Emily gave me the biggest hug ever. We had so much fun playing games, eating cake, and dancing to my favorite classic rock tunes. I'm so thankful for Sarah and the amazing people in our lives. This will be a birthday I'll never forget.",
        createdAt: new Date('2024-09-24T02:20:28.616Z'),
        imageId: 'bob_birthdayParty_dnkgun',
      },
    });

    const bobMemory02 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'A Perfect Summer Day',
        message:
          "Today was one of those perfect summer days that you wish could last forever. We packed up the bikes and rode down to High Park as a family. Liam was showing off his \"super-fast\" biking skills, while Emily insisted on riding in the little trailer behind my bike, giggling the whole way.\nWe had a picnic under a big oak tree—homemade sandwiches, watermelon slices, and, of course, Sarah's famous lemon bars. Afterward, we spotted a few turtles in the pond and let the kids chase butterflies in the meadow.\nTo top it all off, we stopped by our favorite ice cream shop on the way home. Liam got his classic chocolate cone, Emily went with bubblegum, and I indulged in maple walnut. Whiskers, of course, was waiting at the door when we got home, acting like we'd been gone for a week.\nHonestly, if every day could be like this, I'd have no complaints.",
        createdAt: new Date('2023-07-15T02:21:46.785Z'),
        imageId: 'bob_summerDay_vzezkx',
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'familyVacation' },
                create: { name: 'familyVacation' },
              },
            },
          },
        },
      },
    });

    const bobMemory03 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Family Pizza Night',
        message:
          "Friday night means one thing in our house: pizza night! We went all out tonight, making homemade pizzas from scratch. Liam took charge of spreading the sauce (with a little too much enthusiasm), and Emily insisted on adding an extra handful of cheese to every pizza.\nSarah and I tried to make a gourmet-style one with prosciutto and arugula, but somehow, we ended up loving Liam's classic pepperoni better. We ate on the couch while watching The Lion King for the hundredth time—Emily still gets sad when Mufasa dies, and Liam acts like he's too cool to care, but I caught him wiping his eyes.\nThe best part? Whiskers managed to steal a pepperoni slice when we weren't looking.",
        createdAt: new Date('2023-11-03T02:23:26.028Z'),
        imageId: 'bob_pizzaNight_yj2tkl',
      },
    });

    const bobMemory04 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: "Liam's First Soccer Goal",
        message:
          "Today was a huge milestone for Liam—he scored his very first goal in a soccer match! We've been watching him practice for weeks, but seeing him actually do it in a game was something special. The look on his face when the ball hit the back of the net was priceless—pure joy and disbelief. We all cheered so loudly, even Emily was jumping up and down. After the game, we took him out for ice cream to celebrate. He kept saying, 'I'm a soccer star, Dad!' And honestly, I couldn't agree more. Proud doesn't even begin to cover it.\"\nImage description: Liam kicking a soccer ball into the net during a match, with his teammates and parents cheering from the sidelines.",
        createdAt: new Date('2024-03-25T02:26:23.103Z'),
        imageId: 'bob_soccer_r5lurg',
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'activities' },
                create: { name: 'activities' },
              },
            },
          },
        },
      },
    });

    const bobMemory05 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: "Emily's First Time Ice Skating",
        message:
          "Today was a milestone for Emily—her first time on ice skates! We went to Nathan Phillips Square, and she was so excited… until she realized standing on ice is much harder than it looks.\nAt first, she clung to me like a koala, wobbling with every step, but after a few rounds (and a few falls), she got the hang of it. Liam, of course, zipped around like he'd been skating forever, showing off spins that weren't as graceful as he thought.\nWhen we finally sat down for hot cocoa, Emily looked up at me and whispered, \"Daddy, I did it!\" I don't think I've ever smiled bigger.",
        createdAt: new Date('2024-01-14T02:29:00.828Z'),
        imageId: 'bob_iceSkating_lwprsu',
      },
    });

    const bobMemory06 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Snowy Sledding Adventure',
        message:
          'Today was the perfect winter day—thick, fresh snow, blue skies, and just cold enough to keep things crisp without turning us into icicles. Naturally, we had only one choice: sledding!\nWe bundled up in about a hundred layers and headed to the big hill near our neighborhood. Liam immediately launched himself down the slope, shouting "Watch this!" as he tried to do a trick (which ended with him face-first in a snowbank). Emily, on the other hand, insisted on riding with me, giggling the whole way down as we zoomed past Sarah.\nWe had an epic snowball fight at the bottom, and at some point, Whiskers—who somehow followed us—got himself stuck in a tiny snowdrift. He was not amused.\nWe ended the day with steaming mugs of hot chocolate, extra marshmallows included. My legs are sore, my gloves are still drying, but my heart? Completely full.',
        createdAt: new Date('2025-02-10T02:30:49.463Z'),
        imageId: 'bob_sledding_s7bmjj',
        hashtagRelations: {
          create: [
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'familyVacation' },
                  create: { name: 'familyVacation' },
                },
              },
            },
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'activities' },
                  create: { name: 'activities' },
                },
              },
            },
          ],
        },
      },
    });

    const bobMemory07 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Christmas Magic',
        message:
          'Christmas morning chaos! The kids were up before the sun, jumping on our bed, demanding to open presents. Liam was thrilled with his new LEGO spaceship, and Emily couldn\'t stop hugging her stuffed unicorn.\nWe spent the day in comfy pajamas, sipping hot chocolate, playing board games, and listening to classic rock Christmas tunes (because, according to me, Paul McCartney\'s "Wonderful Christmastime" is a must). Sarah made the best turkey dinner, and we ended the night by watching Home Alone—Liam is convinced he could set up better traps than Kevin.',
        createdAt: new Date('2024-12-26T02:27:57.315Z'),
        imageId: 'bob_christmas_c1xbpd',
      },
    });

    const bobMemory08 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Sunset over Humber Bay',
        message:
          'A perfect solo ride along the waterfront. The humidity finally broke. Stopped on the Humber Bay Arch Bridge as the sun dipped. The downtown Toronto skyline looked magnificent against the purple and orange light. Just me, my bike, and the city. Pure peace.',
        createdAt: new Date('2025-08-15T22:10:00.000Z'),
        imageId: 'bob_waterfront_bike_lzinuv',
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'activities' },
                create: { name: 'activities' },
              },
            },
          },
        },
      },
    });

    const bobMemory09 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'The Office Supervisor',
        message:
          "Some days are just perfect. Deep work in the afternoon on a tough deployment. Whiskers usually supervises from his tower, but today he decided my shoulder was the best spot. He just purred while I debugged for two hours straight. Best co-worker I've ever had.",
        createdAt: new Date('2025-10-02T19:30:00.000Z'),
        imageId: 'bob_whiskers_office_jop2rs',
        hashtagRelations: {
          create: [
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'pets' },
                  create: { name: 'pets' },
                },
              },
            },
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'activities' },
                  create: { name: 'activities' },
                },
              },
            },
          ],
        },
      },
    });

    const bobMemory10 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: "Liam's First Checkmate",
        message:
          "A landmark day! Liam has been studying tactics so hard. Today, using the openings I taught him, he finally set up a beautiful sequence and trapped my King. His face just lit up when he said 'Checkmate, Dad!'. My pride as a teacher is overwhelming. Time to raise his difficulty!",
        createdAt: new Date('2025-11-20T16:00:00.000Z'),
        imageId: 'bob_liam_chess_s98q4d',
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'family' },
                create: { name: 'family' },
              },
            },
          },
        },
      },
    });

    const bobMemory11 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Nightmare in the Kitchen',
        message:
          " Disaster struck! I was attempting that complicated sous-vide recipe for the dinner party. Everything was going smoothly until I realized I left the oven on self-clean mode with a roast inside. The smoke alarm started blaring, and I had to evacuate the kitchen. Sarah wasn't thrilled, but hey, at least we ordered pizza. Lesson learned: read recipes thoroughly.",
        createdAt: new Date('2026-01-10T01:05:00.000Z'),
        imageId: 'bob_kitchen_disaster_qlszfn',
      },
    });

    const bobMemory12 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Smoky Rib Triumph',
        message:
          'The annual neighborhood cookout was a massive success. The weather held up perfectly. I pulled off my best batch of ribs yet—they absolutely fell off the bone. I loved seeing everyone enjoying my food. My secret glaze is a secret no more!',
        createdAt: new Date('2026-07-10T18:45:00.000Z'),
        imageId: 'bob_bbq_grill_aptwo2',
        hashtagRelations: {
          create: [
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'activities' },
                  create: { name: 'activities' },
                },
              },
            },
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'food' },
                  create: { name: 'food' },
                },
              },
            },
          ],
        },
      },
    });

    const bobMemory13 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Indie Pop & Dance Battles',
        message:
          "Sarah initiated a family music night on Friday. We blasted some great new indie-pop, and the living room turned into an absolute dance floor. Watching Liam and Emily compete in dance-offs with Whiskers judging from a distance was pure chaos. I can't stop smiling when I think of their laughs.",
        createdAt: new Date('2026-02-10T21:00:00.000Z'),
        imageId: 'bob_family_dance_die8o0',
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'family' },
                create: { name: 'family' },
              },
            },
          },
        },
      },
    });

    const bobMemory14 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Final Code Deployment Success',
        message:
          "A moment of intense professional happiness. The massive re-architecture project I've been leading was deployed today. I watched the final deployment logs turn green across all our dashboards. The relief is immense. So proud of my team. Celebrating with pizza tonight!",
        createdAt: new Date('2026-03-20T17:15:00.000Z'),
        imageId: 'bob_code_deployment_xadjal',
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'work' },
                create: { name: 'work' },
              },
            },
          },
        },
      },
    });

    const bobMemory15 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Sushi Date in Downtown',
        message:
          "Finally, a rare date night alone with Sarah! We took the TTC to that new place near the St. Lawrence Market. The atmosphere was incredible, the sushi was divine (especially the unagi!), and it was just so wonderful to talk and laugh without hearing 'Dad, can I...'. I love her more than words.",
        createdAt: new Date('2026-04-05T20:30:00.000Z'),
        imageId: 'bob_sarah_date_olkozu',
        hashtagRelations: {
          create: [
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'coupleTime' },
                  create: { name: 'coupleTime' },
                },
              },
            },
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'food' },
                  create: { name: 'food' },
                },
              },
            },
          ],
        },
      },
    });

    const bobMemory16 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: "Emily's Piggyback Adventure",
        message:
          'A simple memory, but it filled me with joy. Walking back through the neighborhood on a beautiful evening after ice cream. Emily insisted I carry her. Watching her little smile in the reflection as we passed shop windows—just pure, innocent happiness.',
        createdAt: new Date('2026-05-12T19:00:00.000Z'),
        imageId: 'bob_emily_piggyback_imvnwl',
        hashtagRelations: {
          create: [
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'family' },
                  create: { name: 'family' },
                },
              },
            },
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'activities' },
                  create: { name: 'activities' },
                },
              },
            },
          ],
        },
      },
    });

    const bobMemory17 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Toronto Island Family Dusk',
        message:
          'A stunning finish to a great family day. We took the ferry over to Toronto Island and spent the whole day exploring. We watched dusk fall over the downtown skyline from the shore. Standing together as a family, pointing out landmarks, the entire city lit up across the water. A perfect, quiet family moment.',
        createdAt: new Date('2026-06-30T21:15:00.000Z'),
        imageId: 'bob_toronto_island_zo0uck',
        hashtagRelations: {
          create: [
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'family' },
                  create: { name: 'family' },
                },
              },
            },
            {
              hashtag: {
                connectOrCreate: {
                  where: { name: 'activities' },
                  create: { name: 'activities' },
                },
              },
            },
          ],
        },
      },
    });

    const bobMemory18 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'First Apartment Kitchen Surprise',
        message:
          "Found this entry from my diary 11 years ago. A surprise visit from Sarah's parents! They came to see our very first apartment after we moved in. I was a nervous wreck showing them around the tiny kitchen, but they were so proud of us. It wasn't fancy, but it was ours, and their encouragement meant the world. We celebrated with cheap wine and takeout on the floor.",
        createdAt: new Date('2026-07-10T18:00:00.000Z'),
        imageId: 'bob_first_apartment_voofza',
        hashtagRelations: {
          create: {
            hashtag: {
              connectOrCreate: {
                where: { name: 'family' },
                create: { name: 'family' },
              },
            },
          },
        },
      },
    });

    console.log('seeding : ', {
      barbie,
      bob,
      memories: [
        barbieMemory1,
        barbieMemory2,
        barbieMemory3,
        bobMemory01,
        bobMemory02,
        bobMemory03,
        bobMemory04,
        bobMemory05,
        bobMemory06,
        bobMemory07,
        bobMemory08,
        bobMemory09,
        bobMemory10,
        bobMemory11,
        bobMemory12,
        bobMemory13,
        bobMemory14,
        bobMemory15,
        bobMemory16,
        bobMemory17,
        bobMemory18,
      ],
    });
  }

  await seed();

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
