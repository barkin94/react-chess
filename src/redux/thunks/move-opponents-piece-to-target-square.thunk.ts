import { createAsyncThunk } from "@reduxjs/toolkit";
import { MoveResult, PieceLocations } from "../reducers/board";
import { AppThunkExtraArgs } from "../store";

export type ArgType = {
	pieceId: string;
	targetSquareId: string;
};
export const moveOpponentsPieceToTargetSquare = createAsyncThunk<MoveResult, ArgType, { extra: AppThunkExtraArgs }>(
	"moveOpponentPiece",
	(args: ArgType, options) => {
		const { killedPiece, pieceLocations, matchResult } = options.extra.movePiece.execute({
			pieceId: args.pieceId,
			targetSquareId: args.targetSquareId,
		});

		const pieceLocationsForReducer: PieceLocations = {};
		pieceLocations.forEach((piece, square) => (pieceLocationsForReducer[square.id] = piece.id));

		return {
			killedPieceId: killedPiece?.id,
			pieceLocations: pieceLocationsForReducer,
			matchResult,
		};
	}
);
