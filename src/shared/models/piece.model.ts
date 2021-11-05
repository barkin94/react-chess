import { pieceData } from "../constants/piece-data";
import { Coordinates } from "../types/coordinates.type";
import { PieceColor } from "../types/piece-color";
import { PieceType, pieceTypes } from "../types/piece-type";
import { Square } from "./square.model";

export class Piece {
  constructor(
    public type: PieceType,
    public moveLimit: number,
    public color: PieceColor,
    public icon: string
  ) {}

  static getStartingPositionsForSelf(piece: PieceType): Coordinates[] {
    return this.getStartingPosition(piece, "bottom");
  }

  static getStartingPositionsForOpponent(piece: PieceType): Coordinates[] {
    return this.getStartingPosition(piece, "top");
  }

  private static getStartingPosition(
    piece: PieceType,
    alignment: "top" | "bottom"
  ) {
    const yIndexOfLine1 = alignment === "top" ? 0 : 7;
    const yIndexOfLine2 = alignment === "top" ? 1 : 6;

    switch (piece) {
      case "pawn":
        return Array.from(Array(8).keys()).map((number) => ({
          x: number,
          y: yIndexOfLine2,
        }));
      case "rook":
        return [
          { x: 0, y: yIndexOfLine1 },
          { x: 7, y: yIndexOfLine1 },
        ];
      case "knight":
        return [
          { x: 1, y: yIndexOfLine1 },
          { x: 6, y: yIndexOfLine1 },
        ];
      case "bishop":
        return [
          { x: 2, y: yIndexOfLine1 },
          { x: 5, y: yIndexOfLine1 },
        ];
      case "queen":
        return [{ x: 3, y: yIndexOfLine1 }];
      case "king":
        return [{ x: 4, y: yIndexOfLine1 }];
      default:
        throw new Error("no matching piece found");
    }
  }

  public static initPiece(pieceType: PieceType, color: PieceColor) {
    return new Piece(
      pieceType,
      pieceData[pieceType].moveLimit,
      color,
      pieceData[pieceType].icon[color]
    );
  }
}

type PieceData = {
  [key in PieceType]: {
    icon: {
      [key in PieceColor]: string;
    };
    moveLimit: number;
  };
};
