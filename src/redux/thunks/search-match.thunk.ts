import { resetScore, setActivePage } from "../reducers/game";
import { closeModal } from "../reducers/modal";
import { appCreateAsyncThunk } from "../store";

export const searchMatch = appCreateAsyncThunk<void, void>("searchMatch", async (args, { dispatch }) => {
	dispatch(closeModal());
	dispatch(resetScore());
	dispatch(setActivePage({ name: "searching-match" }));
});
