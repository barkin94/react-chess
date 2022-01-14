import React, { useEffect, useRef } from "react";
import "./square.css";
import { Piece } from "../../piece/piece";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getPiecePropsViaId } from "../../piece/piece-helper";
import { move, toggleOffAvailableMoves, toggleOnAvailableMoves } from "../../../../redux/reducers/board-state";
import { SquareColor } from "../../../../business/chess/shared/types/square-color.type";
import { getSocketIoConnection } from "../../../../socket-io";
import { waitingForTurn } from "../../../../redux/reducers/game-state";

export interface SquareProps {
	id: string;
	color: SquareColor;
	isHighlighted: boolean;
}

export const Square: React.FC<SquareProps> = (props) => {
	const dispatch = useDispatch<AppDispatch>();

	const pieceId = useSelector((state: RootState) => state.boardState.pieceLocations[props.id]);
	const playerColor = useSelector((state: RootState) => state.gameState.matchStartingData?.playerColor);

	const selectedPieceId = useSelector((state: RootState) => state.boardState.selectedPieceId);
	const pieceProps = pieceId ? getPiecePropsViaId(pieceId) : null;

	const onPieceClicked = () => {
		if (!pieceProps || pieceProps.color !== playerColor) return;

		dispatch(selectedPieceId ? toggleOffAvailableMoves() : toggleOnAvailableMoves(pieceProps.id));
	};

	const onSquareClicked = () => {
		if (!props.isHighlighted) return;

		dispatch(move({ targetSquareId: props.id }));
		getSocketIoConnection().emit("move", { pieceId: selectedPieceId, targetSquareId: props.id });
		dispatch(toggleOffAvailableMoves());
		dispatch(waitingForTurn(true));
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
	const isOpponentsTurn = useSelector((state: RootState) => state.gameState.waitingTurn);
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
