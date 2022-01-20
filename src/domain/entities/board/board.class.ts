import { Square } from "./square.class";
import { Piece } from "../piece/piece.abstract";
import { BoardInitializer, PieceStartingLocations } from "./board-initializer.class";
import { PieceColor } from "../../shared/types/piece-color.type";
import { SquareColor } from "../../shared/types/square-color.type";

export class Board {
	private _squares!: Square[][];
	private _pieceIdToEntityMap = new Map<string, Piece>();
	private _squareIdToEntityMap = new Map<string, Square>();
	private _pieceLocations = new Map<Square, Piece>();
	private _boardInitializer: BoardInitializer;
	private _isStartingFirst: boolean;

	constructor(data: { boardInitializer: BoardInitializer; isStartingFirst: boolean }) {
		this._isStartingFirst = data.isStartingFirst;
		this._boardInitializer = data.boardInitializer;
		this.setSquares();
		this.placePiecesToStartingPositions(this._boardInitializer.getPieceStartingLocations());
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
		this._squares.forEach((row) => {
			squareData.push(row.map((square) => ({ id: square.id, color: square.color })));
		});

		const pieceLocations: { [squareId: string]: string } = {};

		const pieceStartingLocations = this._boardInitializer.getPieceStartingLocations();

		pieceStartingLocations.black.forEach(
			(coordinates, piece) => (pieceLocations[this._squares[coordinates.y][coordinates.x].id] = piece.id)
		);
		pieceStartingLocations.white.forEach(
			(coordinates, piece) => (pieceLocations[this._squares[coordinates.y][coordinates.x].id] = piece.id)
		);

		return {
			squareData,
			pieceLocations,
			playerColor: this._boardInitializer._playerColor,
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

	movePiece(pieceId: string, targetSquareId: string): Piece | undefined {
		const piece = this.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentSquare = this.getSquareById(piece.squareId);

		this._pieceLocations.delete(currentSquare);

		piece.squareId = targetSquareId;
		const targetSquare = this.getSquareById(targetSquareId);

		const opponentPieceOnTargetSquare = this._pieceLocations.get(targetSquare);
		if (opponentPieceOnTargetSquare) delete opponentPieceOnTargetSquare.squareId;

		this._pieceLocations.set(targetSquare, piece);
		return opponentPieceOnTargetSquare;
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

	private setSquares() {
		this._squares = this._boardInitializer.getSquares();
		for (let row of this._squares) {
			for (let square of row) {
				this._squareIdToEntityMap.set(square.id, square);
			}
		}
	}

	private placePiecesToStartingPositions(data: PieceStartingLocations) {
		data.black.forEach((coordinates, piece) => {
			const square = this._squares[coordinates.y][coordinates.x];
			this._pieceLocations.set(square, piece);
			this._pieceIdToEntityMap.set(piece.id, piece);
			piece.squareId = square.id;
		});
		data.white.forEach((coordinates, piece) => {
			const square = this._squares[coordinates.y][coordinates.x];
			this._pieceLocations.set(this._squares[coordinates.y][coordinates.x], piece);
			this._pieceIdToEntityMap.set(piece.id, piece);
			piece.squareId = square.id;
		});
	}
}

export type StartingData = {
	squareData: { id: string; color: SquareColor }[][];
	pieceLocations: { [squareId: string]: string };
	playerColor: PieceColor;
	isStartingFirst: boolean;
};
