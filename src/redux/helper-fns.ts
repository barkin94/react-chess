import { PieceLocations } from "../domain/entities/board/board.class";
import { PieceLocationsForReducer } from "./reducers/board";

export function getPieceLocationsForReducer(pieceLocations: PieceLocations): PieceLocationsForReducer {
	const pieceLocationsForReducer: PieceLocationsForReducer = {};
	pieceLocations.forEach((piece, square) => (pieceLocationsForReducer[square.id] = piece.id));

	return pieceLocationsForReducer;
}
