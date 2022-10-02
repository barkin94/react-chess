import { createAsyncThunk } from "@reduxjs/toolkit";
import { MoveResult, PieceLocations } from "../reducers/board";
import { AppThunkExtraArgs, RootState } from "../store";
import { showMatchEndModal } from "./show-match-end-modal.thunk";

export const moveSelectedPieceToTargetSquare = createAsyncThunk<MoveResult, string, { extra: AppThunkExtraArgs }>(
	"moveSelectedPiece",
	(targetSquareId, { getState, extra, dispatch }) => {
		const state = getState() as RootState;

		const moveResult = extra.movePiece.execute({
			pieceId: state.board.selectedPieceId!,
			targetSquareId,
		});

		const pieceLocations: PieceLocations = {};
		moveResult.pieceLocations.forEach((piece, square) => (pieceLocations[square.id] = piece.id));

		extra.getSocket().emit("move", {
			pieceId: state.board.selectedPieceId,
			targetSquareId: targetSquareId,
		});

		if (moveResult.matchResult)
			dispatch(showMatchEndModal());

		return {
			capturedPieceId: moveResult.capturedPiece?.id,
			pieceLocations,
			matchResult: moveResult.matchResult,
		};
	}
);
