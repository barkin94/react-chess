import { PieceColor } from "../../domain/shared";
import { PieceLocationsForReducer, StartingData } from "../reducers/board";
import { closeModal } from "../reducers/modal";
import { appCreateAsyncThunk } from "../store";

export type InitMatchArg = {
	playerColor: PieceColor;
};

export const initMatch = appCreateAsyncThunk<StartingData, InitMatchArg>(
	"initMatch",
	(initMatchArgs, { extra, dispatch }) => {
		const playerColor = initMatchArgs.playerColor;
		const initialData = extra.initMatch.execute(playerColor);

		const squareData: StartingData["squareData"] = [];
		initialData.squareLayout.forEach((row) => {
			squareData.push(row.map((square) => ({ id: square.id, color: square.color })));
		});

		const pieceLocations: PieceLocationsForReducer = {};
		initialData.pieceLocations.forEach((piece, square) => (pieceLocations[square.id] = piece.id));

		dispatch(closeModal());

		return {
			playerColor,
			squareData,
			pieceLocations,
		};
	}
);
