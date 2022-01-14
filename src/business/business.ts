import { Board } from "./chess/board/board.class";
import { PieceFactory } from "./chess/piece/piece-factory.class";
import { PieceColor } from "./chess/shared/types/piece-color.type";

let board: Board;

export function initBoardData(playerColor: PieceColor, isStartingFirst: boolean) {
	if (board) {
		throw new Error("board already exists");
	}

	board = new Board({
		pieceFactory: new PieceFactory(),
		playerColor,
		isStartingFirst,
	});

	return getBoardData();
}

export function getBoardData() {
	if (!board) {
		throw new Error("board does not exist. call initBoard() first");
	}

	return board;
}
