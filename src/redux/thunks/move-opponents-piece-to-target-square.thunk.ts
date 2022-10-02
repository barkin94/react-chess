import { createAsyncThunk } from "@reduxjs/toolkit";
import { MoveResult, PieceLocations } from "../reducers/board";
import { AppThunkExtraArgs } from "../store";
import { showMatchEndModal } from "./show-match-end-modal.thunk";

export type ArgType = {
	pieceId: string;
	targetSquareId: string;
};
export const moveOpponentsPieceToTargetSquare = createAsyncThunk<MoveResult, ArgType, { extra: AppThunkExtraArgs }>(
	"moveOpponentPiece",
	(args: ArgType, { extra, dispatch }) => {
		const { capturedPiece, pieceLocations, matchResult } = extra.movePiece.execute({
			pieceId: args.pieceId,
			targetSquareId: args.targetSquareId,
		});

		const pieceLocationsForReducer: PieceLocations = {};
		pieceLocations.forEach((piece, square) => (pieceLocationsForReducer[square.id] = piece.id));

		if (matchResult)
			dispatch(showMatchEndModal());

		return {
			capturedPieceId: capturedPiece?.id,
			pieceLocations: pieceLocationsForReducer,
			matchResult,
		};
	}
);
