import { PrismaClient, accountType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedData() {
  try {
    const account1 = await prisma.account.create({
      data: {
        accountNumber: 1,
        type: accountType.SAVINGS,
        name: 'John Doe',
        balance: 1000,
      },
    });

    const account2 = await prisma.account.create({
      data: {
        accountNumber: 2,
        type: accountType.CHECKING,
        name: 'Jane Doe',
        balance: 2000,
      },
    });

    const account3 = await prisma.account.create({
      data: {
        accountNumber: 3,
        type: accountType.CREDIT,
        creditLimit: 350,
        name: 'John Smith',
        balance: 0,
      },
    });

    const account4 = await prisma.account.create({
      data: {
        accountNumber: 4,
        type: accountType.SAVINGS,
        name: 'Jane Smith',
        balance: 4000,
      },
    });

    const account5 = await prisma.account.create({
      data: {
        accountNumber: 5,
        type: accountType.CHECKING,
        name: 'John Doe',
        balance: 5000,
      },
    });

    console.log(
      'Seed data created successfully:',
      account1,
      account2,
      account3,
      account4,
      account5
    );
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
