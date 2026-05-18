'use server';

import { prisma } from "@/app/_lib/prisma";

export async function updateCardDetails(cardId: string, updates: {
  description?: string;
  location?: string;
  notes?: string;
}) {
  return await prisma.card.update({
    where: { id: cardId },
    data: updates,
  });
}