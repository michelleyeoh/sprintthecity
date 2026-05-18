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

  // 3. Define the columns alongside their default cards
  const columnsWithCards = [
    {
      title: 'Just Discovered',
      order: 0,
      cards: [
        { description: 'Card 0', location: 'San Francisco', order: 0 },
        { description: 'Card 1', location: 'Seattle', order: 1 },
      ],
    },
    {
      title: 'In Progress',
      order: 1,
      cards: [
        { description: 'Card 2', location: 'New York City', order: 0 },
      ],
    },
    {
      title: 'Explored',
      order: 2,
      cards: [
        { description: 'Card 3', location: 'Davis', order: 0 },
      ],
    },
  ];

  // 4. Create each column and its nested cards in order
  for (const col of columnsWithCards) {
    const createdColumn = await prisma.column.create({
      data: {
        title: col.title,
        order: col.order,
        boardId: board.id,
      },
    });
    console.log(`  🧱 Column added: "${createdColumn.title}" (Order: ${createdColumn.order})`);

    // Add the cards for this specific column
    for (const card of col.cards) {
      const createdCard = await prisma.card.create({
        data: {
          description: card.description,
          location: card.location,
          order: card.order,
          columnId: createdColumn.id,
          notes: `Sample note for ${card.description}`,
        },
      });
      console.log(`🃏 Card created: "${createdCard.description}" at ${createdCard.location}`);
    }
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