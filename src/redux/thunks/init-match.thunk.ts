import { createAsyncThunk } from "@reduxjs/toolkit";
import { PieceColor } from "../../domain/shared/types/piece-color.type";
import { InitMatch } from "../../domain/use-cases/init-match";
import { AppThunkExtraArgs } from "../store";
import { DataStore } from "../../domain/data-store";
import { Board } from "../../domain/entities/board/board.class";
import { PieceLocations, StartingData } from "../reducers/board";

export type InitMatchArg = {
	playerColor: PieceColor;
	isStartingFirst: boolean;
};

export const initMatch = createAsyncThunk<StartingData, InitMatchArg, { extra: AppThunkExtraArgs }>(
	"initMatch",
	(args: InitMatchArg, obj) => {
		obj.extra.container.get(InitMatch).execute(args.playerColor);

		const squareData: StartingData["squareData"] = [];
		obj.extra.container
			.get(DataStore)
			.getSquareLayout()
			.forEach((row) => {
				squareData.push(row.map((square) => ({ id: square.id, color: square.color })));
			});

		const pieceLocations: PieceLocations = {};
		obj.extra.container
			.get(Board)
			.getPieceLocations()
			.forEach((piece, square) => (pieceLocations[square.id] = piece.id));

		return {
			playerColor: args.playerColor,
			isStartingFirst: args.isStartingFirst,
			squareData,
			pieceLocations,
		};
	}
);
