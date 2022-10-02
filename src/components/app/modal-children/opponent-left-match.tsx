import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const OpponentLeftMatch: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<>
			<div>Opponent left the match!</div>
			<button onClick={() => dispatch(searchMatch())}>Search Match</button>
		</>
	);
};
