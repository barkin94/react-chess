import { resetScore } from "../reducers/board";
import { setActivePage } from "../reducers/game";
import { closeModal } from "../reducers/modal";
import { appCreateAsyncThunk } from "../store";
import { initMatch } from "./init-match.thunk";

export const searchMatch = appCreateAsyncThunk<void, void>("searchMatch", async (args, { dispatch, extra }) => {
	dispatch(closeModal());
	dispatch(resetScore());
	dispatch(setActivePage({ name: "loading" }));

	const socket = extra.getSocket();
	
	socket.on<any>("match-found", (args) => {
		dispatch(initMatch({ playerColor: args.color }));
		socket.off("match-found");
	});

	socket.emit("search-match");
});
