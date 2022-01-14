import { Coordinates } from "../shared/types/coordinates.type";
import { SquareColor } from "../shared/types/square-color.type";
import { Piece } from "../piece/piece.abstract";

export class Square {
	private _piece?: Piece;
	private _color: SquareColor;

	private constructor(private _id: string, private _coordinates: Coordinates) {
		this._color = this.calculateColor(this.coordinates);
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

	static create(id: string, coordinates: Coordinates) {
		return new Square(id, coordinates);
	}

	private calculateColor(coordinates: Coordinates): SquareColor {
		if (coordinates.y % 2 === 1) {
			return coordinates.x % 2 === 1 ? "wheat" : "chocolate";
		} else {
			return coordinates.x % 2 === 1 ? "chocolate" : "wheat";
		}
	}
}
