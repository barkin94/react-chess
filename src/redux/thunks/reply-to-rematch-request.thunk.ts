import { appCreateAsyncThunk } from "../store";
import { initMatch } from "./init-match.thunk";
import { searchMatch } from "./search-match.thunk";

export const replyToRematchRequest = appCreateAsyncThunk<void, "accepted" | "rejected">(
	"replyToRematchRequest",
	async (rematchRequestReply, { dispatch, extra, getState }) => {
		const state = getState();
		const activePage = state.game.activePage;

		if (activePage.name !== "match") {
			throw new Error("can only request match");
		}

		const playerColor = activePage.matchStartingData.playerColor;
		const socket = extra.getSocket();

		rematchRequestReply === "accepted" ? dispatch(initMatch({ playerColor })) : dispatch(searchMatch());

		socket.emit("rematch-request-result", rematchRequestReply);
	}
);
