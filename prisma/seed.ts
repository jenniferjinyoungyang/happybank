import { PrismaClient } from '@prisma/client';

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
    },
    update: {},
  });

  const barbieSavings = await prisma.saving.createMany({
    data: [
      {
        userId: 'cm0ll6qxq00003b6se4csrall',
        title: 'test post',
        message: 'test message',
        createdAt: new Date('2024-07-27'),
        hashTags: 'test',
      },
      {
        userId: 'cm0ll6qxq00003b6se4csrall',
        title: 'test post 2',
        message: 'test message 2',
        createdAt: new Date('2024-07-28'),
        hashTags: 'test',
      },
    ],
  });

  console.log('seeding : ', { barbie, barbieSavings });
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
