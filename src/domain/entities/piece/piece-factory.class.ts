import { injectable } from "inversify";
import { PieceColor } from "../../shared/types/piece-color.type";
import { PieceType, pieceTypes } from "../../shared/types/piece-type.type";
import { Bishop } from "./bishop.class";
import { King } from "./king.class";
import { Knight } from "./knight.class";
import { Pawn } from "./pawn.class";
import { Piece } from "./piece.abstract";
import { Queen } from "./queen.class";
import { Rook } from "./rook.class";

@injectable()
export class PieceFactory {
	initPiece(pieceType: PieceType, color: PieceColor, id: string) {
		switch (pieceType) {
			case "pawn":
				return new Pawn(color, id);
			case "bishop":
				return new Bishop(color, id);
			case "king":
				return new King(color, id);
			case "queen":
				return new Queen(color, id);
			case "knight":
				return new Knight(color, id);
			case "rook":
				return new Rook(color, id);
			default:
				return new Pawn(color, id);
		}
	}
}
