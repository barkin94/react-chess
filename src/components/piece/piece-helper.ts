import React from "react";
import { PieceColor } from "../../domain/chess/shared/types/piece-color";
import { PieceType } from "../../domain/chess/shared/types/piece-type";
import { Piece, PieceProps } from "./piece";

export const getPiecePropsFromId = (id: string): PieceProps => {
	const color = id.includes("white") ? "white" : "black";

	const getTypeFromId = () => {
		let str = id.substring(0, id.length - 1);
		str = str.substring(0, str.indexOf(color));
		return str as PieceType;
	};

	return { id, color, type: getTypeFromId() };
};
