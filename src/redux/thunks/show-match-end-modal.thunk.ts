import { createAsyncThunk } from "@reduxjs/toolkit";
import { PieceColor } from "../../domain/shared/types/piece-color.type";
import { openModal } from "../reducers/modal";
import { AppThunkExtraArgs } from "../store";

export const showMatchEndModal = createAsyncThunk<void, PieceColor|undefined, { extra: AppThunkExtraArgs }>(
	"showMatchEndModal",
	async (args, { dispatch, extra }) => {
		dispatch(openModal({ componentName: "MatchEnd", props: { winner: args } }));

		extra.getSocket().on("rematch-request", () => {
			dispatch(openModal({ componentName: "RematchRequestReceived" }));
		});
	}
);
