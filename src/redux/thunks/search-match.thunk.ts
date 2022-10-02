import { createAsyncThunk } from "@reduxjs/toolkit";
import { resetScore, setActivePage } from "../reducers/game";
import { closeModal } from "../reducers/modal";

export const searchMatch = createAsyncThunk(
	"searchMatch",
	async (args, { dispatch }) => {
		dispatch(closeModal());
		dispatch(resetScore())
		dispatch(setActivePage({ name: 'searching-match' }))
	}
);
