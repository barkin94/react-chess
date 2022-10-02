import { createAsyncThunk } from "@reduxjs/toolkit";
import { openModal } from "../reducers/modal";
import { AppThunkExtraArgs, RootState } from "../store";
import { initMatch } from "./init-match.thunk";

export const requestRematch = createAsyncThunk<void, void, { extra: AppThunkExtraArgs }>(
	"requestRematch",
	async (args, { dispatch, extra, getState }) => {
		const state = getState() as RootState;
		const activePage = state.game.activePage;

		if (activePage.name !== 'match') {
			throw new Error('can only request match')
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
