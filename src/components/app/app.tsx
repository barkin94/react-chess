import React from "react";
import { useAppSelector } from "../../redux/store";
import { Chess } from "./chess/chess";
import { ModalContainer } from "./modal-container/modal-container";
import { SearchingMatch } from "./searching-match/searching-match";

export const App: React.FC = () => {
	const activePage = useAppSelector(state => state.game.activePage);

	const getView = () => {
		switch (activePage.name) {
			case "connecting":
				return null;
			case "searching-match":
				return <SearchingMatch />;
			case "match":
				return (
					<>
						<Chess />
						<ModalContainer/>
					</>
				);
			default:
				return null;
		}
	};

	return getView();
};

export default App;