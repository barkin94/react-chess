import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MatchResult, searchMatch } from "../../../../../redux/reducers/game";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { initMatch } from "../../../../../redux/thunks/init-match.thunk";
import { getSocket } from "../../../../../socket/socket-io";
import { MatchEndContent } from "./content/match-end-content";
import { OpponenetRejectedRematchContent } from "./content/opponent-rejected-rematch-content";
import { RematchRequestReceivedContent } from "./content/rematch-request-received-content";
import { RematchRequestSentContent } from "./content/rematch-request-sent-content";

type ModalContent = "match-end" | "rematch-request-sent" | "rematch-request-received" | "rematch-rejected";

export const MatchResultMenu: React.FC<{ matchResult: MatchResult }> = (props) => {
	const dispatch = useDispatch<AppDispatch>();
	const [modalContent, setModalContent] = useState<ModalContent>("match-end");

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

	const handleRematchRequestResult = (result: string) => {
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
				<RematchRequestSentContent onResponse={handleRematchRequestResult}></RematchRequestSentContent>
			)}
			{modalContent === "rematch-rejected" && (
				<OpponenetRejectedRematchContent
					onSearchMatchBtnClick={searchAnotherMatch}
				></OpponenetRejectedRematchContent>
			)}
			{modalContent === "rematch-request-received" && (
				<RematchRequestReceivedContent onResponse={handleRematchRequestResult}></RematchRequestReceivedContent>
			)}
		</div>
	);
};
