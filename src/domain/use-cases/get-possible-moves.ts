import { inject, injectable } from "inversify";
import { DataStore } from "../data-store";
import { Board } from "../entities/board/board.class";
import { Square } from "../entities/board/square.class";
import { UseCase } from "./use-case.interface";

@injectable()
export class GetPossibleMoves implements UseCase<{ pieceId: string }, Square[]> {
	@inject(DataStore)
	private _dataStore!: DataStore;

	@inject(Board)
	private _board!: Board;

	execute(input: { pieceId: string }) {
		const piece = this._dataStore.getPieceById(input.pieceId);
		return this._board.getPossibleMovesArray(piece);
	}
}
