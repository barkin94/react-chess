import { useAppDispatch } from "../../../redux/store";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const OpponentLeftMatch: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<>
			<div>Opponent left the match!</div>
			<button onClick={() => dispatch(searchMatch())}>Search Match</button>
		</>
	);
};
