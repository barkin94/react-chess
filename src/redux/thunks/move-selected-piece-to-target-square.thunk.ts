import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPieceLocationsForReducer } from "../helper-fns";
import { MoveResultForReducoer } from "../reducers/board";
import { AppThunkExtraArgs, RootState } from "../store";
import { showMatchEndModal } from "./show-match-end-modal.thunk";

export const moveSelectedPieceToTargetSquare = createAsyncThunk<MoveResultForReducoer, string, { extra: AppThunkExtraArgs }>(
	"moveSelectedPiece",
	(targetSquareId, { getState, extra, dispatch }) => {
		const state = getState() as RootState;

		const { events, pieceLocations} = extra.movePiece.execute({
			pieceId: state.board.selectedPieceId!,
			targetSquareId,
		});

		extra.getSocket().emit("move", {
			pieceId: state.board.selectedPieceId,
			targetSquareId: targetSquareId,
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
