import { inject, injectable } from "inversify";
import { DataStore } from "../../data-store";
import { PieceColor, Side } from "../../shared";
import { MoveCalculator } from "../piece/move-calculation/move-calculator.class";
import { Piece } from "../piece/piece.class";
import { Square } from "./square.class";

@injectable()
export class Board {
	@inject(DataStore)
	private _dataStore!: DataStore;

	@inject(MoveCalculator)
	private _moveCalculator!: MoveCalculator;

	getPieceLocations(): PieceLocations {
		return this._dataStore.getPieceLocations();
	}

	getPossibleMoves(piece: Piece) {
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentLocation = this._dataStore.getSquareById(piece.squareId);

		if (!currentLocation) throw new Error("square matching with square id not found");

		return this._moveCalculator.getPossibleMoves(piece);
	}

	movePiece(pieceId: string, targetSquareId: string): ChessEvent[] {
		let events: ChessEvent[] = [];

		if (!this.canPieceMakeMove(pieceId, targetSquareId))
			throw new Error("piece cannot make that move");

		const piece = this._dataStore.getPieceById(pieceId);
		if (!piece.squareId)
			throw new Error("piece is not on the board");

		const targetSquare = this._dataStore.getSquareById(targetSquareId);

		const opponentPieceOnTargetSquare = this._dataStore.getPieceOnSquare(targetSquare);
		if (opponentPieceOnTargetSquare) {
			this._dataStore.emptySquare(targetSquare);
			events.push({ type: "capture", capturedPieceId: opponentPieceOnTargetSquare.id });
		}

		const currentSquare = this._dataStore.getSquareById(piece.squareId);
		this._dataStore.emptySquare(currentSquare);
		this._dataStore.insertPieceOnSquare(piece, targetSquare);
		events.push({ type: "move", pieceId: piece.id, targetSquareId: targetSquare.id });

		var piecethatCheckedPlayerKing = this.isChecked("player");
		if (piecethatCheckedPlayerKing)
			events.push({ type: "check", attackerId: piecethatCheckedPlayerKing.id });

		var piecethatCheckedOpponentKing = this.isChecked("opponent");
		if (piecethatCheckedOpponentKing)
			events.push({ type: "check", attackerId: piecethatCheckedOpponentKing.id });

		const isPlayerCheckMated = this.isCheckmated("player");
		const isOpponentCheckMated = this.isCheckmated("opponent");

		if (isPlayerCheckMated || isOpponentCheckMated) 
			events = events.filter(e => e.type !== "check");

		if (isPlayerCheckMated && isOpponentCheckMated)
			events.push({ type: "match-end" });
		else if (isPlayerCheckMated)
			events.push({ type: "match-end", winner: this._dataStore.getColor("opponent") });
		else if (isOpponentCheckMated)
			events.push({ type: "match-end", winner: this._dataStore.getColor("player") });

		return events;
	}

	private canPieceMakeMove(pieceId: string, targetSquareId: string) {
		const piece = this._dataStore.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");

		const targetSquare = this._dataStore.getSquareById(targetSquareId);
		const canMoveToLocation = this._moveCalculator
			.getPossibleMoves(piece)
			.find((possibleMoveSquare) => possibleMoveSquare.id === targetSquare.id);

		return canMoveToLocation;
	}

	/**
	 * Checks if a side is checked.
	 * @param side
S	 * @returns The piece that initiated a check if there is any
	 */
	private isChecked(side: Side): Piece | null {
		const sideColor = this._dataStore.getColor(side);
		const king = this.getKingOfColor(sideColor);
		const squareKingIsOn = this.getTheSquarePieceIsOn(king);

		const otherSideColor: PieceColor = sideColor === "black" ? "white" : "black";

		for (let pieceOfOtherSide of this.getPiecesCurrentlyOnBoard(otherSideColor)) {
			const otherKingSquare = this.getPossibleMoves(pieceOfOtherSide)
				.filter(square => {
					return square.id === squareKingIsOn.id
				});

			if (otherKingSquare) return pieceOfOtherSide;
		}

		return null;
	}

	private isCheckmated(side: Side) {
		const sideColor = this._dataStore.getColor(side);
		const targetKing = this.getKingOfColor(sideColor);
		const possibleMovesOfKing = this.getPossibleMoves(targetKing);
		const blockedEscapeSquareIdsOfKing = new Set<string>();
		const otherSideColor: PieceColor = sideColor === "black" ? "white" : "black";
		let isKingThreatened = false;
		
		for (let pieceOfOtherSide of this.getPiecesCurrentlyOnBoard(otherSideColor)) {
			const pieceMoves = this.getPossibleMoves(pieceOfOtherSide);
			
			if (!isKingThreatened)
				isKingThreatened = !!pieceMoves.find((square) => square.id === targetKing.squareId);
			
			pieceMoves
				.filter((square) => possibleMovesOfKing.some((c) => square.id === c.id))
				.map((square) => square.id)
				.forEach((id) => {
					blockedEscapeSquareIdsOfKing.add(id);
				});

			if (isKingThreatened && possibleMovesOfKing.length <= blockedEscapeSquareIdsOfKing.size) return true;
		}

		return false;
	}

	private getTheSquarePieceIsOn(piece: Piece) {
		if (!piece.squareId) {
			throw new Error("piece is not on board");
		}

		return this._dataStore.getSquareById(piece.squareId);
	}

	private getKingOfColor(color: PieceColor) {
		const king = this.getPiecesCurrentlyOnBoard(color).find((piece) => piece.type === "king");

		if (!king) {
			throw new Error("king not found");
		}

		return king;
	}

	private getPiecesCurrentlyOnBoard(color?: PieceColor) {
		let piecesOnBoard = Array.from(this._dataStore.getPieceLocations().values());

		if (color) {
			piecesOnBoard = piecesOnBoard.filter((piece) => piece.color === color);
		}

		return piecesOnBoard;
	}
}

export type PieceLocations = Map<Square, Piece>;

export type MoveResult = {
	pieceLocations: PieceLocations;
	events: ChessEvent[];
};

export type ChessEvent =
	| { type: "move"; pieceId: string; targetSquareId: string }
	| { type: "capture"; capturedPieceId: string; }
	| { type: "match-end"; winner?: PieceColor; }
	| { type: "check"; attackerId: string; };
