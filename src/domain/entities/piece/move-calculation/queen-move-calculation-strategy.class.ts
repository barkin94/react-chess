import { inject, injectable } from "inversify";
import { BoardNavigator, Direction } from "./board-navigator.class";
import { Square } from "../../board/square.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";
import { Piece } from "../piece.class";
import { Side } from "../../../shared/types/side.type";

@injectable()
export class QueenMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];
		const side: Side = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";

		const directions: Direction[] = [
			"bottom",
			"bottom_left",
			"bottom_right",
			"left",
			"right",
			"top",
			"top_left",
			"top_right",
		];

		directions.forEach((direction) => {
			const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(square, direction, side);
			possibleMoves.push(...this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color));
		});

		return possibleMoves;
	}
}
