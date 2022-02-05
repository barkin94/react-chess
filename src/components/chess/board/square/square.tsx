import React, { useEffect, useRef } from "react";
import "./square.css";
import { Piece } from "../../piece/piece";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getPiecePropsViaId } from "../../piece/piece-helper";
import { toggleOffAvailableMoves } from "../../../../redux/reducers/board";
import { moveSelectedPieceToTargetSquare } from "../../../../redux/thunks/move-selected-piece-to-target-square.thunk";
import { SquareColor } from "../../../../domain/shared/types/square-color.type";
import { toggleOnAvailableMoves } from "../../../../redux/thunks/toggle-on-available-moves.thunk";

export interface SquareProps {
	id: string;
	color: SquareColor;
	isHighlighted: boolean;
}

export const Square: React.FC<SquareProps> = (props) => {
	const dispatch = useDispatch<AppDispatch>();

	const pieceId = useSelector((state: RootState) => state.board.pieceLocations[props.id]);
	const playerColor = useSelector((state: RootState) => state.game.matchStartingData?.playerColor);

	const selectedPieceId = useSelector((state: RootState) => state.board.selectedPieceId);
	const pieceProps = pieceId ? getPiecePropsViaId(pieceId) : null;

	const onPieceClicked = () => {
		if (!pieceProps || pieceProps.color !== playerColor) return;
		const action = selectedPieceId ? toggleOffAvailableMoves() : toggleOnAvailableMoves({ pieceId: pieceProps.id });
		dispatch(action as any);
	};

	const onSquareClicked = () => {
		if (!props.isHighlighted) return;
		moveSelectedPieceToTargetSquare(props.id);
		dispatch(moveSelectedPieceToTargetSquare(props.id) as any);
	};

	const getClassName = (): string => {
		const color = props.color;

		let className = "square " + color;

		if (props.isHighlighted) {
			className = className + " available";
		}

		return className;
	};

	// When waiting for the player's turn, click events on the squares are disabled
	//----------------------------------------------------------------------------------
	const isOpponentsTurn = useSelector((state: RootState) => state.game.waitingTurn);
	const squareElemRef = useRef(null);
	useEffect(() => {
		(squareElemRef.current as unknown as HTMLElement).onclick = (event) => {
			isOpponentsTurn && event.stopPropagation();
		};
	}, [isOpponentsTurn]);
	//-----------------------------------------------------------------------------------

	return (
		<span className={getClassName()} onClick={onSquareClicked} ref={squareElemRef}>
			{pieceProps && (
				<Piece
					id={pieceProps.id}
					type={pieceProps.type}
					color={pieceProps.color}
					onClicked={onPieceClicked}
				></Piece>
			)}
		</span>
	);
};
