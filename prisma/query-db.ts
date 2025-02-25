import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        sessions: true,
      },
    });

    console.log('=== Users in Database ===');
    console.log(JSON.stringify(users, null, 2));
    console.log(`Total users: ${users.length}`);

    // Get user count by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    console.log('\n=== Users by Role ===');
    console.log(JSON.stringify(usersByRole, null, 2));

  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 