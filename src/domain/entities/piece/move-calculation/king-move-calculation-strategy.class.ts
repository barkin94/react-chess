import { inject, injectable } from "inversify";
import { Direction, Side } from "../../../shared";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";
import { BoardNavigator } from "./board-navigator.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";

@injectable()
export class KingMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Map<Direction, Square[]> {
		if (!piece.squareId) return new Map();

		const square = this._dataStore.getSquareById(piece.squareId);
		const side: Side = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";

		const possibleMoves = new Map<Exclude<Direction, "knight_specific">, Square[]>();

		const directions: Exclude<Direction, "knight_specific">[] = [
			"top",
			"bottom",
			"left",
			"right",
			"top_left",
			"bottom_left",
			"top_right",
			"bottom_right",
		];

		directions.forEach((direction) => {
			const squareInDirection = this._boardNavigator.getFirstSquareInDirection(square, direction, side);
			
			if(!squareInDirection)
				return;

			const squaresUntilAnotherPiece = this.endSequenceWhenEncounteredPiece([squareInDirection], piece.color)
			
			if (squaresUntilAnotherPiece.length) {
				possibleMoves.set(direction, squaresUntilAnotherPiece);
			}
		});

		return possibleMoves;
	}
}
