// This code is borrowed from Alex Reardon's Pragmatic board example: src/app/two-columns/page.tsx

import { TBoard } from "./data";
import { Board } from "./board";
import { getSprintBoard } from "@/app/_actions/Board/getBoard";
import { getFirstUserId } from "@/app/_actions/User/getUser";

export default async function SprintBoard() {
  const userId = await getFirstUserId();
  const dbBoard = await getSprintBoard(userId);

  if (!dbBoard) {
    throw new Error("No sprint board found in the database.");
  }

  const formattedBoard: TBoard = {
    columns: dbBoard.columns.map((col) => ({
      id: col.id,
      title: col.title,
      cards: col.cards.map((card) => ({
        id: card.id,
        description: card.description,
        location: card.location,
        notes: card.notes || "",
        dateToComplete: card.dateToComplete ? card.dateToComplete.toISOString() : undefined,
      })),
    })),
  };

  return (
    <div className="h-full md:flex md:flex-row md:justify-center">
      <Board initial={formattedBoard} />
    </div>
  );
}
