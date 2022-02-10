import { createAsyncThunk } from "@reduxjs/toolkit";
import { PieceColor } from "../../domain/shared/types/piece-color.type";
import { AppThunkExtraArgs } from "../store";
import { PieceLocations, StartingData } from "../reducers/board";

export type InitMatchArg = {
	playerColor: PieceColor;
	isStartingFirst: boolean;
};

export const initMatch = createAsyncThunk<StartingData, InitMatchArg, { extra: AppThunkExtraArgs }>(
	"initMatch",
	(args: InitMatchArg, obj) => {
		const initialData = obj.extra.initMatch.execute(args.playerColor);

		const squareData: StartingData["squareData"] = [];
		initialData.squareLayout.forEach((row) => {
			squareData.push(row.map((square) => ({ id: square.id, color: square.color })));
		});

		const pieceLocations: PieceLocations = {};
		initialData.pieceLocations.forEach((piece, square) => (pieceLocations[square.id] = piece.id));

		return {
			playerColor: args.playerColor,
			isStartingFirst: args.isStartingFirst,
			squareData,
			pieceLocations,
		};
	}
);
