'use server';

import { prisma } from "@/app/_lib/prisma";

export async function getFirstUserId(): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { email: 'michelle@example.com' },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Mock user not found. Did you run your seed script?");
  }

  return user.id;
}