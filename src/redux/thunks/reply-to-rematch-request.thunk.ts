import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunkExtraArgs, RootState } from "../store";
import { initMatch } from "./init-match.thunk";
import { searchMatch } from "./search-match.thunk";

export const replyToRematchRequest = createAsyncThunk<void, "accepted" | "rejected", { extra: AppThunkExtraArgs }>(
	"replyToRematchRequest",
	async (args, { dispatch, extra, getState }) => {
		const state = getState() as RootState;
		const activePage = state.game.activePage;

		if (activePage.name !== "match") {
			throw new Error("can only request match");
		}
		
		const playerColor = activePage.matchStartingData.playerColor;
		const socket = extra.getSocket();
		
		args === "accepted"
			? dispatch(initMatch({playerColor}))
			: dispatch(searchMatch());

		socket.emit("rematch-request-result", args);
	}
);
