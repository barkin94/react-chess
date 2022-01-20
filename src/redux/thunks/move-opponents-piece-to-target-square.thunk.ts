import { createAsyncThunk } from "@reduxjs/toolkit";
import { MoveResult } from "../../domain/use-cases/move-piece";
import { moveOpponentsPiece } from "../../domain/use-cases/move-opponents-piece";

export type ArgType = {
	pieceId: string;
	targetSquareId: string;
};
export const moveOpponentsPieceToTargetSquare = createAsyncThunk<MoveResult, ArgType>("mixed", (args: ArgType) => {
	const result = moveOpponentsPiece(args.pieceId, args.targetSquareId);

	return result;
});
