import { createAsyncThunk } from "@reduxjs/toolkit";
import { MovePiece } from "../../domain/use-cases/move-piece";
import { getSocket } from "../../socket/socket-io";
import { MoveResult, PieceLocations } from "../reducers/board";
import { AppThunkExtraArgs, RootState } from "../store";

export const moveSelectedPieceToTargetSquare = createAsyncThunk<MoveResult, string, { extra: AppThunkExtraArgs }>(
	"moveSelectedPiece",
	(targetSquareId, { getState, extra }) => {
		const state = getState() as RootState;

		const moveResult = extra.container.get(MovePiece).execute({
			pieceId: state.board.selectedPieceId,
			targetSquareId,
		});

		const pieceLocations: PieceLocations = {};
		moveResult.pieceLocations.forEach((piece, square) => (pieceLocations[square.id] = piece.id));

		getSocket().emit("move", {
			pieceId: state.board.selectedPieceId,
			targetSquareId: targetSquareId,
		});

		return {
			killedPieceId: moveResult.killedPiece?.id,
			pieceLocations,
			matchResult: moveResult.matchResult,
		};
	}
);
