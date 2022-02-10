import { inject, injectable } from "inversify";
import { PieceType } from "../../../shared/types/piece-type.type";
import { BishopMoveCalculationStrategy } from "./bishop-move-calculation-strategy.class";
import { KingMoveCalculationStrategy } from "./king-move-calculation-strategy.class";
import { KnightMoveCalculationStrategy } from "./knight-move-calculation-strategy.class";
import { MoveCalculationStrategy } from "./move-calculation-strategy.abstract";
import { PawnMoveCalculationStrategy } from "./pawn-move-calculation-strategy.class";
import { QueenMoveCalculationStrategy } from "./queen-move-calculation-strategy.class";
import { RookMoveCalculationStrategy } from "./rook-move-calculation-strategy.class";

@injectable()
export class MoveCalculationStrategyResolver {
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

	resolve(type: PieceType): MoveCalculationStrategy {
		switch (type) {
			case "pawn":
				return this._pawnMoveCalculationStrategy;
			case "rook":
				return this._rookMoveCalculationStrategy;
			case "bishop":
				return this._bishopMoveCalculationStrategy;
			case "king":
				return this._kingMoveCalculationStrategy;
			case "queen":
				return this._queenMoveCalculationStrategy;
			case "knight":
				return this._knightMoveCalculationStrategy;
			default:
				throw new Error("cannot resolve move calculation strategy for invalid piece type");
		}
	}
}
