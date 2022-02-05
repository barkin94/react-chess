import "./board.css";
import { Square } from "./square/square";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import React from "react";
import { StartingData } from "../../../redux/reducers/board";

export const Board: React.FC<{ squareData: StartingData["squareData"] }> = (props) => {
	const highlightedSquares = useSelector((state: RootState) => state.board.highlightedSquares);

	const isSquareHighlighted = (squareId: string): boolean => {
		return !!highlightedSquares.find((id) => id === squareId);
	};

	return (
		<div className="board">
			{props.squareData.map((row, rowIndex) => (
				<div className="row" key={rowIndex}>
					{row.map((prop) => (
						<Square
							key={prop.id}
							id={prop.id}
							color={prop.color}
							isHighlighted={isSquareHighlighted(prop.id)}
						></Square>
					))}
				</div>
			))}
		</div>
	);
};
