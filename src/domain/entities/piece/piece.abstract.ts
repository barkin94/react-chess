import { PieceColor } from "../../shared/types/piece-color.type";
import { PieceType } from "../../shared/types/piece-type.type";

export abstract class Piece {
	squareId?: string;

	constructor(public color: PieceColor, private _id: string) {}

	abstract type: PieceType;

	get id() {
		return this._id;
	}
}
