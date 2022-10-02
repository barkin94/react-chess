import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../../redux/reducers/modal";
import { AppDispatch, RootState } from "../../../redux/store";
import { Board } from "./board/board";
import styles from "./chess.module.scss";
import { PlayerPanel } from "./player-panel/player-panel";

export const Chess: React.FC = () => {
	const isWaitingTurn = useSelector((state: RootState) => state.game.waitingTurn);
	const opponentsCapturedPieces = useSelector((state: RootState) => state.game.opponentsCapturedPieces);
	const yourCapturedPieces = useSelector((state: RootState) => state.game.yourCapturedPieces);
	const playerScore = useSelector((state: RootState) => state.game.score.player);
	const opponentScore = useSelector((state: RootState) => state.game.score.opponent);
	const dispatch = useDispatch<AppDispatch>();

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
