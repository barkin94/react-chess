import { PieceColor } from "../types/piece-color";
import { PieceType } from "../types/piece-type";

export const pieceData: PieceData = {
  bishop: { icon: { black: "&#x265D;", white: "&#x2657;" }, moveLimit: 0 },
  king: { icon: { black: "&#x265A;", white: "&#x2654;" }, moveLimit: 1 },
  pawn: { icon: { black: "&#x265F;", white: "&#x2659;" }, moveLimit: 1 },
  rook: { icon: { black: "&#x265C;", white: "&#x2656;" }, moveLimit: 0 },
  knight: { icon: { black: "&#x265E;", white: "&#x2658;" }, moveLimit: 3 },
  queen: { icon: { black: "&#x265B;", white: "&#x2655;" }, moveLimit: 0 },
};

type PieceData = {
  [key in PieceType]: {
    icon: {
      [key in PieceColor]: string;
    };
    moveLimit: number;
  };
};
