import { Coordinates } from "../shared/types/coordinates.type";
import { Square } from "../board/square.class";
import { Piece } from "./piece.abstract";
import { collidesWithSameColoredPiece } from "../shared/board-navigation-helper";

export class Knight extends Piece {
	readonly type = "knight";

	getAvailableMoves(location: Coordinates, squareLayout: Square[][]): Coordinates[] {
		const coordinates = [
			[1, 2],
			[1, -2],
			[-1, 2],
			[-1, -2],
			[2, 1],
			[2, -1],
			[-2, 1],
			[-2, -1],
		];

		return coordinates
			.filter((c) => {
				const targetXCoordinate = location.x + c[0];
				const targetYCoordinate = location.y + c[1];

				if (targetXCoordinate < 0 || targetXCoordinate > 7 || targetYCoordinate < 0 || targetYCoordinate > 7) {
					return false;
				}

				const targetCoordinateOnBoard = squareLayout[targetYCoordinate][targetXCoordinate];
				return !collidesWithSameColoredPiece(targetCoordinateOnBoard, this.color);
			})
			.map((c) => ({ x: location.x + c[0], y: location.y + c[1] }));
	}
}
