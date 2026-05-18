"use server";

import { prisma } from "@/app/_lib/prisma";

export async function moveCard(
  cardId: string,
  targetColumnId: string,
  newOrder: number,
) {
  return await prisma.card.update({
    where: { id: cardId },
    data: {
      columnId: targetColumnId,
      order: newOrder,
    },
  });
}
