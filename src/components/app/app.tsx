import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Chess } from "./chess/chess";
import { GiveUpModal } from "./chess/give-up-modal/give-up-modal";
import { MatchResultModal } from "./chess/match-result-modal/match-result-modal";
import { ModalContainer } from "./modal-container/modal-container";
import { SearchingMatch } from "./searching-match/searching-match";

export const App: React.FC = () => {
	const activePage = useSelector((state: RootState) => state.game.activePage.page);

	const childComponentsForModal = [
		GiveUpModal,
		MatchResultModal
	] 

	const getView = () => {
		switch (activePage) {
			case "connecting":
				return null;
			case "searching-match":
				return <SearchingMatch />;
			case "in-match":
				return (
					<>
						<Chess />
						<ModalContainer childComponentList={childComponentsForModal}/>
					</>
				);
			default:
				return null;
		}
	};

	return getView();
};

export default App;