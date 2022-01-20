const PIECE_TYPES = ["pawn", "bishop", "knight", "rook", "queen", "king"] as const;

export const pieceTypes = Array.from(PIECE_TYPES.values());
export type PieceType = typeof PIECE_TYPES[number];
