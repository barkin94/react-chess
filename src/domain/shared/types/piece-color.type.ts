const PIECE_COLOR = ["black", "white"] as const;

export const pieceColors = Array.from(PIECE_COLOR.values());
export type PieceColor = typeof PIECE_COLOR[number];
