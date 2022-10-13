import { PIECE_COLOR, PIECE_TYPES } from "./constants";

export type Coordinates = { x: number, y: number };
export type Side = "player" | "opponent";
export type SquareColor = "chocolate" | "wheat";
export type PieceColor = typeof PIECE_COLOR[number];
export type PieceType = typeof PIECE_TYPES[number];