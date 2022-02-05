import { createAsyncThunk } from "@reduxjs/toolkit";
import { MoveOpponentPiece } from "../../domain/use-cases/move-opponent-piece";
import { getSocket } from "../../socket/socket-io";
import { MoveResult, PieceLocations } from "../reducers/board";
import { AppThunkExtraArgs } from "../store";

export type ArgType = {
	pieceId: string;
	targetSquareId: string;
};
export const moveOpponentsPieceToTargetSquare = createAsyncThunk<MoveResult, ArgType, { extra: AppThunkExtraArgs }>(
	"moveOpponentPiece",
	(args: ArgType, options) => {
		const { killedPiece, pieceLocations, isCheckmated } = options.extra.container
			.get(MoveOpponentPiece)
			.execute({ pieceId: args.pieceId, targetSquareId: args.targetSquareId });

		const pieceLocationsForReducer: PieceLocations = {};
		pieceLocations.forEach((piece, square) => (pieceLocationsForReducer[square.id] = piece.id));

		if (isCheckmated) {
			getSocket().emit("checkmated");
		}

		return {
			killedPieceId: killedPiece?.id,
			pieceLocations: pieceLocationsForReducer,
			isCheckmated,
		};
	}
);
