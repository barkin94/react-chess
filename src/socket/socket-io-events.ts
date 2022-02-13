import { EnhancedStore } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { forfeitWinMatch, searchMatch } from "../redux/reducers/game";
import { moveOpponentsPieceToTargetSquare } from "../redux/thunks/move-opponents-piece-to-target-square.thunk";

export const initServerEventHandlers = (socket: Socket, store: EnhancedStore) => {
	socket.on("connect", () => {
		store.dispatch(searchMatch());
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
