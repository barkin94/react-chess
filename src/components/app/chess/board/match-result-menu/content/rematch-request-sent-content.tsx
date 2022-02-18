import { useEffect } from "react";
import { getSocket } from "../../../../../../socket/socket-io";

interface RematchRequestSentContentProps {
	onResponse: (result: "accepted" | "rejected") => void;
}
export const RematchRequestSentContent: React.FC<RematchRequestSentContentProps> = (props) => {
	useEffect(() => {
		console.log("useEffect ran");
		getSocket().on("rematch-request-result", (payload: "accepted" | "rejected") => {
			props.onResponse(payload);
		});

		return () => {
			getSocket().off("rematch-request-result");
		};
	});

	return <div>Waiting for the opponent to accept the rematch request...</div>;
};
