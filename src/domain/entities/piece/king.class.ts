import { Square } from "../board/square.class";
import { Piece } from "./piece.abstract";
import { getAvailableMovesInDirection } from "../../shared/board-navigation-helper";
import { Coordinates } from "../../shared/types/coordinates.type";

export class King extends Piece {
	readonly type = "king";

	getAvailableMoves(location: Coordinates, squares: Square[][]): Coordinates[] {
		let coordinates: Coordinates[] = [];

		coordinates.push(...getAvailableMovesInDirection("top_right", this.color, location, squares));
		coordinates.push(...getAvailableMovesInDirection("top_left", this.color, location, squares));
		coordinates.push(...getAvailableMovesInDirection("bottom_left", this.color, location, squares));
		coordinates.push(...getAvailableMovesInDirection("bottom_right", this.color, location, squares));
		coordinates.push(...getAvailableMovesInDirection("top", this.color, location, squares));
		coordinates.push(...getAvailableMovesInDirection("left", this.color, location, squares));
		coordinates.push(...getAvailableMovesInDirection("right", this.color, location, squares));
		coordinates.push(...getAvailableMovesInDirection("bottom", this.color, location, squares));

		return coordinates;
	}
}
