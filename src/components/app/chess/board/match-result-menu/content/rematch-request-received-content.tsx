import { getSocket } from "../../../../../../socket/socket-io";

interface RematchRequestReceivedContentProps {
	onResponse: (result: "accepted" | "rejected") => void;
}
export const RematchRequestReceivedContent: React.FC<RematchRequestReceivedContentProps> = (props) => {
	const handleAccept = () => {
		getSocket().emit("rematch-request-result", "accepted");
		props.onResponse("accepted");
	};

	const handleReject = () => {
		getSocket().emit("rematch-request-result", "rejected");
		props.onResponse("rejected");
	};

	return (
		<div>
			<div>Opponent wants a rematch.</div>
			<button onClick={handleAccept}>Accept</button>
			<button onClick={handleReject}>Reject</button>
		</div>
	);
};
