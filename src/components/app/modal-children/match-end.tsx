import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { requestRematch } from "../../../redux/thunks/request-rematch.thunk";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const MatchEnd: React.FC<{ winner?: string }> = (props) => {
	const dispatch = useAppDispatch();
	const playerColor = useAppSelector(state => state.board.playerColor);
	
	const getMatchResultText = () => {
		if (!props.winner)
			return "Draw!";
		else if (props.winner === playerColor)
			return "You win!";
		else
			return "You lose!";
	};

	return (
		<div>
			<div>{getMatchResultText()}</div>
			<button onClick={() => dispatch(requestRematch())}>Rematch?</button>
			<button onClick={() => dispatch(searchMatch())}>Search Match</button>
		</div>
	);
};
