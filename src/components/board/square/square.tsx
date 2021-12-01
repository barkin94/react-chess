import React from "react";
import "./square.css";
import { Square as SquareModel } from "../../../domain/chess/board/square.class";
import { Piece } from "../../piece/piece";
import { Piece as PieceModel } from "../../../domain/chess/piece/piece.abstract";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { getPiecePropsFromId } from "../../piece/piece-helper";
import { move, squareClicked, toggleAvailableMoves } from "../../../redux/reducers/board-state";
import { board } from "../../../domain/domain";

export interface SquareProps {
	square: SquareModel;
	isHighlighted: boolean;
}

export const Square: React.FC<SquareProps> = (props) => {
	const dispatch = useDispatch<AppDispatch>();

	const pieceId = useSelector((state: RootState) => state.boardState.pieceLocations[props.square.id]);

	const pieceProps = pieceId ? getPiecePropsFromId(pieceId) : undefined;

	const onPieceClicked = () => {
		if (!pieceId) return;

		dispatch(toggleAvailableMoves(pieceId));
	};

	const onSquareClicked = () => {
		//dispatch(move({ targetSquareId: props.square.id }))
		dispatch(squareClicked({ squareId: props.square.id }));
	};

	const getClassName = (): string => {
		const color = props.square.color === "black" ? "chocolate" : "wheat";

		let className = "square " + color;

		if (props.isHighlighted) {
			className = className + " available";
		}

		return className;
	};

	return (
		<span className={getClassName()} onClick={onSquareClicked}>
			{pieceProps && (
				<Piece
					id={pieceProps.id}
					type={pieceProps.type}
					color={pieceProps.color}
					//onClicked={onPieceClicked}
				></Piece>
			)}
		</span>
	);
};

type SquareColor = "chocolate" | "wheat";
