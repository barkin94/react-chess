import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import styles from "./board.module.scss";
import { Square } from "./square/square";

export const Board: React.FC = () => {
	const highlightedSquares = useSelector((state: RootState) => state.board.highlightedSquares);
	const squareData = useSelector((state: RootState) => {
		if (state.game.activePage.name !== "match") {
			throw new Error('active page needs to be "in match"');
		}

		return state.game.activePage.matchStartingData.squareData;
	});

	const isSquareHighlighted = (squareId: string): boolean => {
		return !!highlightedSquares.find((id) => id === squareId);
	};

	return (
		<div className={styles.board}>
			{squareData.map((row, rowIndex) => (
				<div className={styles.row} key={rowIndex}>
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
