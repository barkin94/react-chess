import { EnhancedStore } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { OPPONENT_LEFT_MATCH } from "../redux/modal-component-names";
import { openModal } from "../redux/reducers/modal";
import { moveOpponentsPieceToTargetSquare } from "../redux/thunks/move-opponents-piece-to-target-square.thunk";
import { searchMatch } from "../redux/thunks/search-match.thunk";

export const initServerEventHandlers = (socket: Socket, store: EnhancedStore) => {
	socket.on("connect", () => {
		store.dispatch(searchMatch() as any);
	});

	socket.on("forfeit-win", (args) => {
		store.dispatch(openModal({ componentName: OPPONENT_LEFT_MATCH}));
	});

	socket.on("move", (args) => {
		const thunkAction = moveOpponentsPieceToTargetSquare({
			pieceId: args.pieceId,
			targetSquareId: args.targetSquareId,
		}) as any;

		store.dispatch(thunkAction);
	});
};
