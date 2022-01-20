import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSocket } from "../../socket/socket-io";
import { RootState } from "../store";
import { movePiece, MoveResult } from "../../domain/use-cases/move-piece";

export const moveSelectedPieceToTargetSquare = createAsyncThunk<MoveResult, string>(
	"board",
	(targetSquareId, { getState, rejectWithValue }) => {
		const state = getState() as RootState;

		const result = movePiece(state.board.selectedPieceId, targetSquareId);

		getSocket().emit("move", {
			pieceId: state.board.selectedPieceId,
			targetSquareId: targetSquareId,
		});

		return result;
	}
);
