import { useAppDispatch } from "../../../redux/store";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const OpponentRejectedRematch: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<div>
			<div>Opponent rejected your rematch request.</div>
			<button onClick={() => dispatch(searchMatch())}>Search Match</button>
		</div>
	);
};
