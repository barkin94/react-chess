import { inject, injectable } from "inversify";
import { BoardNavigator, Direction, Side } from "./board-navigator";
import { Square } from "../../board/square.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";
import { Piece } from "../piece.class";

@injectable()
export class KingMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];
		const side: Side = piece.color === this._dataStore.getPlayerColor() ? "player" : "opponent";

		["top", "bottom", "left", "right", "top_left", "bottom_left", "top_right", "bottom_right"].forEach(
			(direction) => {
				const squareInDirection = this._boardNavigator.getFirstSquareInDirection(
					square,
					direction as Direction,
					side
				);
				if (squareInDirection) {
					possibleMoves.push(...this.endSequenceWhenEncounteredPiece([squareInDirection], piece.color));
				}
			}
		);

		return possibleMoves;
	}
}
