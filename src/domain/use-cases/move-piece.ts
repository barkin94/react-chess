import { getBoardData } from "../domain";
import { StartingData } from "../entities/board/board.class";
import { Piece } from "../entities/piece/piece.abstract";

export type MoveResult = {
	pieceLocations: StartingData["pieceLocations"];
	killedPiece: Piece | undefined;
};

export const movePiece = (pieceId: string, targetSquareId: string): MoveResult => {
	const board = getBoardData();

	if (!board.canPieceMakeMove(pieceId, targetSquareId)) {
		console.error("cannot make that move");
		return {
			pieceLocations: board.getPieceLocations(),
			killedPiece: undefined,
		};
	}

	const killedPiece = board.movePiece(pieceId, targetSquareId);

	return {
		pieceLocations: board.getPieceLocations(),
		killedPiece,
	};
};
