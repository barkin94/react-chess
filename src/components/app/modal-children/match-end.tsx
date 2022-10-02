import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { requestRematch } from "../../../redux/thunks/request-rematch.thunk";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const MatchEnd: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const matchResult = useSelector((state: RootState) => state.game.matchResult);
	
	if (!matchResult) {
		throw new Error("match is not over yet")
	}

	const getMatchResultText = () => {
		switch (matchResult) {
			case "win":
				return "You win!";
			case "loss":
				return "You lose!";
			case "draw":
				return "Draw!";
			default:
				return "Invalid match result";
		}
	};

	return (
		<div>
			<div>{getMatchResultText()}</div>
			<button onClick={() => dispatch(requestRematch())}>Rematch?</button>
			<button onClick={() => dispatch(searchMatch())}>Search Match</button>
		</div>
	);
};
