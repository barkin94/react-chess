import { createAsyncThunk } from "@reduxjs/toolkit";
import { openModal } from "../reducers/modal";
import { AppThunkExtraArgs } from "../store";

export const showMatchEndModal = createAsyncThunk<void, void, { extra: AppThunkExtraArgs }>(
	"showMatchEndModal",
	async (args, { dispatch, extra }) => { 
		dispatch(openModal({ componentName: "MatchEnd" }));

		extra.getSocket().on("rematch-request", () => {
			dispatch(openModal({ componentName: "RematchRequestReceived" }));
		});
	}
);
