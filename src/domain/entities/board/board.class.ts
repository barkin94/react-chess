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
			killedPiece: opponentPieceOnTargetSquare,
			pieceLocations: this.getPieceLocations(),
		};

		const isPlayerCheckMated = this.isCheckmated(this._dataStore.getPlayerColor());
		const opponentColor: PieceColor = this._dataStore.getPlayerColor() === "black" ? "white" : "black";
		const isOpponentCheckMated = this.isOpponentKingInAttackRangeOfPiece(piece) && this.isCheckmated(opponentColor);

		if (isPlayerCheckMated && isOpponentCheckMated) {
			moveResult.matchResult = "stalemate";
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

	private isCheckmated(side: PieceColor) {
		const possibleMovesOfKing = this.getPossibleMovesOfKing(side);
		const otherSideColor: PieceColor = side === "black" ? "white" : "black";

		const unavailableMovesOfKing: Square[] = [];

		for (let pieceOfOtherSide of this.getPiecesCurrentlyOnBoard(otherSideColor)) {
			const unavailableKingMove = this.getPossibleMoves(pieceOfOtherSide).find((s) =>
				possibleMovesOfKing.find((m) => s.id === m.id)
			);

			if (unavailableKingMove) {
				unavailableMovesOfKing.push(unavailableKingMove);
			}

			if (possibleMovesOfKing.length === unavailableMovesOfKing.length) return true;
		}

		return false;
	}

	private isOpponentKingInAttackRangeOfPiece(piece: Piece) {
		const opponentColor = this._dataStore.getPlayerColor() === "white" ? "black" : "white";
		const opponentKing = this.getPiecesCurrentlyOnBoard(opponentColor).find((p) => p.type === "king");

		if (!opponentKing) {
			throw new Error("king not found");
		}

		if (!opponentKing.squareId) {
			throw new Error("king is not on board");
		}

		return !!this.getPossibleMoves(piece).find((square) => square.id === opponentKing.squareId);
	}

	private getPossibleMovesOfKing(color: PieceColor) {
		const opponentKing = this._dataStore
			.getPieces()
			.find((piece) => piece.color === color && piece.type === "king");

		if (!opponentKing) {
			throw new Error("king not found");
		}

		if (!opponentKing.squareId) {
			throw new Error("king is not on board");
		}

		return this._moveCalculationStrategyResolver.resolve(opponentKing.type).getPossibleMoves(opponentKing);
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
	killedPiece: Piece | undefined;
	pieceLocations: PieceLocations;
	matchResult?: "win" | "loss" | "stalemate";
};
