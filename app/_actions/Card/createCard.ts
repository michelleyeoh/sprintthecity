"use server";

import { prisma } from "@/app/_lib/prisma";

export async function createCard(data: {
  description: string;
  location: string;
  columnId: string;
  notes?: string;
  dateToComplete?: Date;
}) {
  const cardCount = await prisma.card.count({
    where: { columnId: data.columnId },
  });

  const newCard = await prisma.card.create({
    data: {
      description: data.description,
      location: data.location,
      notes: data.notes,
      dateToComplete: data.dateToComplete,
      columnId: data.columnId,
      order: cardCount,
    },
  });

  return newCard;
}
