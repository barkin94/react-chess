import { Piece } from "../piece/piece.class";
import { inject, injectable } from "inversify";
import { DataStore } from "../../data-store";
import { Square } from "./square.class";
import { PieceColor } from "../../shared/types/piece-color.type";
import { MoveCalculator } from "../piece/move-calculation/move-calculator.class";
import { Side } from "../../shared/types/side.type";

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

	movePiece(pieceId: string, targetSquareId: string): MoveResult {
		if (!this.canPieceMakeMove(pieceId, targetSquareId)) {
			throw new Error("piece cannot make that move");
		}

		const piece = this._dataStore.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");

		const targetSquare = this._dataStore.getSquareById(targetSquareId);

		const opponentPieceOnTargetSquare = this._dataStore.getPieceOnSquare(targetSquare);
		if (opponentPieceOnTargetSquare) this._dataStore.emptySquare(targetSquare);

		const currentSquare = this._dataStore.getSquareById(piece.squareId);
		this._dataStore.emptySquare(currentSquare);

		this._dataStore.insertPieceOnSquare(piece, targetSquare);

		const moveResult: MoveResult = {
			capturedPiece: opponentPieceOnTargetSquare,
			pieceLocations: this.getPieceLocations(),
		};

		const isPlayerCheckMated = this.isCheckmated("player");
		const isOpponentCheckMated = this.isCheckmated("opponent");

		if (isPlayerCheckMated && isOpponentCheckMated) {
			moveResult.matchResult = "draw";
		} else if (isPlayerCheckMated) {
			moveResult.matchResult = "loss";
		} else if (isOpponentCheckMated) {
			moveResult.matchResult = "win";
		}

		return moveResult;
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

	private isCheckmated(side: Side) {
		const sideColor = this._dataStore.getColor(side);
		const checkmateSquares = this.getCheckmateSquaresOfSide(sideColor);
		const checkmateSquaresTargetedByOpponent: Square[] = [];

		const otherSideColor: PieceColor = sideColor === "black" ? "white" : "black";
		for (let pieceOfOtherSide of this.getPiecesCurrentlyOnBoard(otherSideColor)) {
			const targetedCheckmateSquares = this.getPossibleMoves(pieceOfOtherSide).filter((square) =>
				checkmateSquares.some((c) => square.id === c.id)
			);

			checkmateSquaresTargetedByOpponent.push(...targetedCheckmateSquares);

			if (checkmateSquares.length <= checkmateSquaresTargetedByOpponent.length) return true;
		}

		return false;
	}

	private getCheckmateSquaresOfSide(color: PieceColor) {
		const king = this.getPiecesCurrentlyOnBoard(color).find((piece) => piece.type === "king");

		if (!king) {
			throw new Error("king not found");
		}

		if (!king.squareId) {
			throw new Error("king is not on board");
		}

		const currentLocationOfKing = this._dataStore.getSquareById(king.squareId);
		const possibleMovesOfKing = this._moveCalculator.getPossibleMoves(king);

		return [currentLocationOfKing, ...possibleMovesOfKing];
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
	capturedPiece: Piece | undefined;
	pieceLocations: PieceLocations;
	matchResult?: "win" | "loss" | "draw";
};
