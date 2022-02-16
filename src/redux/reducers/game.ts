import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initMatch } from "../thunks/init-match.thunk";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";
import { StartingData } from "./board";

const initialState: GameState = {
	waitingTurn: false,
	yourCapturedPieces: [],
	opponentsCapturedPieces: [],
	activePage: { page: "connecting" },
	score: {
		player: 0,
		opponent: 0,
	},
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
				state.opponentsCapturedPieces.push(action.payload.killedPieceId);
			}

			if (state.matchResult === "win") {
				state.score.player++;
			} else if (state.matchResult === "loss") {
				state.score.opponent++;
			}
		});

		builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = false;
			state.matchResult = action.payload.matchResult;

			if (action.payload.killedPieceId) {
				state.yourCapturedPieces.push(action.payload.killedPieceId);
			}

			if (state.matchResult === "win") {
				state.score.player++;
			} else if (state.matchResult === "loss") {
				state.score.opponent++;
			}
		});

		builder.addCase(initMatch.fulfilled, (state, action) => {
			delete state.matchResult;
			state.activePage = { page: "in-match", matchStartingData: action.payload };
			state.waitingTurn = action.payload.playerColor === "black";
			state.yourCapturedPieces = [];
			state.opponentsCapturedPieces = [];
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
	yourCapturedPieces: string[];
	opponentsCapturedPieces: string[];
	matchResult?: MatchResult;
	activePage: ActivePage;
	score: {
		opponent: number;
		player: number;
	};
};
