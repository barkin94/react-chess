import { Square, SquareProps } from "./square/square";
import "./board.css";
import { useSelector } from "react-redux";
import { Square as SquareModel } from "../../domain/chess/board/square.class";

import { RootState } from "../../redux/store";
import React from "react";

export const Board: React.FC<{ squares: readonly SquareModel[][] }> = (props) => {
	const highlightedSquares = useSelector((state: RootState) => state.boardState.highlightedSquares);

	const isHighlighted = (squareId: string): boolean => {
		return !!highlightedSquares.find((id) => id === squareId);
	};

	const getSquareProps = (): SquareProps[][] => {
		return props.squares.map((row) => {
			return row.map((square) => ({
				square,
				isHighlighted: isHighlighted(square.id),
			}));
		});
	};

	return (
		<div className="board">
			{getSquareProps().map((row, rowIndex) => (
				<div className="row" key={rowIndex}>
					{row.map((prop) => (
						<Square key={prop.square.id} square={prop.square} isHighlighted={prop.isHighlighted}></Square>
					))}
				</div>
			))}
		</div>
	);
};
