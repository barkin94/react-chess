import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Chess } from "./chess/chess";
import { modalComponents } from './modal-children';
import { ModalContainer } from "./modal-container/modal-container";
import { SearchingMatch } from "./searching-match/searching-match";

export const App: React.FC = () => {
	const activePage = useSelector((state: RootState) => state.game.activePage);

	const childComponentsForModal = modalComponents;

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