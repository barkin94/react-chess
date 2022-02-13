import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initMatch } from "../thunks/init-match.thunk";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";
import { StartingData } from "./board";

const initialState: GameState = {
	waitingTurn: false,
	yourDeadPieces: [],
	opponentsDeadPieces: [],
	activePage: { page: "connecting" },
};

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		searchMatch: (state) => {
			delete state.matchResult;
			state.activePage = { page: "searching-match" };
		},
		forfeitWinMatch: (state) => {
			state.matchResult = "opponent-forfeit";
		},
		waitingForTurn: (state, action: PayloadAction<boolean>) => {
			state.waitingTurn = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(moveSelectedPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = true;
			state.matchResult = action.payload.matchResult;
			if (action.payload.killedPieceId) {
				state.opponentsDeadPieces.push(action.payload.killedPieceId);
			}
		});

		builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = false;
			state.matchResult = action.payload.matchResult;
			if (action.payload.killedPieceId) {
				state.yourDeadPieces.push(action.payload.killedPieceId);
			}
		});

		builder.addCase(initMatch.fulfilled, (state, action) => {
			delete state.matchResult;
			state.activePage = { page: "in-match", matchStartingData: action.payload };
			state.waitingTurn = !action.payload.isStartingFirst;
			state.yourDeadPieces = [];
			state.opponentsDeadPieces = [];
		});
	},
});

// Action creators are generated for each case reducer function
export const { forfeitWinMatch, waitingForTurn, searchMatch /* rematch */ } = gameSlice.actions;

export default gameSlice.reducer;

export type MatchResult = "win" | "loss" | "stalemate" | "opponent-forfeit";

type ActivePage =
	| { page: "enter-name" } // to be implemented
	| { page: "connecting" }
	| { page: "searching-match" }
	| { page: "in-match"; matchStartingData: StartingData };

type GameState = {
	waitingTurn: boolean;
	yourDeadPieces: string[];
	opponentsDeadPieces: string[];
	matchResult?: MatchResult;
	activePage: ActivePage;
};
