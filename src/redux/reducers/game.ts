import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PieceColor } from "../../domain/shared";
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

			action.payload.events.forEach(event => {
				switch (event.type) {
					case "capture":
						state.opponentsCapturedPieces.push(event.capturedPieceId);
						break;
					case "match-end":
						event.winner === state.playerColor
							? state.score.player++
							: state.score.opponent++;
						break;
				}
			});
		});

		builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = false;

			action.payload.events.forEach(event => {
				switch (event.type) {
					case "capture":
						state.opponentsCapturedPieces.push(event.capturedPieceId);
						break;
					case "match-end":
						event.winner === state.playerColor
							? state.score.player++
							: state.score.opponent++;
						break;
				}
			});
		});

		builder.addCase(initMatch.fulfilled, (state, action) => {
			state.activePage = { name: "match", matchStartingData: action.payload };
			state.playerColor = action.payload.playerColor
			state.waitingTurn = state.playerColor === "black";
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
	playerColor?: PieceColor;
	activePage: ActivePage;
	score: {
		opponent: number;
		player: number;
	};
};
