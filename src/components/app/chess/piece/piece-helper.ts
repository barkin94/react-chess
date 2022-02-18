import { PieceType } from "../../../../domain/shared/types/piece-type.type";
import { PieceProps } from "./piece";

export const extractPiecePropsFromId = (id: string): PieceProps => {
	const color = id.includes("white") ? "white" : "black";

	const getTypeFromId = () => {
		let str = id.substring(0, id.length - 1);
		str = str.substring(0, str.indexOf(color));
		return str as PieceType;
	};

	return { id, color, type: getTypeFromId() };
};
