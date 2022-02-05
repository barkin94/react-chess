import { PieceFactory } from "../piece/piece-factory.class";
import { Piece } from "../piece/piece.abstract";
import { Coordinates } from "../../shared/types/coordinates.type";
import { PieceColor, pieceColors } from "../../shared/types/piece-color.type";
import { PieceType, pieceTypes } from "../../shared/types/piece-type.type";
import { Square } from "./square.class";
import { inject, injectable } from "inversify";

type Alignment = "top" | "bottom";
export type PieceStartingLocations = {
	[key in PieceColor]: Map<Piece, Coordinates>;
};

@injectable()
export class BoardInitializer {
	@inject(PieceFactory)
	private _pieceFactory!: PieceFactory;

	getPieceStartingLocations(playerColor: PieceColor): PieceStartingLocations {
		const result: PieceStartingLocations = {
			white: new Map<Piece, Coordinates>(),
			black: new Map<Piece, Coordinates>(),
		};

		pieceColors.forEach((color) => {
			pieceTypes.forEach((type) => {
				const startingLocations = this.getStartingPositions(type, playerColor === color ? "bottom" : "top");
				while (startingLocations.length) {
					const lastItemIndex = startingLocations.length - 1;
					const piece = this._pieceFactory.initPiece(type, color, `${type}${color}${lastItemIndex}`);
					result[color].set(piece, startingLocations[lastItemIndex]);
					startingLocations.pop();
				}
			});
		});

		return result;
	}

	initSquareLayout(playerColor: PieceColor): Square[][] {
		const squares = [];
		for (let y = 0; y < 8; y++) {
			squares.push([]);
			for (let x = 0; x < 8; x++) {
				const squareId = playerColor === "black" ? 8 * y + x : 64 - (8 * y + (8 - x));
				const square = Square.create(`${squareId}`, { x, y });
				(squares[y] as Square[]).push(square);
			}
		}
		return squares;
	}

	private getStartingPositions(piece: PieceType, alignment: Alignment): Coordinates[] {
		const yIndexOfPawnsLine = alignment === "top" ? 1 : 6;
		const yIndexOfOthersLine = alignment === "top" ? 0 : 7;

		switch (piece) {
			case "pawn":
				return [0, 1, 2, 3, 4, 5, 6, 7].map((number) => ({
					x: number,
					y: yIndexOfPawnsLine,
				}));
			case "rook":
				return [
					{ x: 0, y: yIndexOfOthersLine },
					{ x: 7, y: yIndexOfOthersLine },
				];
			case "knight":
				return [
					{ x: 1, y: yIndexOfOthersLine },
					{ x: 6, y: yIndexOfOthersLine },
				];
			case "bishop":
				return [
					{ x: 2, y: yIndexOfOthersLine },
					{ x: 5, y: yIndexOfOthersLine },
				];
			case "queen":
				return [{ x: 3, y: yIndexOfOthersLine }];
			case "king":
				return [{ x: 4, y: yIndexOfOthersLine }];
			default:
				return [];
		}
	}
}
