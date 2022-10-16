import { appCreateAsyncThunk } from "../store";

export const toggleOnAvailableMoves = appCreateAsyncThunk<
	{ highlightedSquares: string[]; selectedPieceId: string },
	{ pieceId: string; }
>("toggleOnAvailableMoves", (args, { extra }) => {
	const availableSquares = extra.getPossibleMoves.execute({ pieceId: args.pieceId });

	return {
		highlightedSquares: availableSquares.map((s) => s.id),
		selectedPieceId: args.pieceId,
	};
});
