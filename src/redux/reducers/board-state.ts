import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBoardData } from "../../business/business";
import { StartingData } from "../../business/chess/board/board.class";

type MoveHighlightState = {
	highlightedSquares: string[];
	selectedPieceId: string;
	pieceLocations: { [squareId: string]: string | undefined };
};

const initialState: MoveHighlightState = {
	highlightedSquares: [],
	selectedPieceId: "",
	pieceLocations: {},
};

const boardState = createSlice({
	name: "boardState",
	initialState,
	reducers: {
		setPieces: (state, action: PayloadAction<StartingData["pieceLocations"]>) => {
			state.pieceLocations = action.payload;
		},
		move: (state, action: PayloadAction<{ targetSquareId: string }>) => {
			const board = getBoardData();
			if (!board.canPieceMakeMove(state.selectedPieceId, action.payload.targetSquareId)) {
				return;
			}

			board.movePiece(state.selectedPieceId, action.payload.targetSquareId);
			state.pieceLocations = board.getPieceLocations();
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
});

// Action creators are generated for each case reducer function
export const { move, toggleOnAvailableMoves, toggleOffAvailableMoves, setPieces } = boardState.actions;

export default boardState.reducer;
