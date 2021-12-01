import { Coordinates } from "../shared/types/coordinates.type";
import { PieceColor } from "../shared/types/piece-color";
import { PieceType } from "../shared/types/piece-type";
import { Square } from "../board/square.class";

export abstract class Piece {
	squareId?: string;

	constructor(public color: PieceColor, private _id: string) {}

	abstract getAvailableMoves(location: Coordinates, squareLayout: Square[][]): Coordinates[];

	abstract readonly type: PieceType;

	get id() {
		return this._id;
	}
}
