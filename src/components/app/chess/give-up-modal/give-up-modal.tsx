import { useDispatch } from "react-redux";
import { searchMatch } from "../../../../redux/reducers/game";
import { closeModal } from "../../../../redux/reducers/modal";
import { AppDispatch } from "../../../../redux/store";

export const GiveUpModal: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div>
			<div>Are you sure?</div>
			<button onClick={() => dispatch(searchMatch())}>Yes</button>
			<button onClick={() => dispatch(closeModal())}>No</button>
		</div>
	);
};
