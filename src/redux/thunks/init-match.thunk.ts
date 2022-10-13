import { createAsyncThunk } from "@reduxjs/toolkit";
import { PieceColor } from "../../domain/shared";
import { PieceLocationsForReducer, StartingData } from "../reducers/board";
import { closeModal } from "../reducers/modal";
import { AppThunkExtraArgs } from "../store";

export type InitMatchArg = {
	playerColor: PieceColor;
};

export const initMatch = createAsyncThunk<StartingData, InitMatchArg, { extra: AppThunkExtraArgs }>(
	"initMatch",
	(args: InitMatchArg, { extra, dispatch }) => {
		const initialData = extra.initMatch.execute(args.playerColor);

		const squareData: StartingData["squareData"] = [];
		initialData.squareLayout.forEach((row) => {
			squareData.push(row.map((square) => ({ id: square.id, color: square.color })));
		});

		const pieceLocations: PieceLocationsForReducer = {};
		initialData.pieceLocations.forEach((piece, square) => (pieceLocations[square.id] = piece.id));

		dispatch(closeModal());

		return {
			playerColor: args.playerColor,
			squareData,
			pieceLocations,
		};
	}
);
