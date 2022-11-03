import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChessEvent } from "../../domain/entities/board/board.class";
import { PieceColor, SquareColor } from "../../domain/shared";
import { initMatch } from "../thunks/init-match.thunk";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";
import { toggleOnAvailableMoves } from "../thunks/toggle-on-available-moves.thunk";

const initialState: BoardState = {
	highlightedSquares: [],
	pieceLocations: {},
	yourCapturedPieces: [],
	opponentsCapturedPieces: [],
	waitingTurn: false,
	score: {
		player: 0,
		opponent: 0,
	},
	
};

const board = createSlice({
	name: "board",
	initialState,
	reducers: {
		resetScore: (state) => {
			state.score = {
				opponent: 0,
				player: 0,
			};
		},
		waitingForTurn: (state, action: PayloadAction<boolean>) => {
			state.waitingTurn = action.payload;
		},
		toggleOffAvailableMoves: (state) => {
			delete state.selectedPieceId;
			state.highlightedSquares = [];
		},
	},
	extraReducers: (builder) => {
		builder.addCase(moveSelectedPieceToTargetSquare.fulfilled, (state, action) => {
			state.pieceLocations = action.payload.pieceLocations;
			delete state.selectedPieceId;
			state.highlightedSquares = [];
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
			state.pieceLocations = action.payload.pieceLocations;
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
			delete state.selectedPieceId;
			state.highlightedSquares = [];
			state.pieceLocations = action.payload.pieceLocations;
			state.playerColor = action.payload.playerColor
			state.waitingTurn = state.playerColor === "black";
			state.yourCapturedPieces = [];
			state.opponentsCapturedPieces = [];
		});

		builder.addCase(toggleOnAvailableMoves.fulfilled, (state, action) => {
			state.highlightedSquares = action.payload.highlightedSquares;
			state.selectedPieceId = action.payload.selectedPieceId;
		});
	},
});

// Action creators are generated for each case reducer function
export const { toggleOffAvailableMoves, resetScore, waitingForTurn } = board.actions;

export default board.reducer;

export type StartingData = {
	squareData: { id: string; color: SquareColor }[][];
	pieceLocations: PieceLocationsForReducer;
	playerColor: PieceColor;
};

export type PieceLocationsForReducer = { [squareId: string]: string };

export type MoveResultForReducoer = {
	pieceLocations: PieceLocationsForReducer;
	events: ChessEvent[];
};

type BoardState = {
	highlightedSquares: string[];
	selectedPieceId?: string;
	pieceLocations: { [squareId: string]: string | undefined };
	yourCapturedPieces: string[];
	opponentsCapturedPieces: string[];
	score: {
		player: 0,
		opponent: 0,
	},
	waitingTurn: boolean;
	playerColor?: PieceColor;
};
