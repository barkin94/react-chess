import { inject, injectable } from "inversify";
import { Side } from "../../../shared";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";
import { BoardNavigator, Direction } from "./board-navigator.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";

@injectable()
export class KingMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];
		const side: Side = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";

		const directions: Direction[] = [
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
			if (squareInDirection) {
				possibleMoves.push(...this.endSequenceWhenEncounteredPiece([squareInDirection], piece.color));
			}
		});

		return possibleMoves;
	}
}
