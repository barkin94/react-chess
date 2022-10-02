import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initMatch } from "../thunks/init-match.thunk";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";
import { StartingData } from "./board";

const initialState: GameState = {
	waitingTurn: false,
	yourCapturedPieces: [],
	opponentsCapturedPieces: [],
	activePage: { name: "connecting" },
	score: {
		player: 0,
		opponent: 0,
	},
};

const gameSlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		resetScore: (state) => {
			state.score = {
				opponent: 0,
				player: 0,
			};
		},
		setActivePage: (state, action: PayloadAction<ActivePage>) => {
			state.activePage = action.payload
		},
		waitingForTurn: (state, action: PayloadAction<boolean>) => {
			state.waitingTurn = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(moveSelectedPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = true;
			state.matchResult = action.payload.matchResult;
			if (action.payload.capturedPieceId) {
				state.opponentsCapturedPieces.push(action.payload.capturedPieceId);
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

			if (action.payload.capturedPieceId) {
				state.yourCapturedPieces.push(action.payload.capturedPieceId);
			}

			if (state.matchResult === "win") {
				state.score.player++;
			} else if (state.matchResult === "loss") {
				state.score.opponent++;
			}
		});

		builder.addCase(initMatch.fulfilled, (state, action) => {
			delete state.matchResult;
			state.activePage = { name: "match", matchStartingData: action.payload };
			state.waitingTurn = action.payload.playerColor === "black";
			state.yourCapturedPieces = [];
			state.opponentsCapturedPieces = [];
		});
	},
});

// Action creators are generated for each case reducer function
export const { waitingForTurn, resetScore, setActivePage } = gameSlice.actions;

export default gameSlice.reducer;

export type MatchResult = "win" | "loss" | "draw";

type ActivePage =
	| { name: "enter-name" } // to be implemented
	| { name: "connecting" }
	| { name: "searching-match" }
	| { name: "match"; matchStartingData: StartingData };

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
