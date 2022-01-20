import { PieceColor } from "../../../domain/shared/types/piece-color.type";
import { PieceType } from "../../../domain/shared/types/piece-type.type";
import "./piece.css";

export interface PieceProps {
	type: PieceType;
	color: PieceColor;
	id: string;
	onClicked?: () => void;
}

const icons: { [key in PieceType]: { [key in PieceColor]: string } } = {
	bishop: { black: "&#x265D;", white: "&#x2657;" },
	king: { black: "&#x265A;", white: "&#x2654;" },
	pawn: { black: "&#x265F;", white: "&#x2659;" },
	rook: { black: "&#x265C;", white: "&#x2656;" },
	knight: { black: "&#x265E;", white: "&#x2658;" },
	queen: { black: "&#x265B;", white: "&#x2655;" },
};

export const Piece: React.FC<PieceProps> = (props) => {
	return (
		<span
			onClick={props.onClicked}
			className={"piece"}
			dangerouslySetInnerHTML={{
				__html: icons[props.type][props.color],
			}}
		></span>
	);
};
