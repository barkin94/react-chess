import { injectable } from "inversify";
import { Direction } from "../../../shared";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";

@injectable()
export class KnightMoveCalculationStrategy extends MoveCalculationStrategy {
	getPossibleMoves(piece: Piece): Map<Direction, Square[]> {
		if (!piece.squareId) return new Map();

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

		const possibleMoves = new Map<Direction, Square[]>();
		possibleMoves.set("knight_specific", []);

		offsets
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
			}).forEach(square => possibleMoves.get("knight_specific")!.push(square))

		if(!possibleMoves.get("knight_specific")!.length)
			possibleMoves.delete("knight_specific");

		return possibleMoves;
	}
}
