import styles from "./chess.module.scss";
import { Board } from "./board/board";
import { PlayerPanel } from "./player-panel/player-panel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import ReactModal from "react-modal";
import { MatchResultMenu } from "./match-result-menu/match-result-menu";
import { useState } from "react";
import { searchMatch } from "../../../redux/reducers/game";

export const Chess: React.FC = () => {
	const isWaitingTurn = useSelector((state: RootState) => state.game.waitingTurn);
	const opponentsCapturedPieces = useSelector((state: RootState) => state.game.opponentsCapturedPieces);
	const yourCapturedPieces = useSelector((state: RootState) => state.game.yourCapturedPieces);
	const matchResult = useSelector((state: RootState) => state.game.matchResult);
	const playerScore = useSelector((state: RootState) => state.game.score.player);
	const opponentScore = useSelector((state: RootState) => state.game.score.opponent);

	const [giveUpModalActive, setGiveUpModalActive] = useState(false);
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
						<button onClick={() => setGiveUpModalActive(true)}>Leave Match</button>
					</span>
				</div>
				<div id={styles["match-body"]}>
					<PlayerPanel
						name="You"
						isWaitingTurn={isWaitingTurn}
						capturedPieceIds={yourCapturedPieces}
					></PlayerPanel>
					<Board></Board>
					<PlayerPanel
						name="Opponent"
						isWaitingTurn={!isWaitingTurn}
						capturedPieceIds={opponentsCapturedPieces}
					></PlayerPanel>
				</div>
			</div>

			<ReactModal isOpen={!!matchResult || giveUpModalActive}>
				{matchResult && <MatchResultMenu matchResult={matchResult!}></MatchResultMenu>}
				{giveUpModalActive && (
					<div>
						<div>Are you sure?</div>
						<button onClick={() => dispatch(searchMatch())}>Yes</button>
						<button onClick={() => setGiveUpModalActive(false)}>No</button>
					</div>
				)}
			</ReactModal>
		</>
	);
};
