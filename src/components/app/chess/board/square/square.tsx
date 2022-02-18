import styles from "./square.module.scss";
import React, { useLayoutEffect, useRef } from "react";
import { Piece } from "../../piece/piece";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { extractPiecePropsFromId } from "../../piece/piece-helper";
import { toggleOffAvailableMoves } from "../../../../../redux/reducers/board";
import { moveSelectedPieceToTargetSquare } from "../../../../../redux/thunks/move-selected-piece-to-target-square.thunk";
import { SquareColor } from "../../../../../domain/shared/types/square-color.type";
import { toggleOnAvailableMoves } from "../../../../../redux/thunks/toggle-on-available-moves.thunk";

export interface SquareProps {
	id: string;
	color: SquareColor;
	isHighlighted: boolean;
}

export const Square: React.FC<SquareProps> = (props) => {
	const dispatch = useDispatch<AppDispatch>();

	const selectedPieceId = useSelector((state: RootState) => state.board.selectedPieceId);
	const pieceId = useSelector((state: RootState) => state.board.pieceLocations[props.id]);
	const pieceProps = pieceId ? extractPiecePropsFromId(pieceId) : null;
	const playerColor = useSelector((state: RootState) => {
		if (state.game.activePage.page !== "in-match") {
			throw new Error('active page needs to be "in-match"');
		}

		return state.game.activePage.matchStartingData.playerColor;
	});

	const onPieceClicked = () => {
		if (!pieceProps || pieceProps.color !== playerColor) return;

		const toggleAction = selectedPieceId
			? toggleOffAvailableMoves()
			: toggleOnAvailableMoves({ pieceId: pieceProps.id });

		dispatch(toggleAction);
	};

	// When waiting for the player's turn, click events on the squares are disabled
	//----------------------------------------------------------------------------------
	const squareElemRef = useRef<HTMLElement>(null);
	const isOpponentsTurn = useSelector((state: RootState) => state.game.waitingTurn);

	useLayoutEffect(() => {
		squareElemRef.current!.onclick = isOpponentsTurn ? (event) => event.stopPropagation() : null;
	}, [isOpponentsTurn]);
	//-----------------------------------------------------------------------------------

	const getClassName = () => {
		let className = `${styles.square} ${styles[props.color]}`;
		if (pieceProps && selectedPieceId && pieceProps.id === selectedPieceId) {
			className += ` ${styles["piece-selected"]}`;
		}
		return className;
	};

	return (
		<span className={getClassName()} ref={squareElemRef}>
			{pieceProps && (
				<Piece
					id={pieceProps.id}
					type={pieceProps.type}
					color={pieceProps.color}
					onClicked={onPieceClicked}
				></Piece>
			)}
			{props.isHighlighted && (
				<div
					className={styles["possible-move"]}
					onClick={() => dispatch(moveSelectedPieceToTargetSquare(props.id))}
				></div>
			)}
		</span>
	);
};
