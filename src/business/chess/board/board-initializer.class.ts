import { PieceFactory } from "../piece/piece-factory.class";
import { Piece } from "../piece/piece.abstract";
import { PieceColor, pieceColors } from "../shared/types/piece-color.type";
import { PieceType, pieceTypes } from "../shared/types/piece-type.type";

type Alignment = "top" | "bottom";
type PieceOffset = { xOffset: number; yOffset: number };
export type PieceStartingLocations = {
	[key in PieceColor]: Map<Piece, PieceOffset>;
};

export class BoardInitializer {
	constructor(private _pieceFactory: PieceFactory) {}

	getStartingPieceLocations(playerColor: PieceColor): PieceStartingLocations {
		const result: PieceStartingLocations = {
			white: new Map<Piece, PieceOffset>(),
			black: new Map<Piece, PieceOffset>(),
		};

		pieceColors.forEach((color) => {
			pieceTypes.forEach((type) => {
				const startingLocations = this.getStartingPositions(type, playerColor === color ? "bottom" : "top");
				while (startingLocations.length) {
					const lastItemIndex = startingLocations.length - 1;
					const piece = this._pieceFactory.initPiece(type, color, type + color + lastItemIndex);
					result[color].set(piece, startingLocations[lastItemIndex]);
					startingLocations.pop();
				}
			});
		});

		return result;
	}

	private getStartingPositions(piece: PieceType, alignment: Alignment): PieceOffset[] {
		const yIndexOfPawnsLine = alignment === "top" ? 1 : 6;
		const yIndexOfOthersLine = alignment === "top" ? 0 : 7;

		switch (piece) {
			case "pawn":
				return [0, 1, 2, 3, 4, 5, 6, 7].map((number) => ({
					xOffset: number,
					yOffset: yIndexOfPawnsLine,
				}));
			case "rook":
				return [
					{ xOffset: 0, yOffset: yIndexOfOthersLine },
					{ xOffset: 7, yOffset: yIndexOfOthersLine },
				];
			case "knight":
				return [
					{ xOffset: 1, yOffset: yIndexOfOthersLine },
					{ xOffset: 6, yOffset: yIndexOfOthersLine },
				];
			case "bishop":
				return [
					{ xOffset: 2, yOffset: yIndexOfOthersLine },
					{ xOffset: 5, yOffset: yIndexOfOthersLine },
				];
			case "queen":
				return [{ xOffset: 3, yOffset: yIndexOfOthersLine }];
			case "king":
				return [{ xOffset: 4, yOffset: yIndexOfOthersLine }];
			default:
				return [];
		}
	}
}
