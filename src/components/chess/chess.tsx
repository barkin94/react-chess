import "./chess.scss";
import { Board } from "./board/board";
import { PlayerPanel } from "./player-panel/player-panel";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
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
		<div id="chess">
			<PlayerPanel name="You" isWaitingTurn={isWaitingTurn} capturedPieceIds={yourCapturedPieces}></PlayerPanel>
			<div id="middle-column">
				<div id="scoreboard">
					{playerScore} - {opponentScore}
				</div>
				<Board></Board>
			</div>
			<PlayerPanel
				name="Opponent"
				isWaitingTurn={!isWaitingTurn}
				capturedPieceIds={opponentsCapturedPieces}
			></PlayerPanel>
			<ReactModal isOpen={!!matchResult}>
				<MatchResultMenu matchResult={matchResult!}></MatchResultMenu>
			</ReactModal>
		</div>
	);
};
