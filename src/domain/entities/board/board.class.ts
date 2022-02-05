import { Piece } from "../piece/piece.abstract";
import { inject, injectable } from "inversify";
import { DataStore } from "../../data-store";
import { Square } from "./square.class";

@injectable()
export class Board {
	@inject(DataStore)
	private _dataStore!: DataStore;

	getPieceLocations(): PieceLocations {
		const map = new Map<Square, Piece>();
		this._dataStore
			.getPieces()
			.forEach((piece) => map.set(this._dataStore.getSquareById(piece.squareId as string), piece));
		return map;
	}

	getAvailableMoves(piece: Piece) {
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentLocation = this._dataStore.getSquareById(piece.squareId);

		if (!currentLocation) throw new Error("square matching with square id not found");
		return piece.getAvailableMoves(currentLocation.coordinates, this._dataStore.getSquareLayout());
	}

	canPieceMakeMove(pieceId: string, targetSquareId: string) {
		const piece = this._dataStore.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");
		const currentSquare = this._dataStore.getSquareById(piece.squareId);

		const targetSquare = this._dataStore.getSquareById(targetSquareId);
		const availableMoves = piece.getAvailableMoves(currentSquare.coordinates, this._dataStore.getSquareLayout());
		const canMoveToLocation = availableMoves.find(
			(move: any) => move.x === targetSquare.coordinates.x && move.y === targetSquare.coordinates.y
		);

		return canMoveToLocation;
	}

	movePiece(pieceId: string, targetSquareId: string): MoveResult {
		const piece = this._dataStore.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentSquare = this._dataStore.getSquareById(piece.squareId);

		this._dataStore.emptySquare(currentSquare);

		piece.squareId = targetSquareId;
		const targetSquare = this._dataStore.getSquareById(targetSquareId);

		const opponentPieceOnTargetSquare = this._dataStore.getPieceOnSquare(targetSquare);
		if (opponentPieceOnTargetSquare) delete opponentPieceOnTargetSquare.squareId;

		this._dataStore.insertPieceOnSquare(piece, targetSquare);

		return {
			killedPiece: opponentPieceOnTargetSquare,
			pieceLocations: this.getPieceLocations(),
			isCheckmated: this.isCheckmated(),
		};
	}

	private isCheckmated(): boolean {
		const playerColor = this._dataStore.getPlayerColor();
		const playerKingPiece = this._dataStore
			.getPieces()
			.find((piece) => piece.color === playerColor && piece.type === "king");

		if (!playerKingPiece) {
			throw new Error("king not found");
		}

		if (!playerKingPiece.squareId) {
			throw new Error("king is not on board");
		}

		const kingCoordinates = this._dataStore.getSquareById(playerKingPiece.squareId).coordinates;
		const availableMoves = playerKingPiece.getAvailableMoves(kingCoordinates, this._dataStore.getSquareLayout());

		return !availableMoves.length;
	}
}

export type PieceLocations = Map<Square, Piece>;
export type MoveResult = { killedPiece: Piece | undefined; pieceLocations: PieceLocations; isCheckmated: boolean };
