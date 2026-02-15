import { AuthType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  // Create memories individually (createMany doesn't support nested relations)
  const memory1 = await prisma.memory.create({
    data: {
      userId: 'cm0ll6qxq00003b6se4csrall',
      title: 'test post',
      message: 'test message',
      createdAt: new Date('2024-07-27'),
      hashtagRelations: {
        create: {
          hashtag: {
            connectOrCreate: {
              where: { name: 'test' },
              create: { name: 'test' },
            },
          },
        },
      },
    },
  });

  const memory2 = await prisma.memory.create({
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

  console.log('seeding : ', { barbie, memories: [memory1, memory2] });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
