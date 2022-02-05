import { Coordinates } from "../../shared/types/coordinates.type";
import { PieceColor } from "../../shared/types/piece-color.type";
import { PieceType } from "../../shared/types/piece-type.type";
import { Square } from "../board/square.class";

export abstract class Piece {
	squareId?: string;

	constructor(public color: PieceColor, private _id: string) {}

	abstract getAvailableMoves(location: Coordinates, squareLayout: readonly Square[][]): Coordinates[];

	abstract type: PieceType;

	get id() {
		return this._id;
	}
}
