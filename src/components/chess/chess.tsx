import "./chess.scss";
import { Board } from "./board/board";
import { PlayerPanel } from "./player-panel/player-panel";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ReactModal from "react-modal";
import { MatchResultMenu } from "./board/match-result-menu/match-result-menu";

export const Chess: React.FC = () => {
	const isWaitingTurn = useSelector((state: RootState) => state.game.waitingTurn);
	const opponentsKilledPieces = useSelector((state: RootState) => state.game.opponentsDeadPieces);
	const yourKilledPieces = useSelector((state: RootState) => state.game.yourDeadPieces);
	const matchResult = useSelector((state: RootState) => state.game.matchResult);

	return (
		<div className="chess">
			<Board></Board>
			<div id="player-panels">
				<PlayerPanel
					name="Opponent"
					isWaitingTurn={!isWaitingTurn}
					killedPieceIds={opponentsKilledPieces}
				></PlayerPanel>
				<PlayerPanel name="You" isWaitingTurn={isWaitingTurn} killedPieceIds={yourKilledPieces}></PlayerPanel>
			</div>

			<ReactModal isOpen={!!matchResult}>
				<MatchResultMenu matchResult={matchResult!}></MatchResultMenu>
			</ReactModal>
		</div>
	);
};
