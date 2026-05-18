import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Find or create a test user to attach the board to
  const user = await prisma.user.upsert({
    where: { email: 'michelle@example.com' },
    update: {},
    create: {
      email: 'michelle@example.com',
      name: 'Michelle',
    },
  });

  console.log(`👤 User verified: ${user.email}`);

  // 2. Create a default sprint board for this user
  const board = await prisma.board.create({
    data: {
      title: 'Sprint the City Board',
      userId: user.id,
    },
  });

  console.log(`📋 Board created: "${board.title}"`);

  // 3. Seed the 3 default columns with their layout order
  const defaultColumns = [
    { title: 'Just Discovered', order: 0 },
    { title: 'In Progress', order: 1 },
    { title: 'Explored', order: 2 },
  ];

  for (const col of defaultColumns) {
    const createdColumn = await prisma.column.create({
      data: {
        title: col.title,
        order: col.order,
        boardId: board.id,
      },
    });
    console.log(`  🧱 Column added: "${createdColumn.title}" (Order: ${createdColumn.order})`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });