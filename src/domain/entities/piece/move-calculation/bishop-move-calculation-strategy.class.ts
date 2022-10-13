import { inject, injectable } from "inversify";
import { Side } from "../../../shared";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";
import { BoardNavigator, Direction } from "./board-navigator.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";

@injectable()
export class BishopMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];
		const side: Side = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";

		const directions: Direction[] = ["top_left", "bottom_left", "top_right", "bottom_right"];

		directions.forEach((direction) => {
			const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(square, direction, side);
			possibleMoves.push(...this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color));
		});

		return possibleMoves;
	}
}
