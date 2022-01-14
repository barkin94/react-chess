import { Square } from "./square.class";
import { PieceColor } from "../shared/types/piece-color.type";
import { PieceType } from "../shared/types/piece-type.type";
import { PieceFactory } from "../piece/piece-factory.class";
import { Coordinates } from "../shared/types/coordinates.type";
import { Piece } from "../piece/piece.abstract";
import { SquareColor } from "../shared/types/square-color.type";

export class Board {
	private _squares: Square[][] = [[], [], [], [], [], [], [], []];
	private _pieceIdToEntityMap = new Map<string, Piece>();
	private _squareIdToEntityMap = new Map<string, Square>();
	private _pieceLocations = new Map<Square, Piece>();
	private _playerColor: PieceColor;
	private _pieceFactory: PieceFactory;
	private _isStartingFirst: boolean;

	constructor(data: { pieceFactory: PieceFactory; playerColor: PieceColor; isStartingFirst: boolean }) {
		this._pieceFactory = data.pieceFactory;
		this._playerColor = data.playerColor;
		this._isStartingFirst = data.isStartingFirst;
		this.initSquares(this._playerColor);

		// Place pieces of self
		this.initPieces(this._playerColor, "bottom");

		// Place pieces of opponent
		this.initPieces(this._playerColor === "black" ? "white" : "black", "top");
	}

	get pieces() {
		return Object.freeze(Array.from(this._pieceIdToEntityMap.values()));
	}

	get squares() {
		return Object.freeze(this._squares);
	}

	getPieceLocations(): StartingData["pieceLocations"] {
		const result: { [squareId: string]: string } = {};
		this.pieces.forEach((piece) => (result[piece.squareId as string] = piece.id));
		return result;
	}

	getStartingData(): StartingData {
		const squareData: StartingData["squareData"] = [];
		this.squares.forEach((row) => {
			squareData.push(row.map((square) => ({ id: square.id, color: square.color })));
		});

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
			squareData,
			pieceLocations,
			playerColor: this._playerColor,
			isStartingFirst: this._isStartingFirst,
		};
	}

	getAvailableMoves(piece: Piece) {
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentLocation = this.getSquareById(piece.squareId);

		if (!currentLocation) throw new Error("square matching with square id not found");
		return piece.getAvailableMoves(currentLocation.coordinates, this._squares);
	}

	canPieceMakeMove(pieceId: string, targetSquareId: string) {
		const piece = this.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");
		const currentSquare = this.getSquareById(piece.squareId);

		const targetSquare = this.getSquareById(targetSquareId);
		const availableMoves = piece.getAvailableMoves(currentSquare.coordinates, this._squares);
		const canMoveToLocation = availableMoves.find(
			(move) => move.x === targetSquare.coordinates.x && move.y === targetSquare.coordinates.y
		);

		return canMoveToLocation;
	}

	movePiece(pieceId: string, targetSquareId: string) {
		const piece = this.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentSquare = this.getSquareById(piece.squareId);
		this._pieceLocations.delete(currentSquare);

		piece.squareId = targetSquareId;
		const targetSquare = this.getSquareById(targetSquareId);

		const opponentPieceOnTargetSquare = this._pieceLocations.get(targetSquare);
		if (opponentPieceOnTargetSquare) delete opponentPieceOnTargetSquare.squareId;

		this._pieceLocations.set(targetSquare, piece);
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
		delete piece.squareId;
	}

	private initSquares(playerColor: PieceColor) {
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				const id = playerColor === "black" ? 8 * y + x : 64 - (8 * y + (8 - x));
				const square = Square.create(`${id}`, { x, y });
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
			this._pieceLocations.set(square, piece);
			takenSquareIds.push(square.id);
		});
	}

	private getStartingPositions(piece: PieceType, alignment: Alignment): Coordinates[] {
		const yIndexOfPawnsLine = alignment === "top" ? 1 : 6;
		const yIndexOfOthersLine = alignment === "top" ? 0 : 7;

		switch (piece) {
			case "pawn":
				return [0, 1, 2, 3, 4, 5, 6, 7].map((number) => ({
					x: number,
					y: yIndexOfPawnsLine,
				}));
			case "rook":
				return [
					{ x: 0, y: yIndexOfOthersLine },
					{ x: 7, y: yIndexOfOthersLine },
				];
			case "knight":
				return [
					{ x: 1, y: yIndexOfOthersLine },
					{ x: 6, y: yIndexOfOthersLine },
				];
			case "bishop":
				return [
					{ x: 2, y: yIndexOfOthersLine },
					{ x: 5, y: yIndexOfOthersLine },
				];
			case "queen":
				return [{ x: 3, y: yIndexOfOthersLine }];
			case "king":
				return [{ x: 4, y: yIndexOfOthersLine }];
			default:
				throw new Error("no matching piece found");
		}
	}
}

type Alignment = "top" | "bottom";

export type StartingData = {
	squareData: { id: string; color: SquareColor }[][];
	pieceLocations: { [squareId: string]: string };
	playerColor: PieceColor;
	isStartingFirst: boolean;
};
