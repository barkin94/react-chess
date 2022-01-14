import { io, Socket } from "socket.io-client";
import { getBoardData, initBoardData } from "./business/business";
import { setPieces } from "./redux/reducers/board-state";
import { forfeitWinMatch, readyMatch, setAsConnected, waitingForTurn } from "./redux/reducers/game-state";
import { store } from "./redux/store";

let connection: Socket;
export const initSocketIoConnection = () => {
	connection = io("localhost:3001");

	connection.on("connect", () => {
		store.dispatch(setAsConnected());
	});

	connection.on("matchFound", (args) => {
		const board = initBoardData(args.color, args.isStartingFirst);
		const startingData = board.getStartingData();
		store.dispatch(readyMatch(startingData));
		store.dispatch(setPieces(startingData.pieceLocations));
	});

	connection.on("forfeit-win", (args) => {
		store.dispatch(forfeitWinMatch());
	});

	connection.on("move", (args) => {
		const board = getBoardData();
		board.movePiece(args.pieceId, args.targetSquareId);
		store.dispatch(setPieces(board.getPieceLocations()));
		store.dispatch(waitingForTurn(false));
	});
};

export const getSocketIoConnection = () => connection;
