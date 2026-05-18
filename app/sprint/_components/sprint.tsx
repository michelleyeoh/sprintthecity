// This code is borrowed from Alex Reardon's Pragmatic board example: src/app/two-columns/page.tsx

import { TBoard } from "./data";
import { Board } from "./board";
import mockData from "../../_data/mock-board.json";

function getData(): TBoard {
  return mockData as TBoard;
}

export default function SprintBoard() {
  return (
    <div className="h-full md:flex md:flex-row md:justify-center">
      <Board initial={getData()} />
    </div>
  );
}
