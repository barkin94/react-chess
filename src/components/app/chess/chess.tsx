import React from "react";
import { GIVE_UP } from "../../../redux/modal-component-names";
import { openModal } from "../../../redux/reducers/modal";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Board } from "./board/board";
import styles from "./chess.module.scss";
import { PlayerPanel } from "./player-panel/player-panel";

export const Chess: React.FC = () => {
	const isWaitingTurn = useAppSelector(state => state.board.waitingTurn);
	const opponentsCapturedPieces = useAppSelector(state => state.board.opponentsCapturedPieces);
	const yourCapturedPieces = useAppSelector(state => state.board.yourCapturedPieces);
	const playerScore = useAppSelector(state => state.board.score.player);
	const opponentScore = useAppSelector(state => state.board.score.opponent);
	const dispatch = useAppDispatch();

	// TODO: players should be able to enter their names before joining match queue.
	return (
		<>
			<div id={styles.chess}>
				<div id={styles["match-header"]}>
					<span></span>
					<span>
						{playerScore} - {opponentScore}
					</span>
					<span>
						<button onClick={() => dispatch(openModal({ componentName: GIVE_UP }))}>Leave Match</button>
					</span>
				</div>
				<div id={styles["match-body"]}>
					<PlayerPanel name="You" isWaitingTurn={isWaitingTurn} capturedPieceIds={yourCapturedPieces} />
					<Board />
					<PlayerPanel
						name="Opponent"
						isWaitingTurn={!isWaitingTurn}
						capturedPieceIds={opponentsCapturedPieces}
					/>
				</div>
			</div>
		</>
	);
};
