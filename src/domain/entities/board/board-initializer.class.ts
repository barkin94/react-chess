import { injectable } from "inversify";
import { Coordinates } from "../../shared/types/coordinates.type";
import { PieceColor, pieceColors } from "../../shared/types/piece-color.type";
import { PieceType, pieceTypes } from "../../shared/types/piece-type.type";
import { Piece } from "../piece/piece.class";
import { Square } from "./square.class";

type Alignment = "top" | "bottom";
export type PieceStartingLocations = {
	[key in PieceColor]: Map<Piece, Coordinates>;
};

@injectable()
export class BoardInitializer {
	getPieceStartingLocations(playerColor: PieceColor): PieceStartingLocations {
		const result: PieceStartingLocations = {
			white: new Map<Piece, Coordinates>(),
			black: new Map<Piece, Coordinates>(),
		};

		pieceColors.forEach((color) => {
			pieceTypes.forEach((type) => {
				const startingLocations = this.getStartingPositions(
					type,
					playerColor === color ? "bottom" : "top",
					color
				);
				while (startingLocations.length) {
					const lastItemIndex = startingLocations.length - 1;
					const piece = Piece.create(type, color, `${type}${color}${lastItemIndex}`);
					result[color].set(piece, startingLocations[lastItemIndex]);
					startingLocations.pop();
				}
			});
		});

		return result;
	}

	initSquareLayout(playerColor: PieceColor): Square[][] {
		const squares: Square[][] = [];

		for (let y = 0; y < 8; y++) {
			squares.push([]);
			for (let x = 0; x < 8; x++) {
				/**
				 * a4, b3, h1 etc.
				 */
				const squareName =
					playerColor === "white"
						? this.getNthLetterAfterA(x) + (8 - y)
						: this.getNthLetterBeforeH(x) + (y + 1);

				const square = Square.create(`${squareName}`, { x, y });
				squares[y].push(square);
			}
		}
		return squares;
	}

	private getNthLetterAfterA(n: number) {
		return String.fromCharCode("a".charCodeAt(0) + n);
	}

	private getNthLetterBeforeH(n: number) {
		return String.fromCharCode("h".charCodeAt(0) - n);
	}

	private getStartingPositions(piece: PieceType, alignment: Alignment, color: PieceColor): Coordinates[] {
		const yIndexOfPawns = alignment === "top" ? 1 : 6;
		const yIndexOfNonPawns = alignment === "top" ? 0 : 7;
		const getXIndexOfNthPiece = (n: number) => (alignment === "top" ? 7 - n : n);

		function getQueenLocation() {
			if (alignment === "top") return color === "black" ? 3 : 4;
			else return color === "black" ? 4 : 3;
		}

		function getKingLocation() {
			if (alignment === "top") return color === "black" ? 4 : 3;
			else return color === "black" ? 3 : 4;
		}

		switch (piece) {
			case "pawn":
				return [0, 1, 2, 3, 4, 5, 6, 7].map((number) => ({
					x: getXIndexOfNthPiece(number),
					y: yIndexOfPawns,
				}));
			case "rook":
				return [
					{ x: getXIndexOfNthPiece(0), y: yIndexOfNonPawns },
					{ x: getXIndexOfNthPiece(7), y: yIndexOfNonPawns },
				];
			case "knight":
				return [
					{ x: getXIndexOfNthPiece(1), y: yIndexOfNonPawns },
					{ x: getXIndexOfNthPiece(6), y: yIndexOfNonPawns },
				];
			case "bishop":
				return [
					{ x: getXIndexOfNthPiece(2), y: yIndexOfNonPawns },
					{ x: getXIndexOfNthPiece(5), y: yIndexOfNonPawns },
				];
			case "queen":
				return [{ x: getQueenLocation(), y: yIndexOfNonPawns }];
			case "king":
				return [{ x: getKingLocation(), y: yIndexOfNonPawns }];
			default:
				return [];
		}
	}
}
