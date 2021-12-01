import { Coordinates } from "../shared/types/coordinates.type";
import { Square } from "../board/square.class";
import { Piece } from "./piece.abstract";

export class Knight extends Piece {
	readonly type = "knight";

	getAvailableMoves(location: Coordinates, squareLayout: Square[][]): Coordinates[] {
		if (squareLayout[location.y + 1]) return [{ x: location.x, y: location.y + 1 }];
		else return [];
	}
}
