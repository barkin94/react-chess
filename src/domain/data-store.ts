import { injectable } from "inversify";
import { Square } from "./entities/board/square.class";
import { Piece } from "./entities/piece/piece.class";
import { Coordinates } from "./shared/types/coordinates.type";
import { PieceColor } from "./shared/types/piece-color.type";
import { Side } from "./shared/types/side.type";

@injectable()
export class DataStore {
	private _squareLayout: Square[][] = [];
	private _pieceIdToEntityMap = new Map<string, Piece>();
	private _squareIdToEntityMap = new Map<string, Square>();
	private _pieceLocations = new Map<Square, Piece>();
	private _playerColor!: PieceColor;

	clearPieceLocations() {
		this._pieceLocations.clear();
		this._pieceIdToEntityMap.forEach((piece) => delete piece.squareId);
	}

	getColor(side: Side): PieceColor {
		if (!this._playerColor) throw new Error("player color not found");

		if (side === "player") {
			return this._playerColor;
		} else {
			return this._playerColor === "white" ? "black" : "white";
		}
	}

	setPlayerColor(color: PieceColor) {
		this._playerColor = color;
	}

	setSquareLayout(layout: Square[][]) {
		this._squareLayout = layout;
		for (let row of this._squareLayout) {
			for (let square of row) {
				this._squareIdToEntityMap.set(square.id, square);
			}
		}
	}

	getSquareLayout() {
		return Object.freeze(this._squareLayout);
	}

	getSquareByCoordinates(coordinates: Coordinates) {
		return this._squareLayout[coordinates.y][coordinates.x];
	}

	insertPieceOnSquare(piece: Piece, square: Square) {
		this._pieceIdToEntityMap.set(piece.id, piece);
		piece.squareId = square.id;
		this._pieceLocations.set(square, piece);
	}

	getPieceLocations() {
		return Object.freeze(this._pieceLocations);
	}

	getPieces() {
		return Array.from(this._pieceIdToEntityMap.values());
	}

	emptySquare(square: Square) {
		this._pieceLocations.delete(square);
	}

	isSquareEmpty(square: Square) {
		return !!this._pieceLocations.get(square);
	}

	getPieceOnSquare(square: Square) {
		return this._pieceLocations.get(square);
	}

	getSquareById(id: string) {
		const square = this._squareIdToEntityMap.get(id);

		if (!square) throw new Error("square not found");

		return square;
	}

	getPieceById(id: string) {
		const piece = this._pieceIdToEntityMap.get(id);

		if (!piece) throw new Error("piece not found");

		return piece;
	}
}
