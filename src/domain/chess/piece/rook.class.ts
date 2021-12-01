import { Coordinates } from "../shared/types/coordinates.type";
import { Square } from "../board/square.class";
import { Piece } from "./piece.abstract";
import { getAvailableMovesInDirection } from "../shared/board-navigation-helper";

export class Rook extends Piece {
	readonly type = "rook";

	getAvailableMoves(location: Coordinates, squares: Square[][]): Coordinates[] {
		let coordinates: Coordinates[] = [];

		coordinates.push(...getAvailableMovesInDirection("top", this.color, location, squares, true));
		coordinates.push(...getAvailableMovesInDirection("left", this.color, location, squares, true));
		coordinates.push(...getAvailableMovesInDirection("right", this.color, location, squares, true));
		coordinates.push(...getAvailableMovesInDirection("bottom", this.color, location, squares, true));

		return coordinates;
	}
}
