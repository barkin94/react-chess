import { Board } from "./chess/board/board.class";
import { PieceFactory } from "./chess/piece/piece-factory.class";

const pieceFactory = new PieceFactory();
const board = new Board("white", pieceFactory);

export { pieceFactory, board };
