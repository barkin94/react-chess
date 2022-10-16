import { openModal } from "../reducers/modal";
import { appCreateAsyncThunk } from "../store";
import { initMatch } from "./init-match.thunk";

export const requestRematch = appCreateAsyncThunk<void, void>(
	"requestRematch",
	async (args, { dispatch, extra, getState }) => {
		const state = getState();
		const activePage = state.game.activePage;

		if (activePage.name !== "match") {
			throw new Error("can only request match");
		}

		const playerColor = activePage.matchStartingData.playerColor;
		const socket = extra.getSocket();

		socket.on("rematch-request-result", (payload: "accepted" | "rejected") => {
			payload === "accepted"
				? dispatch(initMatch({ playerColor }))
				: dispatch(openModal({ componentName: "OpponentRejectedRematch" }));
		});

		dispatch(openModal({ componentName: "RematchRequestSent" }));
		socket.emit("rematch-request");
	}
);
