'use server';

import { prisma } from "@/app/_lib/prisma";

export async function getSprintBoard(userId: string) {
  return await prisma.board.findFirst({
    where: { userId: userId },
    include: {
      columns: {
        orderBy: { order: 'asc' },
        include: {
          cards: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });
}