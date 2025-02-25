import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@restaurant.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@restaurant.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
    });
    console.log('Created admin user:', admin.email);

    // Create manager user
    const managerPassword = await hash('manager123', 10);
    const manager = await prisma.user.upsert({
      where: { email: 'manager@restaurant.com' },
      update: {},
      create: {
        name: 'Manager User',
        email: 'manager@restaurant.com',
        password: managerPassword,
        role: UserRole.MANAGER,
      },
    });
    console.log('Created manager user:', manager.email);

    // Create staff user
    const staffPassword = await hash('staff123', 10);
    const staff = await prisma.user.upsert({
      where: { email: 'staff@restaurant.com' },
      update: {},
      create: {
        name: 'Staff User',
        email: 'staff@restaurant.com',
        password: staffPassword,
        role: UserRole.STAFF,
      },
    });
    console.log('Created staff user:', staff.email);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
