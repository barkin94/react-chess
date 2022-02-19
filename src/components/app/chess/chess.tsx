import styles from "./chess.module.scss";
import { Board } from "./board/board";
import { PlayerPanel } from "./player-panel/player-panel";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import ReactModal from "react-modal";
import { MatchResultMenu } from "./board/match-result-menu/match-result-menu";

export const Chess: React.FC = () => {
	const isWaitingTurn = useSelector((state: RootState) => state.game.waitingTurn);
	const opponentsCapturedPieces = useSelector((state: RootState) => state.game.opponentsCapturedPieces);
	const yourCapturedPieces = useSelector((state: RootState) => state.game.yourCapturedPieces);
	const matchResult = useSelector((state: RootState) => state.game.matchResult);
	const playerScore = useSelector((state: RootState) => state.game.score.player);
	const opponentScore = useSelector((state: RootState) => state.game.score.opponent);

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
						<button>Give up</button>
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
			<ReactModal isOpen={!!matchResult}>
				<MatchResultMenu matchResult={matchResult!}></MatchResultMenu>
			</ReactModal>
		</>
	);
};
