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
    const bobMemory1 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Surprise Birthday Party',
        message:
          "Today, Sarah threw me a surprise birthday party, and I'm still grinning ear to ear. I honestly had no idea! I came home from work, and the house was filled with balloons and decorations. All our friends and family were there, and the kids were so excited to surprise me. Liam made me a card that said 'Happy Birthday, Dad! You're the best!', and Emily gave me the biggest hug ever. We had so much fun playing games, eating cake, and dancing to my favorite classic rock tunes. I'm so thankful for Sarah and the amazing people in our lives. This will be a birthday I'll never forget.",
        createdAt: new Date('2024-09-24T02:20:28.616Z'),
        imageId: 'bob_birthdayParty_dnkgun',
      },
    });

    const bobMemory2 = await prisma.memory.create({
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

    const bobMemory3 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Family Pizza Night',
        message:
          "Friday night means one thing in our house: pizza night! We went all out tonight, making homemade pizzas from scratch. Liam took charge of spreading the sauce (with a little too much enthusiasm), and Emily insisted on adding an extra handful of cheese to every pizza.\nSarah and I tried to make a gourmet-style one with prosciutto and arugula, but somehow, we ended up loving Liam's classic pepperoni better. We ate on the couch while watching The Lion King for the hundredth time—Emily still gets sad when Mufasa dies, and Liam acts like he's too cool to care, but I caught him wiping his eyes.\nThe best part? Whiskers managed to steal a pepperoni slice when we weren't looking.",
        createdAt: new Date('2023-11-03T02:23:26.028Z'),
        imageId: 'bob_pizzaNight_yj2tkl',
      },
    });

    const bobMemory4 = await prisma.memory.create({
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

    const bobMemory5 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: "Emily's First Time Ice Skating",
        message:
          "Today was a milestone for Emily—her first time on ice skates! We went to Nathan Phillips Square, and she was so excited… until she realized standing on ice is much harder than it looks.\nAt first, she clung to me like a koala, wobbling with every step, but after a few rounds (and a few falls), she got the hang of it. Liam, of course, zipped around like he'd been skating forever, showing off spins that weren't as graceful as he thought.\nWhen we finally sat down for hot cocoa, Emily looked up at me and whispered, \"Daddy, I did it!\" I don't think I've ever smiled bigger.",
        createdAt: new Date('2024-01-14T02:29:00.828Z'),
        imageId: 'bob_iceSkating_lwprsu',
      },
    });

    const bobMemory6 = await prisma.memory.create({
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

    const bobMemory7 = await prisma.memory.create({
      data: {
        userId: 'cm7v7x3qs0000ya8wu3sh1tb9',
        title: 'Christmas Magic',
        message:
          'Christmas morning chaos! The kids were up before the sun, jumping on our bed, demanding to open presents. Liam was thrilled with his new LEGO spaceship, and Emily couldn\'t stop hugging her stuffed unicorn.\nWe spent the day in comfy pajamas, sipping hot chocolate, playing board games, and listening to classic rock Christmas tunes (because, according to me, Paul McCartney\'s "Wonderful Christmastime" is a must). Sarah made the best turkey dinner, and we ended the night by watching Home Alone—Liam is convinced he could set up better traps than Kevin.',
        createdAt: new Date('2024-12-26T02:27:57.315Z'),
        imageId: 'bob_christmas_c1xbpd',
      },
    });

    console.log('seeding : ', {
      barbie,
      bob,
      memories: [
        barbieMemory1,
        barbieMemory2,
        barbieMemory3,
        bobMemory1,
        bobMemory2,
        bobMemory3,
        bobMemory4,
        bobMemory5,
        bobMemory6,
        bobMemory7,
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
