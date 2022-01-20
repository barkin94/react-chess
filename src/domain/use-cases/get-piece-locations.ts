import { getBoardData } from "../domain";
import { StartingData } from "../entities/board/board.class";

export const getPieceLocations = (): StartingData["pieceLocations"] => {
	const result: { [squareId: string]: string } = {};
	getBoardData().pieces.forEach((piece) => (result[piece.squareId as string] = piece.id));
	return result;
};
