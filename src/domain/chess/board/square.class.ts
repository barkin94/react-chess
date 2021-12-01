import { Coordinates } from "../shared/types/coordinates.type";
import { PieceColor } from "../shared/types/piece-color";
import { Piece } from "../piece/piece.abstract";

export class Square {
	private _piece?: Piece;
	private _color: PieceColor;
	private _id: string;

	private constructor(private _coordinates: Coordinates) {
		this._color = this.calculateColor(this.coordinates);
		const chars = "abcdefgh";
		this._id = chars[_coordinates.x] + _coordinates.y;
	}

	get id() {
		return this._id;
	}

	get color() {
		return this._color;
	}

	get piece() {
		return this._piece;
	}

	get coordinates() {
		return this._coordinates;
	}

	static create(coordinates: Coordinates) {
		return new Square(coordinates);
	}

	private calculateColor(coordinates: Coordinates): PieceColor {
		if (coordinates.y % 2 === 1) {
			return coordinates.x % 2 === 1 ? "white" : "black";
		} else {
			return coordinates.x % 2 === 1 ? "black" : "white";
		}
	}
}
