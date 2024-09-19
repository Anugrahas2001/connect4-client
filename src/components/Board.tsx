import React from "react";

type BoardProps = {
  board: (string | null)[][];
  makeMove: (columnIndex: number) => void;
};

const Board = ({ board, makeMove }: BoardProps) => {
  
  const handleColumnIndex = (columnIndex: number) => {
    console.log(columnIndex,"index");
    makeMove(columnIndex);
  };

  return (
    <div className="bg-blue-900 shadow grid grid-rows-6 p-3 rounded-md mb-4">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-2 space-y-1">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`w-16 h-16 rounded-full flex justify-center items-center cursor-pointer shadow-md shadow-blue-500 ${
                cell === "red"
                  ? "bg-red-500"
                  : cell === "yellow"
                  ? "bg-yellow-400"
                  : "bg-white"
              }`}
              onClick={() => handleColumnIndex(cellIndex)}
            >
              {cell ? (
                <div
                  className={`w-14 h-14 rounded-full ${
                    cell === "red" ? "bg-red-500" : "bg-yellow-400"
                  }`}
                />
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
