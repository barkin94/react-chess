import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppThunkExtraArgs } from "../store";

export type ArgType = {
	pieceId: string;
};
export const toggleOnAvailableMoves = createAsyncThunk<
	{ highlightedSquares: string[]; selectedPieceId: string },
	ArgType,
	{ extra: AppThunkExtraArgs }
>("toggleOnAvailableMoves", (args: ArgType, { extra }) => {
	const availableSquares = extra.getPossibleMoves.execute({ pieceId: args.pieceId });

	return {
		highlightedSquares: availableSquares.map((s) => s.id),
		selectedPieceId: args.pieceId,
	};
});
