import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StartingData } from "../../domain/entities/board/board.class";
import { moveOpponentsPieceToTargetSquare } from "../thunks/move-opponents-piece-to-target-square.thunk";
import { moveSelectedPieceToTargetSquare } from "../thunks/move-selected-piece-to-target-square.thunk";

type GameState = {
	isConnected: boolean;
	forfeitWin: boolean;
	matchStartingData: StartingData | null;
	waitingTurn: boolean;
	yourDeadPieces: string[];
	opponentsDeadPieces: string[];
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
		waitingForTurn: (state, action: PayloadAction<boolean>) => {
			state.waitingTurn = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(moveSelectedPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = true;
			if (action.payload.killedPiece) {
				state.opponentsDeadPieces.push(action.payload.killedPiece.id);
			}
		});

		builder.addCase(moveOpponentsPieceToTargetSquare.fulfilled, (state, action) => {
			state.waitingTurn = false;
			if (action.payload.killedPiece) {
				state.yourDeadPieces.push(action.payload.killedPiece.id);
			}
		});
	},
});

// Action creators are generated for each case reducer function
export const { readyMatch, forfeitWinMatch, setAsConnected, waitingForTurn } = gameSlice.actions;

export default gameSlice.reducer;
