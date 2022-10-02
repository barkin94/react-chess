import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const OpponentRejectedRematch: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div>
			<div>Opponent rejected your rematch request.</div>
			<button onClick={() => dispatch(searchMatch())}>Search Match</button>
		</div>
	);
};
