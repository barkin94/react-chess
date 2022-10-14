import { PIECE_COLOR, PIECE_TYPES } from "./constants";

export type Coordinates = { x: number, y: number };
export type Side = "player" | "opponent";
export type SquareColor = "chocolate" | "wheat";
export type PieceColor = typeof PIECE_COLOR[number];
export type PieceType = typeof PIECE_TYPES[number];
export type Direction = "top" | "top_right" | "right" | "bottom_right" | "bottom" | "bottom_left" | "left" | "top_left" | "knight_specific";
export type NonKnightDirection = Exclude<Direction, "knight_specific">;
