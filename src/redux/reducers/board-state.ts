import { createAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Piece } from "../../domain/chess/piece/piece.abstract";
import { board } from "../../domain/domain";

type MoveHighlightState = {
	highlightedSquares: string[];
	selectedPieceId: string;
	pieceLocations: { [squareId: string]: string | undefined };
	playerColor: string;
};

const initialState: MoveHighlightState = {
	highlightedSquares: [],
	selectedPieceId: "",
	pieceLocations: board.startingData.pieceLocations,
	playerColor: board.startingData.playerColor,
};

// const thunkTest = createAsyncThunk<{message: string}>(
// 	'thunkTest',
// 	(data) => {
// 		if (data.message === "fail") {
// 			console.log(message)
// 		}
// 	}
// )

const actionTest = createAction<{ pieceId: string }>("actionTest");

const boardState = createSlice({
	name: "boardState",
	initialState,
	reducers: {
		move: (state, action: PayloadAction<{ targetSquareId: string }>) => {
			if (!state.selectedPieceId || !state.highlightedSquares.includes(action.payload.targetSquareId)) {
				return;
			}

			board.movePiece(state.selectedPieceId, action.payload.targetSquareId);
			state.pieceLocations = board.pieceLocations;
			// const currentLocation = Object.keys(state.pieceLocations).find(
			// 	(squareId) => state.pieceLocations[squareId] === state.selectedPieceId
			// ) as string;

			// delete state.pieceLocations[currentLocation];
			// state.pieceLocations[action.payload.targetSquareId] = state.selectedPieceId;

			state.selectedPieceId = "";
			state.highlightedSquares = [];
		},
		toggleAvailableMoves: (state, action: PayloadAction<string>) => {
			if (state.selectedPieceId === action.payload) {
				state.selectedPieceId = "";
				state.highlightedSquares = [];
			} else {
				const piece = board.getPieceById(action.payload) as Piece;
				const availableCoordinates = board.getAvailableMoves(piece);
				state.highlightedSquares = availableCoordinates.map((c) => board.squares[c.y][c.x].id);
				state.selectedPieceId = action.payload;
			}
		},
		squareClicked: (state, action: PayloadAction<{ squareId: string }>) => {
			const square = board.getSquareById(action.payload.squareId);
			const piece = square.piece;

			if (state.selectedPieceId) {
				if (!state.selectedPieceId || !state.highlightedSquares.includes(action.payload.squareId)) {
					return;
				}

				board.movePiece(state.selectedPieceId, action.payload.squareId);
				state.pieceLocations = board.pieceLocations;

				state.selectedPieceId = "";
				state.highlightedSquares = [];
			} else {
				if (piece && piece.color === state.playerColor) {
					if (state.selectedPieceId === action.payload.squareId) {
						state.selectedPieceId = "";
						state.highlightedSquares = [];
					} else {
						const availableCoordinates = board.getAvailableMoves(piece);
						state.highlightedSquares = availableCoordinates.map((c) => board.squares[c.y][c.x].id);
						state.selectedPieceId = piece.id;
					}
				}
			}

			// if (piece && piece.color === state.playerColor) {

			// 	if (state.selectedPieceId === action.payload.squareId) {
			// 		state.selectedPieceId = "";
			// 		state.highlightedSquares = [];
			// 	} else {
			// 		const availableCoordinates = board.getAvailableMoves(piece);
			// 		state.highlightedSquares = availableCoordinates.map((c) => board.squares[c.y][c.x].id);
			// 		state.selectedPieceId = piece.id;
			// 	}
			// }
		},
	},
});

// Action creators are generated for each case reducer function
export const { move, toggleAvailableMoves, squareClicked } = boardState.actions;

// const highlightSquareThunk = createAsyncThunk(
// 	highlightAvailableSquares.name,
// 	async (userId, thunkAPI) => {
// 		console.log("BLABLA");
// 		return;
// 	},
// 	{}
// );

// piece.

export default boardState.reducer;
