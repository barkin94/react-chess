import { inject, injectable } from "inversify";
import { BoardNavigator } from "./board-navigator";
import { Square } from "../../board/square.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";
import { Piece } from "../piece.class";

@injectable()
export class PawnMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);
		const squareInDirection = this._boardNavigator.getFirstSquareInDirection(
			square,
			"top",
			piece.color === this._dataStore.getPlayerColor() ? "player" : "opponent"
		);

		let possibleMoves = squareInDirection
			? this.endSequenceWhenEncounteredPiece([squareInDirection], piece.color)
			: [];
		return possibleMoves;
	}
}
