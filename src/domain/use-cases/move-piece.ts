import { inject, injectable } from "inversify";
import { Board, MoveResult } from "../entities/board/board.class";
import { UseCase } from "./use-case.interface";

export type MovePieceInput = { pieceId: string; targetSquareId: string };

@injectable()
export class MovePiece implements UseCase<MovePieceInput, MoveResult> {
	@inject(Board)
	private board!: Board;

	execute(input: MovePieceInput): MoveResult {
		return {
			events: this.board.movePiece(input.pieceId, input.targetSquareId),
			pieceLocations: this.board.getPieceLocations()
		};
	}
}
