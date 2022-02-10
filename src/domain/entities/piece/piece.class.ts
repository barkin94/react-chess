import { PieceColor } from "../../shared/types/piece-color.type";
import { PieceType } from "../../shared/types/piece-type.type";

export class Piece {
	squareId?: string;

	constructor(private _type: PieceType, private _color: PieceColor, private _id: string) {}

	get color() {
		return this._color;
	}

	get type() {
		return this._type;
	}

	get id() {
		return this._id;
	}

	static create(pieceType: PieceType, color: PieceColor, id: string) {
		return new Piece(pieceType, color, id);
	}
}
