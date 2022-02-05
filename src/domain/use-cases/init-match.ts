import { BoardInitializer } from "../entities/board/board-initializer.class";
import { PieceColor } from "../shared/types/piece-color.type";
import { DataStore } from "../data-store";
import { inject, injectable } from "inversify";
import { UseCase } from "./use-case.interface";

@injectable()
export class InitMatch implements UseCase<PieceColor, void> {
	@inject(DataStore)
	private _dataStore!: DataStore;

	@inject(BoardInitializer)
	private _boardInitializer!: BoardInitializer;

	execute(playerColor: PieceColor): void {
		this._dataStore.setPlayerColor(playerColor);

		const layout = this._boardInitializer.initSquareLayout(playerColor);
		this._dataStore.setSquareLayout(layout);

		const pieceLocations = this._boardInitializer.getPieceStartingLocations(playerColor);
		pieceLocations.black.forEach((coordinates, piece) => {
			const square = this._dataStore.getSquareByCoordinates(coordinates);
			this._dataStore.insertPieceOnSquare(piece, square);
		});
		pieceLocations.white.forEach((coordinates, piece) => {
			const square = this._dataStore.getSquareByCoordinates(coordinates);
			this._dataStore.insertPieceOnSquare(piece, square);
		});
	}
}
