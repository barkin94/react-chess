import React from "react";
import { openModal } from "../../../redux/reducers/modal";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Board } from "./board/board";
import styles from "./chess.module.scss";
import { PlayerPanel } from "./player-panel/player-panel";

export const Chess: React.FC = () => {
	const isWaitingTurn = useAppSelector(state => state.game.waitingTurn);
	const opponentsCapturedPieces = useAppSelector(state => state.game.opponentsCapturedPieces);
	const yourCapturedPieces = useAppSelector(state => state.game.yourCapturedPieces);
	const playerScore = useAppSelector(state => state.game.score.player);
	const opponentScore = useAppSelector(state => state.game.score.opponent);
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
						<button onClick={() => dispatch(openModal({ componentName: "GiveUp" }))}>Leave Match</button>
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
