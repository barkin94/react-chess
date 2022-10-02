import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { replyToRematchRequest } from "../../../redux/thunks/reply-to-rematch-request.thunk";

export const RematchRequestReceived: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div>
			<div>Opponent wants a rematch.</div>
			<button onClick={() => dispatch(replyToRematchRequest("accepted"))}>Accept</button>
			<button onClick={() => dispatch(replyToRematchRequest("rejected"))}>Reject</button>
		</div>
	);
};
