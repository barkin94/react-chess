import { PieceColor } from "../../domain/shared";
import { openModal } from "../reducers/modal";
import { appCreateAsyncThunk } from "../store";

export const showMatchEndModal = appCreateAsyncThunk<void, PieceColor | undefined>(
	"showMatchEndModal",
	async (winningPieceColor, { dispatch, extra }) => {
		dispatch(openModal({ componentName: "MatchEnd", props: { winner: winningPieceColor } }));

		extra.getSocket().on("rematch-request", () => {
			dispatch(openModal({ componentName: "RematchRequestReceived" }));
		});
	}
);
