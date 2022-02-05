import { EnhancedStore } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { forfeitWinMatch, matchWon, readyMatch, setAsConnected, waitingForTurn } from "../redux/reducers/game";
import { initMatch } from "../redux/thunks/init-match.thunk";
import { moveOpponentsPieceToTargetSquare } from "../redux/thunks/move-opponents-piece-to-target-square.thunk";

export const initServerEvents = (socket: Socket, store: EnhancedStore) => {
	socket.on("connect", () => {
		store.dispatch(setAsConnected());
	});
	socket.on("matchFound", (args) => {
		const thunkAction = initMatch({ isStartingFirst: args.isStartingFirst, playerColor: args.color }) as any;
		store.dispatch(thunkAction);
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
	socket.on("checkmated", (args) => {
		store.dispatch(matchWon());
	});
};
