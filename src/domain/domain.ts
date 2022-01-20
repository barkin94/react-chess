import { BoardInitializer } from "./entities/board/board-initializer.class";
import { Board } from "./entities/board/board.class";
import { PieceFactory } from "./entities/piece/piece-factory.class";
import { PieceColor } from "./shared/types/piece-color.type";

let board: Board;

export function initBoardData(playerColor: PieceColor, isStartingFirst: boolean) {
	if (board) {
		throw new Error("board already exists");
	}

	board = new Board({
		boardInitializer: new BoardInitializer(new PieceFactory(), playerColor),
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
