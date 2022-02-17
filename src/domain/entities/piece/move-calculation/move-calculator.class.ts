import { inject, injectable } from "inversify";
import { Square } from "../../board/square.class";
import { Piece } from "../piece.class";
import { BishopMoveCalculationStrategy } from "./bishop-move-calculation-strategy.class";
import { KingMoveCalculationStrategy } from "./king-move-calculation-strategy.class";
import { KnightMoveCalculationStrategy } from "./knight-move-calculation-strategy.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";
import { PawnMoveCalculationStrategy } from "./pawn-move-calculation-strategy.class";
import { QueenMoveCalculationStrategy } from "./queen-move-calculation-strategy.class";
import { RookMoveCalculationStrategy } from "./rook-move-calculation-strategy.class";

@injectable()
export class MoveCalculator {
	@inject(PawnMoveCalculationStrategy)
	private _pawnMoveCalculationStrategy!: PawnMoveCalculationStrategy;

	@inject(RookMoveCalculationStrategy)
	private _rookMoveCalculationStrategy!: RookMoveCalculationStrategy;

	@inject(BishopMoveCalculationStrategy)
	private _bishopMoveCalculationStrategy!: BishopMoveCalculationStrategy;

	@inject(KingMoveCalculationStrategy)
	private _kingMoveCalculationStrategy!: KingMoveCalculationStrategy;

	@inject(QueenMoveCalculationStrategy)
	private _queenMoveCalculationStrategy!: QueenMoveCalculationStrategy;

	@inject(KnightMoveCalculationStrategy)
	private _knightMoveCalculationStrategy!: KnightMoveCalculationStrategy;

	getPossibleMoves(piece: Piece): Square[] {
		let moveStrategy: MoveCalculationStrategy;

		switch (piece.type) {
			case "pawn":
				moveStrategy = this._pawnMoveCalculationStrategy;
				break;
			case "rook":
				moveStrategy = this._rookMoveCalculationStrategy;
				break;
			case "bishop":
				moveStrategy = this._bishopMoveCalculationStrategy;
				break;
			case "king":
				moveStrategy = this._kingMoveCalculationStrategy;
				break;
			case "queen":
				moveStrategy = this._queenMoveCalculationStrategy;
				break;
			case "knight":
				moveStrategy = this._knightMoveCalculationStrategy;
				break;
			default:
				throw new Error("cannot resolve move calculation strategy for invalid piece type");
		}

		return moveStrategy.getPossibleMoves(piece);
	}
}
