import { Piece } from "../piece/piece.class";
import { inject, injectable } from "inversify";
import { DataStore } from "../../data-store";
import { Square } from "./square.class";
import { MoveCalculationStrategyResolver } from "../piece/move-calculation/move-calculation-strategy-resolver";
import { PieceColor } from "../../shared/types/piece-color.type";

@injectable()
export class Board {
	@inject(DataStore)
	private _dataStore!: DataStore;

	@inject(MoveCalculationStrategyResolver)
	private _moveCalculationStrategyResolver!: MoveCalculationStrategyResolver;

	getPieceLocations(): PieceLocations {
		return this._dataStore.getPieceLocations();
	}

	getPossibleMoves(piece: Piece) {
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentLocation = this._dataStore.getSquareById(piece.squareId);

		if (!currentLocation) throw new Error("square matching with square id not found");

		return this._moveCalculationStrategyResolver.resolve(piece.type).getPossibleMoves(piece);
	}

	movePiece(pieceId: string, targetSquareId: string): MoveResult {
		if (!this.canPieceMakeMove(pieceId, targetSquareId)) {
			throw new Error("piece cannot make that move");
		}

		const piece = this._dataStore.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentSquare = this._dataStore.getSquareById(piece.squareId);
		this._dataStore.emptySquare(currentSquare);

		piece.squareId = targetSquareId;
		const targetSquare = this._dataStore.getSquareById(targetSquareId);

		const opponentPieceOnTargetSquare = this._dataStore.getPieceOnSquare(targetSquare);
		if (opponentPieceOnTargetSquare) delete opponentPieceOnTargetSquare.squareId;

		this._dataStore.insertPieceOnSquare(piece, targetSquare);

		const moveResult: MoveResult = {
			capturedPiece: opponentPieceOnTargetSquare,
			pieceLocations: this.getPieceLocations(),
		};

		const isPlayerCheckMated = this.isCheckmated(this._dataStore.getColor("player"));
		const opponentColor: PieceColor = this._dataStore.getColor("opponent");
		const isOpponentCheckMated = this.isCheckmated(opponentColor);

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
		const moveCalculationStrategy = this._moveCalculationStrategyResolver.resolve(piece.type);
		const canMoveToLocation = moveCalculationStrategy
			.getPossibleMoves(piece)
			.find((possibleMoveSquare) => possibleMoveSquare.id === targetSquare.id);

		return canMoveToLocation;
	}

	private isCheckmated(sideColor: PieceColor) {
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
		const possibleMovesOfKing = this._moveCalculationStrategyResolver.resolve(king.type).getPossibleMoves(king);

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
