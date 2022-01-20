import { EnhancedStore } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { getBoardData, initBoardData } from "../domain/domain";
import { setPieces } from "../redux/reducers/board";
import { forfeitWinMatch, readyMatch, setAsConnected, waitingForTurn } from "../redux/reducers/game";
import { moveOpponentsPieceToTargetSquare } from "../redux/thunks/move-opponents-piece-to-target-square.thunk";

export const initServerEvents = (socket: Socket, store: EnhancedStore) => {
	socket.on("connect", () => {
		store.dispatch(setAsConnected());
	});
	socket.on("matchFound", (args) => {
		const board = initBoardData(args.color, args.isStartingFirst);
		const startingData = board.getStartingData();
		store.dispatch(readyMatch(startingData));
		store.dispatch(setPieces(startingData.pieceLocations));
	});
	socket.on("forfeit-win", (args) => {
		store.dispatch(forfeitWinMatch());
	});
	socket.on("move", (args) => {
		const thunkAction = moveOpponentsPieceToTargetSquare({
			pieceId: args.pieceId,
			targetSquareId: args.targetSquareId,
		}) as any;

		store.dispatch(thunkAction);
	});
};
