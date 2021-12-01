import { Square } from "./square.class";
import { PieceColor } from "../shared/types/piece-color";
import { PieceType } from "../shared/types/piece-type";
import { PieceFactory } from "../piece/piece-factory.class";
import { Coordinates } from "../shared/types/coordinates.type";
import { Piece } from "../piece/piece.abstract";

export class Board {
	private _squares: Square[][] = [[], [], [], [], [], [], [], []];
	private _pieceIdToEntityMap = new Map<string, Piece>();
	private _squareIdToEntityMap = new Map<string, Square>();
	//private _pieceLocations = new Map<string, string>();

	constructor(private _playerColor: PieceColor, private _pieceFactory: PieceFactory) {
		this.initSquares();

		// Place pieces of self
		this.initPieces(this._playerColor, "bottom");

		// Place pieces of opponent
		this.initPieces(this._playerColor === "black" ? "white" : "black", "top");
	}

	get pieceLocations(): { [squareId: string]: string | undefined } {
		const result: { [squareId: string]: string } = {};
		this.pieces.forEach((piece) => (result[piece.squareId as string] = piece.id));
		return result;
	}

	get startingData(): StartingData {
		const squares = this.squares;
		const pieces = this.pieces;
		const pieceLocations: { [squareId: string]: string } = {};

		pieces.forEach((piece) => {
			const startingCoordinates = this.getStartingPositions(
				piece.type,
				this._playerColor === piece.color ? "bottom" : "top"
			);

			for (let coordinate of startingCoordinates) {
				const squareId = this.squares[coordinate.y][coordinate.x].id;

				if (!pieceLocations[squareId]) {
					pieceLocations[squareId] = piece.id;
					break;
				}
			}
		});

		return {
			squares,
			pieces,
			pieceLocations,
			playerColor: this._playerColor,
		};
	}

	get pieces() {
		return Object.freeze(Array.from(this._pieceIdToEntityMap.values()));
	}

	get squares() {
		return Object.freeze(this._squares);
	}

	getAvailableMoves(piece: Piece) {
		// const squareId = this._pieceLocations.get(piece.id);
		// if (!squareId) throw new Error("piece is not on the board");

		// const pieceLocation = this._squareIdToEntityMap.get(squareId);
		// if (!pieceLocation) throw new Error("square matching with square id not found");
		// return piece.getAvailableMoves(pieceLocation.coordinates, this._squares);

		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentLocation = this.getSquareById(piece.squareId);

		if (!currentLocation) throw new Error("square matching with square id not found");
		return piece.getAvailableMoves(currentLocation.coordinates, this._squares);
	}

	movePiece(pieceId: string, targetSquareId: string) {
		const piece = this.getPieceById(pieceId);

		if (!piece.squareId) throw new Error("piece is not on the board");

		const targetSquare = this.getSquareById(targetSquareId);

		const currentSquare = this.getSquareById(piece.squareId);
		const availableMoves = piece.getAvailableMoves(currentSquare.coordinates, this._squares);

		const canMoveToLocation = availableMoves.find(
			(move) => move.x === targetSquare.coordinates.x && move.y === targetSquare.coordinates.y
		);

		if (!canMoveToLocation) {
			throw new Error("can't make that move");
		}

		piece.squareId = targetSquareId;
		// currentSquare.removePiece();
		// targetSquare.placePiece(piece);
		//this._pieceLocations.set(pieceId, targetSquareId);
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

	removePieceFromBoard(piece: Piece) {
		//this._pieceLocations.delete(piece.id);
		delete piece.squareId;
	}

	private initSquares() {
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				const square = Square.create({ x, y });
				this._squares[y][x] = square;
				this._squareIdToEntityMap.set(square.id, square);
			}
		}
	}

	private initPieces(color: PieceColor, alignment: Alignment) {
		const takenSquareIds: string[] = [];

		const pieces = this._pieceFactory.getPieces(color);

		pieces.forEach((piece) => {
			this._pieceIdToEntityMap.set(piece.id, piece);
			const startingCoordinates = this.getStartingPositions(piece.type, alignment);

			const coordinate = startingCoordinates.find((c) => {
				const square = this._squares[c.y][c.x];
				return !takenSquareIds.includes(square.id);
			}) as Coordinates;

			const square = this._squares[coordinate.y][coordinate.x];
			//square.placePiece(piece);
			piece.squareId = square.id;
			takenSquareIds.push(square.id);
			//this._pieceLocations.set(piece.id, square.id);
		});
	}

	private getStartingPositions(piece: PieceType, alignment: Alignment): Coordinates[] {
		const yIndexOfLine1 = alignment === "top" ? 0 : 7;
		const yIndexOfLine2 = alignment === "top" ? 1 : 6;

		switch (piece) {
			case "pawn":
				return [0, 1, 2, 3, 4, 5, 6, 7].map((number) => ({
					x: number,
					y: yIndexOfLine2,
				}));
			case "rook":
				return [
					{ x: 0, y: yIndexOfLine1 },
					{ x: 7, y: yIndexOfLine1 },
				];
			case "knight":
				return [
					{ x: 1, y: yIndexOfLine1 },
					{ x: 6, y: yIndexOfLine1 },
				];
			case "bishop":
				return [
					{ x: 2, y: yIndexOfLine1 },
					{ x: 5, y: yIndexOfLine1 },
				];
			case "queen":
				return [{ x: 3, y: yIndexOfLine1 }];
			case "king":
				return [{ x: 4, y: yIndexOfLine1 }];
			default:
				throw new Error("no matching piece found");
		}
	}
}

type Alignment = "top" | "bottom";

export type StartingData = {
	squares: readonly Square[][];
	pieces: readonly Piece[];
	pieceLocations: { [squareId: string]: string };
	playerColor: PieceColor;
};
