import { inject, injectable } from "inversify";
import { BoardNavigator } from "./board-navigator.class";
import { Square } from "../../board/square.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";
import { Piece } from "../piece.class";

@injectable()
export class PawnMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const possibleMoves: Square[] = [];

		const pieceOwner = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";
		const squarePieceIsOn = this._dataStore.getSquareById(piece.squareId);

		const squareInTop = this._boardNavigator.getFirstSquareInDirection(squarePieceIsOn, "top", pieceOwner);
		if (squareInTop && !this._dataStore.getPieceOnSquare(squareInTop)) {
			possibleMoves.push(squareInTop);
		}

		const squareInTopLeft = this._boardNavigator.getFirstSquareInDirection(squarePieceIsOn, "top_left", pieceOwner);
		if (squareInTopLeft) {
			const targetPiece = this._dataStore.getPieceOnSquare(squareInTopLeft);
			if (targetPiece && targetPiece.color !== this._dataStore.getColor(pieceOwner)) {
				possibleMoves.push(squareInTopLeft);
			}
		}

		const squareInTopRight = this._boardNavigator.getFirstSquareInDirection(
			squarePieceIsOn,
			"top_right",
			pieceOwner
		);
		if (squareInTopRight) {
			const targetPiece = this._dataStore.getPieceOnSquare(squareInTopRight);
			if (targetPiece && targetPiece.color !== this._dataStore.getColor(pieceOwner)) {
				possibleMoves.push(squareInTopRight);
			}
		}

		return possibleMoves;
	}
}
