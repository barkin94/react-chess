import { inject, injectable } from "inversify";
import { Side } from "../../../shared/types/side.type";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";
import { BoardNavigator, Direction } from "./board-navigator.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";

@injectable()
export class QueenMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	private directionsPieceCanMove: Direction[] = [
		"bottom",
		"bottom_left",
		"bottom_right",
		"left",
		"right",
		"top",
		"top_left",
		"top_right",
	];

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId)
			throw new Error("piece is not on the board");

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];
		const side: Side = piece.color === this._dataStore.getColor("player") ? "player" : "opponent";

		this.directionsPieceCanMove.forEach((direction) => {
			const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(square, direction, side);
			possibleMoves.push(...this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color));
		});

		return possibleMoves;
	}
}
