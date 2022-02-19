import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MatchResult, searchMatch } from "../../../../redux/reducers/game";
import { AppDispatch, RootState } from "../../../../redux/store";
import { initMatch } from "../../../../redux/thunks/init-match.thunk";
import { getSocket } from "../../../../socket/socket-io";
import { MatchEndContent } from "./content/match-end-content";
import { OpponentRejectedRematchContent } from "./content/opponent-rejected-rematch-content";
import { RematchRequestReceivedContent } from "./content/rematch-request-received-content";
import { RematchRequestSentContent } from "./content/rematch-request-sent-content";

type ModalContent = "match-end" | "rematch-request-sent" | "rematch-request-received" | "rematch-rejected";

export const MatchResultMenu: React.FC<{ matchResult: MatchResult }> = (props) => {
	const dispatch = useDispatch<AppDispatch>();
	const [modalContent, setModalContent] = useState<ModalContent>("match-end");

	/**
	 * This useEffect is required for a special case where the opponent leaves the match while you are waiting for
	 * them to respond to your rematch request. If modalContent is not set to 'match-end' in this scenario, the appropriate
	 * message will not be displayed in the modal as the modal will still be showing the contents of 'rematch-request-sent'.
	 * The logic here needs improvements.
	 */
	useEffect(() => {
		if (props.matchResult === "opponent-forfeit") {
			setModalContent("match-end");
		}
	}, [props.matchResult]);

	const matchStartingData = useSelector((state: RootState) => {
		if (state.game.activePage.page !== "in-match") {
			throw new Error('active page needs to be "in-match"');
		}

		return state.game.activePage.matchStartingData;
	});

	const requestRematch = () => {
		setModalContent("rematch-request-sent");
		getSocket().emit("rematch-request");
	};

	const handleRematchRequestSentResult = (result: string) => {
		if (result === "accepted") {
			dispatch(
				initMatch({
					playerColor: matchStartingData.playerColor,
				})
			);
		} else {
			setModalContent("rematch-rejected");
		}
	};

	const handleRematchRequestReceivedResult = (result: string) => {
		if (result === "accepted") {
			dispatch(
				initMatch({
					playerColor: matchStartingData.playerColor,
				})
			);
		} else {
			dispatch(searchMatch());
		}
	};

	const searchAnotherMatch = () => {
		dispatch(searchMatch());
	};

	return (
		<div>
			{modalContent === "match-end" && (
				<MatchEndContent
					matchResult={props.matchResult}
					onRequestRematchBtnClick={requestRematch}
					onSearchMatchBtnClick={searchAnotherMatch}
					onRematchRequestReceived={() => setModalContent("rematch-request-received")}
				></MatchEndContent>
			)}
			{modalContent === "rematch-request-sent" && (
				<RematchRequestSentContent onResponse={handleRematchRequestSentResult}></RematchRequestSentContent>
			)}
			{modalContent === "rematch-rejected" && (
				<OpponentRejectedRematchContent
					onSearchMatchBtnClick={searchAnotherMatch}
				></OpponentRejectedRematchContent>
			)}
			{modalContent === "rematch-request-received" && (
				<RematchRequestReceivedContent
					onResponse={handleRematchRequestReceivedResult}
				></RematchRequestReceivedContent>
			)}
		</div>
	);
};
