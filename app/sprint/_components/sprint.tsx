// This code is borrowed from Alex Reardon's Pragmatic board example: src/app/two-columns/page.tsx

import { TBoard, TCard, TColumn } from "./data";
import { Board } from "./board";

function getInitialData(): TBoard {
  // Doing this so we get consistent ids on server and client
  const getCards = (() => {
    let count: number = 0;

    return function getCards({ amount }: { amount: number }): TCard[] {
      return Array.from({ length: amount }, (): TCard => {
        const id = count++;
        return {
          id: `card:${id}`,
          description: `Card ${id}`,
        };
      });
    };
  })();

  const columns: TColumn[] = [
    { id: "column:a", title: "Saved", cards: getCards({ amount: 10 }) },
    { id: "column:b", title: "In Progress", cards: getCards({ amount: 10 }) },
    { id: "column:c", title: "Explored", cards: getCards({ amount: 10 }) },
  ];

  return {
    columns,
  };
}

export default function Page() {
  return (
    <div className="h-full md:flex md:flex-row md:justify-center">
      <Board initial={getInitialData()} />
    </div>
  );
}
