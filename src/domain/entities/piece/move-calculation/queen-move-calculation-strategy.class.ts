import { inject, injectable } from "inversify";
import { Direction, NonKnightDirection, Side } from "../../../shared";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";
import { BoardNavigator } from "./board-navigator.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";

@injectable()
export class QueenMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	private directionsPieceCanMove: NonKnightDirection[] = [
		"bottom",
		"bottom_left",
		"bottom_right",
		"left",
		"right",
		"top",
		"top_left",
		"top_right",
	];

	getPossibleMoves(piece: Piece): Map<Direction, Square[]> {
		if (!piece.squareId)
			throw new Error("piece is not on the board");

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves = new Map<Direction, Square[]>();
		const side: Side = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";

		this.directionsPieceCanMove.forEach(direction => {
			const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(square, direction, side);
			const squaresUntilAnotherPiece = this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color);

			if(!squaresUntilAnotherPiece.length)
				return;

			possibleMoves.set(direction, squaresUntilAnotherPiece);
		});

		return possibleMoves;
	}
}
