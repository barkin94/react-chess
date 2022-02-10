import { inject, injectable } from "inversify";
import { DataStore } from "../../../data-store";
import { PieceColor } from "../../../shared/types/piece-color.type";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";

@injectable()
export abstract class MoveCalculationStrategy {
	abstract getPossibleMoves(piece: Piece): Square[];

	@inject(DataStore)
	protected _dataStore!: DataStore;

	protected endSequenceWhenEncounteredPiece(moveSequence: Square[], movingPieceColor: PieceColor) {
		const possibleMoves: Square[] = [];
		for (let square of moveSequence) {
			const pieceOnSquare = this._dataStore.getPieceOnSquare(square);

			if (pieceOnSquare?.color === movingPieceColor) {
				break;
			} else if (pieceOnSquare && pieceOnSquare.color !== movingPieceColor) {
				possibleMoves.push(square);
				break;
			} else {
				possibleMoves.push(square);
			}
		}

		return possibleMoves;
	}
}
