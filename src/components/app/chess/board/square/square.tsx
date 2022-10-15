import React, { useLayoutEffect, useRef } from "react";
import { SquareColor } from "../../../../../domain/shared";
import { toggleOffAvailableMoves } from "../../../../../redux/reducers/board";
import { useAppDispatch, useAppSelector } from "../../../../../redux/store";
import { moveSelectedPieceToTargetSquare } from "../../../../../redux/thunks/move-selected-piece-to-target-square.thunk";
import { toggleOnAvailableMoves } from "../../../../../redux/thunks/toggle-on-available-moves.thunk";
import { Piece } from "../../../../shared/piece/piece";
import { extractPiecePropsFromId } from "../../../../shared/piece/piece-helper";
import styles from "./square.module.scss";

export interface SquareProps {
	id: string;
	color: SquareColor;
	isHighlighted: boolean;
}

export const Square: React.FC<SquareProps> = (props) => {
	const dispatch = useAppDispatch();

	const selectedPieceId = useAppSelector(state => state.board.selectedPieceId);
	const pieceId = useAppSelector(state => state.board.pieceLocations[props.id]);
	const pieceProps = pieceId ? extractPiecePropsFromId(pieceId) : null;
	const playerColor = useAppSelector(state => {
		if (state.game.activePage.name !== "match") {
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
	const isOpponentsTurn = useAppSelector(state => state.game.waitingTurn);

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
			<div className={styles["square-name"]}>{props.id}</div>
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
