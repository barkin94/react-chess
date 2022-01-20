import { getBoardData } from "../domain";
import { StartingData } from "../entities/board/board.class";
import { Piece } from "../entities/piece/piece.abstract";

export type MoveResult = {
	pieceLocations: StartingData["pieceLocations"];
	killedPiece: Piece | undefined;
};

export const moveOpponentsPiece = (pieceId: string, targetSquareId: string): MoveResult => {
	const board = getBoardData();

	const killedPiece = board.movePiece(pieceId, targetSquareId);

	return {
		pieceLocations: board.getPieceLocations(),
		killedPiece,
	};
};
