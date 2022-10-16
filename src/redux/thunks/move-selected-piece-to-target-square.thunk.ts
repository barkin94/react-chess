import { getPieceLocationsForReducer } from "../helper-fns";
import { MoveResultForReducoer } from "../reducers/board";
import { appCreateAsyncThunk } from "../store";
import { showMatchEndModal } from "./show-match-end-modal.thunk";

export const moveSelectedPieceToTargetSquare = appCreateAsyncThunk<MoveResultForReducoer, string>(
	"moveSelectedPiece",
	(targetSquareId, { getState, extra, dispatch }) => {
		const state = getState();

		const { events, pieceLocations } = extra.movePiece.execute({
			pieceId: state.board.selectedPieceId!,
			targetSquareId,
		});

		extra.getSocket().emit("move", {
			pieceId: state.board.selectedPieceId,
			targetSquareId: targetSquareId,
		});

		events.forEach(event => event.type === "match-end" && dispatch(showMatchEndModal(event.winner)));

		return {
			pieceLocations: getPieceLocationsForReducer(pieceLocations),
			events,
		};
	}
);
