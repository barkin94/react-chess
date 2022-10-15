import { closeModal } from "../../../redux/reducers/modal";
import { useAppDispatch } from "../../../redux/store";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";

export const GiveUp: React.FC = () => {
	const dispatch = useAppDispatch();

	return (
		<div>
			<div>Are you sure?</div>
			<button onClick={() => dispatch(searchMatch())}>Yes</button>
			<button onClick={() => dispatch(closeModal())}>No</button>
		</div>
	);
};
