"use server";

import { prisma } from "@/app/_lib/prisma";

export async function deleteCard(cardId: string) {
  const deletedCard = await prisma.card.delete({
    where: { id: cardId },
  });

  return deletedCard;
}
