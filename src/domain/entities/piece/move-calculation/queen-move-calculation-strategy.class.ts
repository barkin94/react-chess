import { inject, injectable } from "inversify";
import { BoardNavigator, Direction, Side } from "./board-navigator";
import { Square } from "../../board/square.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";
import { Piece } from "../piece.class";

@injectable()
export class QueenMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];
		const side: Side = piece.color === this._dataStore.getPlayerColor() ? "player" : "opponent";

		["top", "bottom", "left", "right", "top_left", "bottom_left", "top_right", "bottom_right"].forEach(
			(direction) => {
				const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(
					square,
					direction as Direction,
					side
				);
				possibleMoves.push(...this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color));
			}
		);

		return possibleMoves;
	}
}
