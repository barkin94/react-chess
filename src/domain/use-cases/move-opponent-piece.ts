import { inject, injectable } from "inversify";
import { Board, MoveResult } from "../entities/board/board.class";
import { MovePieceInput } from "./move-piece";
import { UseCase } from "./use-case.interface";

@injectable()
export class MoveOpponentPiece implements UseCase<MovePieceInput, MoveResult> {
	@inject(Board)
	private board!: Board;

	execute(input: MovePieceInput): MoveResult {
		return this.board.movePiece(input.pieceId, input.targetSquareId);
	}
}
