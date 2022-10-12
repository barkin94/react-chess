import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPieceLocationsForReducer } from "../helper-fns";
import { MoveResultForReducoer } from "../reducers/board";
import { AppThunkExtraArgs } from "../store";
import { showMatchEndModal } from "./show-match-end-modal.thunk";

export type ArgType = {
	pieceId: string;
	targetSquareId: string;
};

export const moveOpponentsPieceToTargetSquare = createAsyncThunk<MoveResultForReducoer, ArgType, { extra: AppThunkExtraArgs }>(
	"moveOpponentPiece",
	(args: ArgType, { extra, dispatch }) => {
		const { pieceLocations, events } = extra.movePiece.execute({
			pieceId: args.pieceId,
			targetSquareId: args.targetSquareId,
		});

		events.forEach(event =>
			event.type === "match-end" && dispatch(showMatchEndModal(event.winner))
		);

		return {
			pieceLocations: getPieceLocationsForReducer(pieceLocations),
			events,
		};
	}
);
