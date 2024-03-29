import { inject, injectable } from "inversify";
import { DataStore } from "../../../data-store";
import { Coordinates, Direction, NonKnightDirection, Side } from "../../../shared";
import { Square } from "../../board/square.class";

@injectable()
export class BoardNavigator {
	@inject(DataStore) private _dataStore!: DataStore;

	private _directionOffsetCoordinates: Record<Exclude<Direction, "knight_specific">, Coordinates> = {
		top: { x: 0, y: -1 },
		top_right: { x: 1, y: -1 },
		right: { x: 1, y: 0 },
		bottom_right: { x: 1, y: 1 },
		bottom: { x: 0, y: 1 },
		bottom_left: { x: -1, y: 1 },
		left: { x: -1, y: 0 },
		top_left: { x: -1, y: -1 },
	};

	getFirstSquareInDirection(source: Square, direction: NonKnightDirection, relativeTo: Side): Square | null {
		let nextYCoordinate =
			source.coordinates.y + this._directionOffsetCoordinates[direction].y * (relativeTo === "player" ? 1 : -1);
		let nextXCoordinate = source.coordinates.x + this._directionOffsetCoordinates[direction].x;

		if (nextXCoordinate < 8 && nextXCoordinate > -1 && nextYCoordinate < 8 && nextYCoordinate > -1) {
			return this._dataStore.getSquareLayout()[nextYCoordinate][nextXCoordinate];
		} else {
			return null;
		}
	}

	getAllSquaresInDirection(source: Square, direction: Exclude<Direction, "knight_specific">, relativeTo: Side): Square[] {
		let nextYCoordinate =
			source.coordinates.y + this._directionOffsetCoordinates[direction].y * (relativeTo === "player" ? 1 : -1);
		let nextXCoordinate = source.coordinates.x + this._directionOffsetCoordinates[direction].x;

		let squares: Square[] = [];
		let nextSquareExists =
			nextXCoordinate < 8 && nextXCoordinate > -1 && nextYCoordinate < 8 && nextYCoordinate > -1;

		while (nextSquareExists) {
			const nextSquare = this._dataStore.getSquareLayout()[nextYCoordinate][nextXCoordinate];
			squares.push(nextSquare);
			nextXCoordinate += this._directionOffsetCoordinates[direction].x;
			nextYCoordinate += this._directionOffsetCoordinates[direction].y * (relativeTo === "player" ? 1 : -1);
			nextSquareExists =
				nextXCoordinate < 8 && nextXCoordinate > -1 && nextYCoordinate < 8 && nextYCoordinate > -1;
		}

		return squares;
	}
}

