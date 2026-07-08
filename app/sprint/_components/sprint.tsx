// This code is borrowed from Alex Reardon's Pragmatic board example: src/app/two-columns/page.tsx

import { TBoard } from "./data";
import { Board } from "./board";
import { getSprintBoard } from "@/app/_actions/Board/getBoard";
import { getFirstUserId } from "@/app/_actions/User/getUser";

export default async function SprintBoard() {
  let formattedBoard: TBoard | null = null;
  let shouldShowFallback = false;

  try {
    const userId = await getFirstUserId();
    const dbBoard = await getSprintBoard(userId);

    if (!dbBoard) {
      shouldShowFallback = true;
    } else {
      formattedBoard = {
        columns: dbBoard.columns.map((col) => ({
          id: col.id,
          title: col.title,
          cards: col.cards.map((card) => ({
            id: card.id,
            description: card.description,
            location: card.location,
            notes: card.notes || "",
            dateToComplete: card.dateToComplete
              ? card.dateToComplete.toISOString()
              : undefined,
          })),
        })),
      };
    }
  } catch {
    shouldShowFallback = true;
  }

  if (shouldShowFallback || !formattedBoard) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="max-w-md rounded-2xl border border-neutral-200 p-8 text-sm leading-6 text-[#292A2E] text-neutral-600">
          🚧 Under Construction 🚧
        </p>
      </div>
    );
  }

  return (
    <div className="h-full md:flex md:flex-row md:justify-center">
      <Board initial={formattedBoard} />
    </div>
  );
}
