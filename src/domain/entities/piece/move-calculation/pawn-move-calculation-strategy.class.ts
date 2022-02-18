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

		// Check if pawn can move forward
		const squareInTop = this._boardNavigator.getFirstSquareInDirection(squarePieceIsOn, "top", pieceOwner);
		if (squareInTop && !this._dataStore.getPieceOnSquare(squareInTop)) {
			possibleMoves.push(squareInTop);
		}

		// Pawn can move 2 squares forward during its first move. Check if it can move forward 2nd time
		if (squareInTop && this.isPawnOnStartingLocation(piece)) {
			const squareIn2ndTop = this._boardNavigator.getFirstSquareInDirection(squareInTop, "top", pieceOwner);
			if (squareIn2ndTop && !this._dataStore.getPieceOnSquare(squareIn2ndTop)) {
				possibleMoves.push(squareIn2ndTop);
			}
		}

		// Pawn can capture opponent pieces if they are on pawn's top left or top right.
		// ------------------------------------------------------------------------------------------------------
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
		//----------------------------------------------------------------------------------------------------------
		return possibleMoves;
	}

	isPawnOnStartingLocation(piece: Piece): boolean {
		if (!piece.squareId) throw new Error("piece is not on board");

		const pieceOwner = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";
		const squarePieceIsOn = this._dataStore.getSquareById(piece.squareId);

		const theSquareBehind = this._boardNavigator.getFirstSquareInDirection(squarePieceIsOn, "bottom", pieceOwner)!;

		return !this._boardNavigator.getFirstSquareInDirection(theSquareBehind, "bottom", pieceOwner);
	}
}
