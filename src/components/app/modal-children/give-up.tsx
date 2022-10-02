import { useDispatch } from "react-redux";
import { closeModal } from "../../../redux/reducers/modal";
import { AppDispatch } from "../../../redux/store";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const GiveUp: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div>
			<div>Are you sure?</div>
			<button onClick={() => dispatch(searchMatch())}>Yes</button>
			<button onClick={() => dispatch(closeModal())}>No</button>
		</div>
	);
};
