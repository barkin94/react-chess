import { Coordinates } from "../shared/types/coordinates.type";
import { Square } from "../board/square.class";
import { Piece } from "./piece.abstract";
import { getAvailableMovesInDirection } from "../shared/board-navigation-helper";

export class Bishop extends Piece {
	readonly type = "bishop";

	getAvailableMoves(location: Coordinates, squares: Square[][]): Coordinates[] {
		let coordinates: Coordinates[] = [];

		coordinates.push(...getAvailableMovesInDirection("top_right", this.color, location, squares, true));
		coordinates.push(...getAvailableMovesInDirection("top_left", this.color, location, squares, true));
		coordinates.push(...getAvailableMovesInDirection("bottom_left", this.color, location, squares, true));
		coordinates.push(...getAvailableMovesInDirection("bottom_right", this.color, location, squares, true));

		return coordinates;
	}
}
