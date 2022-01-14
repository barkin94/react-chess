import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartingData } from "../../business/chess/board/board.class";

type GameState = {
	isConnected: boolean;
	forfeitWin: boolean;
	matchStartingData: StartingData | null;
	waitingTurn: boolean;
};

const initialState: GameState = {
	forfeitWin: false,
	isConnected: false,
	matchStartingData: null,
	waitingTurn: false,
};

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		setAsConnected: (state) => {
			state.isConnected = true;
		},
		readyMatch: (state, action: PayloadAction<StartingData>) => {
			state.matchStartingData = action.payload;
			state.waitingTurn = !action.payload.isStartingFirst;
		},
		forfeitWinMatch: (state) => {
			state.forfeitWin = true;
		},
		waitingForTurn: (state, action: PayloadAction<boolean>) => {
			state.waitingTurn = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { readyMatch, forfeitWinMatch, setAsConnected, waitingForTurn } = gameSlice.actions;

export default gameSlice.reducer;
