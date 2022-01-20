import { Square } from "../board/square.class";
import { Piece } from "./piece.abstract";
import { getAvailableMovesInDirection } from "../../shared/board-navigation-helper";
import { Coordinates } from "../../shared/types/coordinates.type";

export class Pawn extends Piece {
	readonly type = "pawn";

	getAvailableMoves(location: Coordinates, squares: Square[][]): Coordinates[] {
		return getAvailableMovesInDirection("top", this.color, location, squares);
	}
}
