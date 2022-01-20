import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBoardData } from "../../domain/domain";
import { StartingData } from "../../domain/entities/board/board.class";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";

type BoardState = {
	highlightedSquares: string[];
	selectedPieceId: string;
	pieceLocations: { [squareId: string]: string | undefined };
};

const initialState: BoardState = {
	highlightedSquares: [],
	selectedPieceId: "",
	pieceLocations: {},
};

const board = createSlice({
	name: "board",
	initialState,
	reducers: {
		setPieces: (state, action: PayloadAction<StartingData["pieceLocations"]>) => {
			state.pieceLocations = action.payload;
		},
		toggleOffAvailableMoves: (state) => {
			state.selectedPieceId = "";
			state.highlightedSquares = [];
		},
		toggleOnAvailableMoves: (state, action: PayloadAction<string>) => {
			const board = getBoardData();
			const piece = board.getPieceById(action.payload);
			const availableCoordinates = board.getAvailableMoves(piece);
			state.highlightedSquares = availableCoordinates.map((c) => board.squares[c.y][c.x].id);
			state.selectedPieceId = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(moveSelectedPieceToTargetSquare.fulfilled, (state, action) => {
			state.pieceLocations = action.payload.pieceLocations;

			//toggleOffAvailableMoves
			state.selectedPieceId = "";
			state.highlightedSquares = [];
		});

		builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {
			state.pieceLocations = action.payload.pieceLocations;
		});
	},
});

// Action creators are generated for each case reducer function
export const { toggleOnAvailableMoves, toggleOffAvailableMoves, setPieces } = board.actions;

export default board.reducer;
