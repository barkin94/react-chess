import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initMatch } from "../thunks/init-match.thunk";
import { initSocketConnection } from "../thunks/init-socket-connection.thunk";
import { StartingData } from "./board";

const initialState: GameState = {
	socketStataus: 'not-connected',
	activePage: { name: "loading" },
};

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setActivePage: (state, action: PayloadAction<ActivePage>) => {
			state.activePage = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(initSocketConnection.pending, (state) => {
			state.socketStataus = "connecting"
		});

		builder.addCase(initSocketConnection.fulfilled, (state) => {
			state.socketStataus = "connected"
		});

		builder.addCase(initMatch.fulfilled, (state, action) => {
			state.activePage = { name: "match", matchStartingData: action.payload };
		});
	},
});

// Action creators are generated for each case reducer function
export const { setActivePage } = gameSlice.actions;

export default gameSlice.reducer;

export type MatchResult = "win" | "loss" | "draw";

type ActivePage =
	| { name: "enter-name" } // to be implemented
	| { name: "loading" }
	| { name: "match"; matchStartingData: StartingData };

type GameState = {
	socketStataus: 'not-connected' | 'connecting' | 'connected',
	activePage: ActivePage;
};
