import { inject, injectable } from "inversify";
import { DataStore } from "../data-store";
import { BoardInitializer } from "../entities/board/board-initializer.class";
import { PieceLocations } from "../entities/board/board.class";
import { Square } from "../entities/board/square.class";
import { PieceColor } from "../shared";
import { UseCase } from "./use-case.interface";

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

		this._dataStore.clearPieceLocations();
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
