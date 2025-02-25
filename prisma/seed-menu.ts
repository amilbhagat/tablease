import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create categories
    const categories = [
      {
        name: 'Appetizers',
        description: 'Start your meal with these delicious options',
      },
      {
        name: 'Main Courses',
        description: 'Hearty and satisfying main dishes',
      },
      {
        name: 'Desserts',
        description: 'Sweet treats to finish your meal',
      },
      {
        name: 'Beverages',
        description: 'Refreshing drinks to complement your food',
      },
    ];

    for (const category of categories) {
      const existingCategory = await prisma.category.findFirst({
        where: { name: category.name },
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: category,
        });
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    // Get category IDs
    const appetizersCategory = await prisma.category.findFirst({
      where: { name: 'Appetizers' },
    });
    const mainCoursesCategory = await prisma.category.findFirst({
      where: { name: 'Main Courses' },
    });
    const dessertsCategory = await prisma.category.findFirst({
      where: { name: 'Desserts' },
    });
    const beveragesCategory = await prisma.category.findFirst({
      where: { name: 'Beverages' },
    });

    // Create menu items
    const menuItems = [
      // Appetizers
      {
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 5.99,
        categoryId: appetizersCategory?.id,
      },
      {
        name: 'Mozzarella Sticks',
        description: 'Breaded and fried mozzarella with marinara sauce',
        price: 7.99,
        categoryId: appetizersCategory?.id,
      },
      {
        name: 'Chicken Wings',
        description: 'Crispy wings with your choice of sauce',
        price: 9.99,
        categoryId: appetizersCategory?.id,
      },
      
      // Main Courses
      {
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and special sauce',
        price: 12.99,
        categoryId: mainCoursesCategory?.id,
      },
      {
        name: 'Margherita Pizza',
        description: 'Traditional pizza with tomato sauce, mozzarella, and basil',
        price: 14.99,
        categoryId: mainCoursesCategory?.id,
      },
      {
        name: 'Grilled Salmon',
        description: 'Fresh salmon fillet with lemon butter sauce',
        price: 18.99,
        categoryId: mainCoursesCategory?.id,
      },
      
      // Desserts
      {
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with ganache',
        price: 6.99,
        categoryId: dessertsCategory?.id,
      },
      {
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake',
        price: 7.99,
        categoryId: dessertsCategory?.id,
      },
      
      // Beverages
      {
        name: 'Soda',
        description: 'Assorted soft drinks',
        price: 2.99,
        categoryId: beveragesCategory?.id,
      },
      {
        name: 'Iced Tea',
        description: 'Freshly brewed iced tea',
        price: 3.49,
        categoryId: beveragesCategory?.id,
      },
      {
        name: 'Coffee',
        description: 'Freshly brewed coffee',
        price: 3.99,
        categoryId: beveragesCategory?.id,
      },
    ];

    for (const item of menuItems) {
      if (!item.categoryId) continue;
      
      const existingItem = await prisma.menuItem.findFirst({
        where: { 
          name: item.name,
          categoryId: item.categoryId
        },
      });

      if (!existingItem) {
        await prisma.menuItem.create({
          data: item,
        });
        console.log(`Created menu item: ${item.name}`);
      } else {
        console.log(`Menu item already exists: ${item.name}`);
      }
    }

    console.log('Menu seeding completed successfully');
  } catch (error) {
    console.error('Error seeding menu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 