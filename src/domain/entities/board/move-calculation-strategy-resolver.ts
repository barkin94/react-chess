import { inject, injectable } from "inversify";
import { DataStore } from "../../data-store";
import { PieceColor } from "../../shared/types/piece-color.type";
import { PieceType } from "../../shared/types/piece-type.type";
import { Piece } from "../piece/piece.abstract";
import { BoardNavigator, Direction } from "./board-navigator";
import { Square } from "./square.class";

@injectable()
abstract class MoveCalculationStrategy {
	abstract getPossibleMoves(piece: Piece): Square[];

	@inject(DataStore)
	protected _dataStore!: DataStore;

	protected endSequenceWhenEncounteredPiece(moveSequence: Square[], movingPieceColor: PieceColor) {
		const possibleMoves: Square[] = [];
		for (let square of moveSequence) {
			const pieceOnSquare = this._dataStore.getPieceOnSquare(square);

			if (pieceOnSquare?.color === movingPieceColor) {
				break;
			} else if (pieceOnSquare && pieceOnSquare.color !== movingPieceColor) {
				possibleMoves.push(square);
				break;
			} else {
				possibleMoves.push(square);
			}
		}

		return possibleMoves;
	}
}

@injectable()
class PawnMoveCalculationStrategy extends MoveCalculationStrategy {
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

@injectable()
class RookMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];

		["top", "bottom", "left", "right"].forEach((direction) => {
			const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(
				square,
				direction as Direction,
				piece.color === this._dataStore.getPlayerColor() ? "player" : "opponent"
			);
			possibleMoves.push(...this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color));
		});

		return possibleMoves;
	}
}

@injectable()
class BishopMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];

		["top_left", "bottom_left", "top_right", "bottom_right"].forEach((direction) => {
			const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(
				square,
				direction as Direction,
				piece.color === this._dataStore.getPlayerColor() ? "player" : "opponent"
			);
			possibleMoves.push(...this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color));
		});

		return possibleMoves;
	}
}

@injectable()
class KingMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];

		["top", "bottom", "left", "right", "top_left", "bottom_left", "top_right", "bottom_right"].forEach(
			(direction) => {
				const squareInDirection = this._boardNavigator.getFirstSquareInDirection(
					square,
					direction as Direction,
					piece.color === this._dataStore.getPlayerColor() ? "player" : "opponent"
				);
				if (squareInDirection) {
					possibleMoves.push(...this.endSequenceWhenEncounteredPiece([squareInDirection], piece.color));
				}
			}
		);

		return possibleMoves;
	}
}

@injectable()
class QueenMoveCalculationStrategy extends MoveCalculationStrategy {
	@inject(BoardNavigator)
	private _boardNavigator!: BoardNavigator;

	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const square = this._dataStore.getSquareById(piece.squareId);

		const possibleMoves: Square[] = [];

		["top", "bottom", "left", "right", "top_left", "bottom_left", "top_right", "bottom_right"].forEach(
			(direction) => {
				const squaresInDirection = this._boardNavigator.getAllSquaresInDirection(
					square,
					direction as Direction,
					piece.color === this._dataStore.getPlayerColor() ? "player" : "opponent"
				);
				possibleMoves.push(...this.endSequenceWhenEncounteredPiece(squaresInDirection, piece.color));
			}
		);

		return possibleMoves;
	}
}

@injectable()
class KnightMoveCalculationStrategy extends MoveCalculationStrategy {
	getPossibleMoves(piece: Piece): Square[] {
		if (!piece.squareId) return [];

		const offsets = [
			[1, 2],
			[1, -2],
			[-1, 2],
			[-1, -2],
			[2, 1],
			[2, -1],
			[-2, 1],
			[-2, -1],
		];

		const currentCoordinates = this._dataStore.getSquareById(piece.squareId).coordinates;
		const squareLayout = this._dataStore.getSquareLayout();
		return offsets
			.filter((offset) => {
				const targetXCoord = currentCoordinates.x + offset[0];
				const targetYCoord = currentCoordinates.y + offset[1];

				return targetXCoord > -1 && targetXCoord < 8 && targetYCoord > -1 && targetYCoord < 8;
			})
			.map((offset) => squareLayout[currentCoordinates.y + offset[1]][currentCoordinates.x + offset[0]])
			.filter((square) => {
				const pieceOnSquare = this._dataStore.getPieceOnSquare(square);
				if (pieceOnSquare) {
					return pieceOnSquare.color !== piece.color;
				} else {
					return true;
				}
			});
	}
}

@injectable()
export class MoveCalculationStrategyResolver {
	@inject(PawnMoveCalculationStrategy)
	private _pawnMoveCalculationStrategy!: PawnMoveCalculationStrategy;

	@inject(RookMoveCalculationStrategy)
	private _rookMoveCalculationStrategy!: RookMoveCalculationStrategy;

	@inject(BishopMoveCalculationStrategy)
	private _bishopMoveCalculationStrategy!: BishopMoveCalculationStrategy;

	@inject(KingMoveCalculationStrategy)
	private _kingMoveCalculationStrategy!: KingMoveCalculationStrategy;

	@inject(QueenMoveCalculationStrategy)
	private _queenMoveCalculationStrategy!: QueenMoveCalculationStrategy;

	@inject(KnightMoveCalculationStrategy)
	private _knightMoveCalculationStrategy!: KnightMoveCalculationStrategy;

	resolve(type: PieceType): MoveCalculationStrategy {
		switch (type) {
			case "pawn":
				return this._pawnMoveCalculationStrategy;
			case "rook":
				return this._rookMoveCalculationStrategy;
			case "bishop":
				return this._bishopMoveCalculationStrategy;
			case "king":
				return this._kingMoveCalculationStrategy;
			case "queen":
				return this._queenMoveCalculationStrategy;
			case "knight":
				return this._knightMoveCalculationStrategy;
			default:
				throw new Error("piece not found");
		}
	}
}
