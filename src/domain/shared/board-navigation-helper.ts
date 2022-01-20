import { Square } from "../entities/board/square.class";
import { Coordinates } from "./types/coordinates.type";
import { PieceColor } from "./types/piece-color.type";

export const collidesWithSameColoredPiece = (square: Square, color: PieceColor) => {
	return square.piece && square.piece.color === color;
};

export const getAvailableMovesInDirection = (
	direction: Directions,
	color: PieceColor,
	location: Coordinates,
	squares: Square[][],
	allTheWay = false
) => {
	switch (direction) {
		case "top":
			return Top(color, location, squares, allTheWay);
		case "top_right":
			return TopRight(color, location, squares, allTheWay);
		case "right":
			return Right(color, location, squares, allTheWay);
		case "bottom_right":
			return BottomRight(color, location, squares, allTheWay);
		case "bottom":
			return Bottom(color, location, squares, allTheWay);
		case "bottom_left":
			return BottomLeft(color, location, squares, allTheWay);
		case "left":
			return Left(color, location, squares, allTheWay);
		case "top_left":
			return TopLeft(color, location, squares, allTheWay);

		default:
			return Top(color, location, squares, allTheWay);
	}
};

const TopRight = (color: PieceColor, location: Coordinates, squares: Square[][], allTheWay = false): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y - 1;
	let nextXCoordinate = location.x + 1;

	if (allTheWay) {
		while (
			nextXCoordinate < 8 &&
			nextYCoordinate > -1 &&
			!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
		) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextXCoordinate++;
			nextYCoordinate--;
		}

		return coordinates;
	}

	if (
		nextXCoordinate < 8 &&
		nextYCoordinate > -1 &&
		!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
	) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const TopLeft = (color: PieceColor, location: Coordinates, squares: Square[][], allTheWay = false): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y - 1;
	let nextXCoordinate = location.x - 1;

	if (allTheWay) {
		while (
			nextXCoordinate > -1 &&
			nextYCoordinate > -1 &&
			!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
		) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextXCoordinate--;
			nextYCoordinate--;
		}

		return coordinates;
	}

	if (
		nextXCoordinate > -1 &&
		nextYCoordinate > -1 &&
		!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
	) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const BottomRight = (
	color: PieceColor,
	location: Coordinates,
	squares: Square[][],
	allTheWay = false
): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y + 1;
	let nextXCoordinate = location.x + 1;

	if (allTheWay) {
		while (
			nextXCoordinate < 8 &&
			nextYCoordinate < 8 &&
			!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
		) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextXCoordinate++;
			nextYCoordinate++;
		}

		return coordinates;
	}

	if (
		nextXCoordinate < 8 &&
		nextYCoordinate < 8 &&
		!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
	) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const BottomLeft = (
	color: PieceColor,
	location: Coordinates,
	squares: Square[][],
	allTheWay = false
): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y + 1;
	let nextXCoordinate = location.x - 1;

	if (allTheWay) {
		while (
			nextXCoordinate > -1 &&
			nextYCoordinate < 8 &&
			!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
		) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextXCoordinate--;
			nextYCoordinate++;
		}
		return coordinates;
	}

	if (
		nextXCoordinate > -1 &&
		nextYCoordinate < 8 &&
		!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
	) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const Bottom = (color: PieceColor, location: Coordinates, squares: Square[][], allTheWay = false): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y + 1;
	let nextXCoordinate = location.x;

	if (allTheWay) {
		while (nextYCoordinate < 8 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextYCoordinate++;
		}
		return coordinates;
	}

	if (nextYCoordinate < 8 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const Top = (color: PieceColor, location: Coordinates, squares: Square[][], allTheWay = false): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y - 1;
	let nextXCoordinate = location.x;

	if (allTheWay) {
		while (
			nextYCoordinate > -1 &&
			!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
		) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextYCoordinate--;
		}
		return coordinates;
	}

	if (nextYCoordinate > -1 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const Left = (color: PieceColor, location: Coordinates, squares: Square[][], allTheWay = false): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y;
	let nextXCoordinate = location.x - 1;

	if (allTheWay) {
		while (
			nextXCoordinate > -1 &&
			!collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)
		) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextXCoordinate--;
		}
		return coordinates;
	}

	if (nextXCoordinate > -1 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const Right = (color: PieceColor, location: Coordinates, squares: Square[][], allTheWay = false): Coordinates[] => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y;
	let nextXCoordinate = location.x + 1;

	if (allTheWay) {
		while (nextXCoordinate < 8 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextXCoordinate++;
		}
		return coordinates;
	}

	if (nextXCoordinate < 8 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

const navigate = (color: PieceColor, location: Coordinates, squares: Square[][], allTheWay = false) => {
	let coordinates: Coordinates[] = [];
	let nextYCoordinate = location.y;
	let nextXCoordinate = location.x + 1;

	if (allTheWay) {
		while (nextXCoordinate < 8 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
			coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
			nextXCoordinate++;
		}
		return coordinates;
	}

	if (nextXCoordinate < 8 && !collidesWithSameColoredPiece(squares[nextYCoordinate][nextXCoordinate], color)) {
		coordinates.push({ x: nextXCoordinate, y: nextYCoordinate });
	}

	return coordinates;
};

type Directions = "top" | "top_right" | "right" | "bottom_right" | "bottom" | "bottom_left" | "left" | "top_left";
