import { createSlice } from "@reduxjs/toolkit";
import { PieceColor } from "../../domain/shared/types/piece-color.type";
import { SquareColor } from "../../domain/shared/types/square-color.type";
import { initMatch } from "../thunks/init-match.thunk";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";
import { toggleOnAvailableMoves } from "../thunks/toggle-on-available-moves.thunk";

const initialState: BoardState = {
	highlightedSquares: [],
	pieceLocations: {},
};

const board = createSlice({
	name: "board",
	initialState,
	reducers: {
		toggleOffAvailableMoves: (state) => {
			delete state.selectedPieceId;
			state.highlightedSquares = [];
		},
	},
	extraReducers: (builder) => {
		builder.addCase(moveSelectedPieceToTargetSquare.fulfilled, (state, action) => {
			state.pieceLocations = action.payload.pieceLocations;

			//toggleOffAvailableMoves
			delete state.selectedPieceId;
			state.highlightedSquares = [];
		});

		builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {
			state.pieceLocations = action.payload.pieceLocations;
		});

		builder.addCase(initMatch.fulfilled, (state, action) => {
			delete state.selectedPieceId;
			state.highlightedSquares = [];
			state.pieceLocations = action.payload.pieceLocations;
		});

		builder.addCase(toggleOnAvailableMoves.fulfilled, (state, action) => {
			state.highlightedSquares = action.payload.highlightedSquares;
			state.selectedPieceId = action.payload.selectedPieceId;
		});
	},
});

// Action creators are generated for each case reducer function
export const { toggleOffAvailableMoves } = board.actions;

export default board.reducer;

export type StartingData = {
	squareData: { id: string; color: SquareColor }[][];
	pieceLocations: PieceLocations;
	playerColor: PieceColor;
	isStartingFirst: boolean;
};

export type PieceLocations = { [squareId: string]: string };

export type MoveResult = {
	pieceLocations: PieceLocations;
	killedPieceId?: string;
	matchResult?: "win" | "loss" | "stalemate";
};

type BoardState = {
	highlightedSquares: string[];
	selectedPieceId?: string;
	pieceLocations: { [squareId: string]: string | undefined };
};
