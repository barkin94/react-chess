import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../../redux/reducers/modal";
import { AppDispatch, RootState } from "../../../redux/store";
import { Board } from "./board/board";
import styles from "./chess.module.scss";
import { GiveUpModal } from "./give-up-modal/give-up-modal";
import { MatchResultModal } from "./match-result-modal/match-result-modal";
import { PlayerPanel } from "./player-panel/player-panel";

export const Chess: React.FC = () => {
	const isWaitingTurn = useSelector((state: RootState) => state.game.waitingTurn);
	const opponentsCapturedPieces = useSelector((state: RootState) => state.game.opponentsCapturedPieces);
	const yourCapturedPieces = useSelector((state: RootState) => state.game.yourCapturedPieces);
	const matchResult = useSelector((state: RootState) => state.game.matchResult);
	const playerScore = useSelector((state: RootState) => state.game.score.player);
	const opponentScore = useSelector((state: RootState) => state.game.score.opponent);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!matchResult)
			return;
		
		dispatch(openModal({ componentName: MatchResultModal.name }));
	}, [dispatch, matchResult]);

	const openGiveUpModal = () => {
		 dispatch(openModal({ componentName: GiveUpModal.name }));
	};

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
						<button onClick={() => openGiveUpModal()}>Leave Match</button>
					</span>
				</div>
				<div id={styles["match-body"]}>
					<PlayerPanel
						name="You"
						isWaitingTurn={isWaitingTurn}
						capturedPieceIds={yourCapturedPieces}
					/>
					<Board/>
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
