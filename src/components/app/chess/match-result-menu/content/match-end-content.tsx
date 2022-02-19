import { useEffect } from "react";
import { MatchResult } from "../../../../../redux/reducers/game";
import { getSocket } from "../../../../../socket/socket-io";

interface MatchEndContentProps {
	matchResult: MatchResult;
	onRequestRematchBtnClick: () => void;
	onSearchMatchBtnClick: () => void;
	onRematchRequestReceived: () => void;
}

export const MatchEndContent: React.FC<MatchEndContentProps> = (props) => {
	const opponentForfeit = props.matchResult === "opponent-forfeit";

	useEffect(() => {
		getSocket().on("rematch-request", () => {
			props.onRematchRequestReceived();
		});

		return () => {
			getSocket().off("rematch-request");
		};
	});

	const getMatchResultText = () => {
		switch (props.matchResult) {
			case "win":
				return "You win!";
			case "loss":
				return "You lose!";
			case "draw":
				return "Draw!";
			case "opponent-forfeit":
				return "Opponent left the match!";
			default:
				return "Invalid match result";
		}
	};

	return (
		<div>
			<div>{getMatchResultText()}</div>
			{!opponentForfeit && <button onClick={props.onRequestRematchBtnClick}>Rematch?</button>}
			<button onClick={props.onSearchMatchBtnClick}>Search Match</button>
		</div>
	);
};
