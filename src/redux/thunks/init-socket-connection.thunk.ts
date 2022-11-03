import { OPPONENT_LEFT_MATCH } from "../modal-component-names";
import { openModal } from "../reducers/modal";
import { appCreateAsyncThunk } from "../store";
import { moveOpponentsPieceToTargetSquare } from "./move-opponents-piece-to-target-square.thunk";

export const initSocketConnection = appCreateAsyncThunk<void, void>("initSocketConnection", async (args, { dispatch, extra }) => {
	const socket = await extra.initSocket();

	socket.on("forfeit-win", (args) => {
		dispatch(openModal({ componentName: OPPONENT_LEFT_MATCH }));
	});

	socket.on<any>("move", (args) => {
		const thunkAction = moveOpponentsPieceToTargetSquare({
			pieceId: args.pieceId,
			targetSquareId: args.targetSquareId,
		});

		dispatch(thunkAction);
	});
});
