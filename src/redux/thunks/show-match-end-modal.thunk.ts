import { PieceColor } from "../../domain/shared";
import { MATCH_END, REMATCH_REQUEST_RECEIVED } from "../modal-component-names";
import { openModal } from "../reducers/modal";
import { appCreateAsyncThunk } from "../store";

export const showMatchEndModal = appCreateAsyncThunk<void, PieceColor | undefined>(
	"showMatchEndModal",
	async (winningPieceColor, { dispatch, extra }) => {
		dispatch(openModal({ componentName: MATCH_END, props: { winner: winningPieceColor } }));

		extra.getSocket().on("rematch-request", () => {
			dispatch(openModal({ componentName: REMATCH_REQUEST_RECEIVED }));
		});
	}
);
