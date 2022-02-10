import { BoardInitializer } from "../entities/board/board-initializer.class";
import { PieceColor } from "../shared/types/piece-color.type";
import { DataStore } from "../data-store";
import { inject, injectable } from "inversify";
import { UseCase } from "./use-case.interface";
import { Square } from "../entities/board/square.class";
import { PieceLocations } from "../entities/board/board.class";

@injectable()
export class InitMatch implements UseCase<PieceColor, MatchInitialData> {
	@inject(DataStore)
	private _dataStore!: DataStore;

	@inject(BoardInitializer)
	private _boardInitializer!: BoardInitializer;

	execute(playerColor: PieceColor): MatchInitialData {
		this._dataStore.setPlayerColor(playerColor);

		const squareLayout = this._boardInitializer.initSquareLayout(playerColor);
		this._dataStore.setSquareLayout(squareLayout);

		const pieceLocations = this._boardInitializer.getPieceStartingLocations(playerColor);
		pieceLocations.black.forEach((coordinates, piece) => {
			const square = this._dataStore.getSquareByCoordinates(coordinates);
			this._dataStore.insertPieceOnSquare(piece, square);
		});
		pieceLocations.white.forEach((coordinates, piece) => {
			const square = this._dataStore.getSquareByCoordinates(coordinates);
			this._dataStore.insertPieceOnSquare(piece, square);
		});

		return {
			squareLayout,
			pieceLocations: this._dataStore.getPieceLocations(),
		};
	}
}

type MatchInitialData = {
	squareLayout: Square[][];
	pieceLocations: PieceLocations;
};
