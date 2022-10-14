import { inject, injectable } from "inversify";
import { DataStore } from "../../data-store";
import { Direction, PieceColor, Side } from "../../shared";
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

	getPossibleMovesArray(piece: Piece): Square[] {
		if (!piece.squareId) throw new Error("piece is not on the board");

		const currentLocation = this._dataStore.getSquareById(piece.squareId);

		if (!currentLocation) throw new Error("square matching with square id not found");

		return this.flattenPossibleMoves(this._moveCalculator.getPossibleMoves(piece));
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

	private canPieceMakeMove(pieceId: string, targetSquareId: string): boolean {
		const piece = this._dataStore.getPieceById(pieceId);
		if (!piece.squareId) throw new Error("piece is not on the board");

		const targetSquare = this._dataStore.getSquareById(targetSquareId);
		const canMoveToLocation = this.getPossibleMovesArray(piece)
			.some((possibleMoveSquare) => possibleMoveSquare.id === targetSquare.id);

		return canMoveToLocation;
	}

	private isChecked(side: Side): Piece | null {
		const sideColor = this._dataStore.getColor(side);
		const king = this.getKingOfColor(sideColor);
		const squareKingIsOn = this.getTheSquarePieceIsOn(king);

		const otherSideColor: PieceColor = sideColor === "black" ? "white" : "black";

		for (let pieceOfOtherSide of this.getPiecesCurrentlyOnBoard(otherSideColor)) {
			const otherKingSquare = this.getPossibleMovesArray(pieceOfOtherSide)
				.filter(square => {
					return square.id === squareKingIsOn.id
				});

			if (otherKingSquare) return pieceOfOtherSide;
		}

		return null;
	}

	private isCheckmated(side: Side) {
		const sideColor = this._dataStore.getColor(side);
		const otherSideColor: PieceColor = sideColor === "black" ? "white" : "black";
		const targetKing = this.getKingOfColor(sideColor);
		const possibleMovesOfKing = this.getPossibleMovesArray(targetKing);	
		const blockedEscapeSquareIdsOfKing = new Set<string>();
		const listOfMoveSequencesTargetingKing: Square[][] = [];
		
		for(let piece of this.getPiecesCurrentlyOnBoard(otherSideColor)) {
			const movesInDirections = this._moveCalculator.getPossibleMoves(piece);

			// Find other side's pieces that are targeting the given side's king and save their route towards king
			const moveSequenceTargetingKing = Array.from(movesInDirections.values())
				.find(moveSequence => moveSequence[moveSequence.length - 1].id === targetKing.squareId);
			
			moveSequenceTargetingKing && listOfMoveSequencesTargetingKing.push(moveSequenceTargetingKing);
			//---------------------------------------------------------------

			// Mark the blocked escape squares of king
			this.flattenPossibleMoves(movesInDirections)
				.filter((square) => possibleMovesOfKing.some((c) => square.id === c.id))
				.map((square) => square.id)
				.forEach((id) => {
					blockedEscapeSquareIdsOfKing.add(id);
				});
			// ---------------------------------------------------------
		}

		// Check if any piece of given side can block other side's pieces targeting their king
		const piecesOfSideOtherExceptKing = 
			this.getPiecesCurrentlyOnBoard(sideColor).filter(p => p.type !== "king");

		for (let pieceOfSide of piecesOfSideOtherExceptKing) {
			const movesOfPieceOfSide = this.getPossibleMovesArray(pieceOfSide)
			
			const sequenceIndex = listOfMoveSequencesTargetingKing.findIndex(squareSequence => 
				squareSequence.some(square => movesOfPieceOfSide.some(s => s.id === square.id))
				);
			
			if(sequenceIndex > -1) {
				listOfMoveSequencesTargetingKing.splice(sequenceIndex, 1);
			}
		}
		//----------------------------------------------------------------------------

		// If king has nowhere to escape while being targeted, it is a checkmate. 
		return listOfMoveSequencesTargetingKing.length && possibleMovesOfKing.length === blockedEscapeSquareIdsOfKing.size;
	}

	private flattenPossibleMoves(map: Map<Direction, Square[]>) {
		return Array.from(map.values())
			.reduce((flattenedSquares, squaresInDirection) => {
				flattenedSquares.push(...squaresInDirection)
				
				return flattenedSquares;
			}, []);
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
