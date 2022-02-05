import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initMatch } from "../thunks/init-match.thunk";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";
import { StartingData } from "./board";

type GameState = {
	isConnected: boolean;
	forfeitWin: boolean;
	matchStartingData: StartingData | null;
	waitingTurn: boolean;
	yourDeadPieces: string[];
	opponentsDeadPieces: string[];
	matchResult?: MatchResult;
};

type MatchResult = {
	result: "won" | "loss";
};

const initialState: GameState = {
	forfeitWin: false,
	isConnected: false,
	matchStartingData: null,
	waitingTurn: false,
	yourDeadPieces: [],
	opponentsDeadPieces: [],
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
		matchWon: (state) => {
			state.matchResult = {
				result: "won",
			};
		},
		rematch: (state) => {},
		waitingForTurn: (state, action: PayloadAction<boolean>) => {
			state.waitingTurn = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(moveSelectedPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = true;
			if (action.payload.killedPieceId) {
				state.opponentsDeadPieces.push(action.payload.killedPieceId);
			}
		});

		builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = false;
			if (action.payload.killedPieceId) {
				state.yourDeadPieces.push(action.payload.killedPieceId);
			}
			if (action.payload.isCheckmated) {
				state.matchResult = { result: "loss" };
			}
		});

		builder.addCase(initMatch.fulfilled, (state, action) => {
			state.matchStartingData = action.payload;
			state.waitingTurn = !action.payload.isStartingFirst;
		});

		// builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {

		// });
	},
});

// Action creators are generated for each case reducer function
export const { readyMatch, forfeitWinMatch, setAsConnected, waitingForTurn, matchWon } = gameSlice.actions;

export default gameSlice.reducer;
