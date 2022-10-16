import { getPieceLocationsForReducer } from "../helper-fns";
import { MoveResultForReducoer } from "../reducers/board";
import { appCreateAsyncThunk } from "../store";
import { showMatchEndModal } from "./show-match-end-modal.thunk";

export type ArgType = {
	pieceId: string;
	targetSquareId: string;
};

export const moveOpponentsPieceToTargetSquare = appCreateAsyncThunk<MoveResultForReducoer, ArgType>(
	"moveOpponentPiece",
	(args, { extra, dispatch }) => {
		const { pieceLocations, events } = extra.movePiece.execute({
			pieceId: args.pieceId,
			targetSquareId: args.targetSquareId,
		});

		events.forEach(event => event.type === "match-end" && dispatch(showMatchEndModal(event.winner)));

		return {
			pieceLocations: getPieceLocationsForReducer(pieceLocations),
			events,
		};
	}
);
