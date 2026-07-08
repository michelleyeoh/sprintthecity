"use server";

import { moveCard } from "@/app/_actions/Card/moveCard";

type TCardOrderUpdate = {
  columnId: string;
  cardIds: string[];
};

export async function updateCardOrders(columns: TCardOrderUpdate[]) {
  await Promise.all(
    columns.flatMap(({ columnId, cardIds }) =>
      cardIds.map((cardId, order) => moveCard(cardId, columnId, order)),
    ),
  );
}