import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Board from "./components/Board";
import Confetti from "react-confetti";

type cell = null | string;
type Board = cell[][];

function App() {
  const [board, setBoard] = useState<Board>(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<string>("red");
  const [myColor, setMyColor] = useState<string>({} as string);
  const [winner, setWinner] = useState<null | string>(null);
  const [opponentFound, setOpponentFound] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [searchingForOpponent, setSearchingForOpponent] =
    useState<boolean>(false);
  const [dimension, setDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });

    const newSocket: Socket = io("https://connect4-server.onrender.com", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("playerColor", ({ color }) => {
      console.log(color, "player color");
      setMyColor(color);
    });

    newSocket.on("opponentJoined", () => {
      setOpponentFound(true);
      setGameStarted(true);
      setSearchingForOpponent(false);
    });

    newSocket.on("gameOver", ({ winner }) => {
      setWinner(winner);
      setGameOver(true);
    });

    newSocket.on("updatedBoard", ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const makeMove = (column: number) => {
    if (socket && myColor === currentPlayer) {
      socket.emit("makeMove", { column });
    }
  };

  const joinGame = () => {
    if (socket) {
      setSearchingForOpponent(true);
      socket.emit("joinGame");
    }
  };

  const newGameHandler = () => {
    if (socket) {
      socket.emit("newGame");

      setBoard(
        Array(6)
          .fill(null)
          .map(() => Array(7).fill(null))
      );
      setCurrentPlayer("red");
      setWinner(null);
      setGameOver(false);
      setOpponentFound(true);
      setSearchingForOpponent(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center min-h-screen">
      <div className="text-2xl font-semibold mb-4">Connect 4 Multiplayer</div>
      {!gameStarted ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold"
          onClick={joinGame}
        >
          {opponentFound
            ? "found"
            : searchingForOpponent
            ? "Searching for Opponent"
            : "Join Game"}
        </button>
      ) : null}
      {!gameStarted ? (
        <div className="px-14 mt-7 lg:mt-7 lg:px-14 md:px-14 sm:px-8 xs:px-6">
          <h1 className="text-xl font-semibold">Instruction:-</h1>
          <p className="text-lg py-4 font-sans lg:text-lg md:text-lg sm:text-sm xs:text-sm lg:py-4 md:py-4 sm:py-2 xs:py-2">
            Each turn, a player places a red or yellow disc into a column, and
            it will fall to the lowest available spot. The first player to
            connect 4 discs of the same color in a row horizontally, vertically,
            or diagonally wins.
          </p>
        </div>
      ) : null}

      {gameStarted && myColor && !winner && (
        <div className="text-xl font-semibold mb-4">
          You are playing as{" "}
          <span className={`text-${myColor === "red" ? "red" : "yellow"}-500`}>
            {myColor}
          </span>
        </div>
      )}

      {winner && (
        <div className="text-2xl font-semibold rounded mb-4 text-green-600">
          {winner} wins!
        </div>
      )}

      {gameStarted && !winner && !gameOver ? (
        <div className="flex space-x-7 mb-5">
          <div
            className={`text-2xl font-semibold rounded px-6 py-2 ${
              currentPlayer === "red"
                ? "shadow-red-600 shadow-lg transition-all duration-300"
                : ""
            }}`}
          >
            <span className="text-red-600">Red</span>
          </div>
          <div
            className={`text-2xl font-semibold rounded px-6 py-2 ${
              currentPlayer === "yellow"
                ? "shadow-yellow-600 shadow-lg transition-all duration-300"
                : ""
            }}`}
          >
            <span className="text-yellow-400">Yellow</span>
          </div>
        </div>
      ) : null}
      {gameStarted && <Board board={board} makeMove={makeMove} />}

      {gameOver && (
        <button
          className="bg-green-500 hover:bg-green-700 rounded-md text-white font-semibold px-6 py-2"
          onClick={newGameHandler}
        >
          New Game
        </button>
      )}
      {winner && (
        <Confetti
          width={dimension.width}
          height={dimension.height}
          numberOfPieces={1000}
          recycle={false}
          gravity={0.1}
        />
      )}
    </div>
  );
}

export default App;
