import { getBoardData } from "../domain";
import { StartingData } from "../entities/board/board.class";

// export const getStartingData = (): StartingData =>  {
// 	const board = getBoardData()
// 	const squareData: StartingData["squareData"] = [];
// 	board.squares.forEach((row) => {
// 		squareData.push(row.map((square) => ({ id: square.id, color: square.color })));
// 	});

// 	const pieceLocations: { [squareId: string]: string } = {};

// 	const pieceStartingLocations = this._boardInitializer.getPieceStartingLocations();

// 	pieceStartingLocations.black.forEach(
// 		(coordinates, piece) => (pieceLocations[this._squares[coordinates.y][coordinates.x].id] = piece.id)
// 	);
// 	pieceStartingLocations.white.forEach(
// 		(coordinates, piece) => (pieceLocations[this._squares[coordinates.y][coordinates.x].id] = piece.id)
// 	);

// 	return {
// 		squareData,
// 		pieceLocations,
// 		playerColor: this._boardInitializer._playerColor,
// 		isStartingFirst: this._isStartingFirst,
// 	};
// }
