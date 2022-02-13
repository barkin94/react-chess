import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { SearchingMatch } from "../searching-match/searching-match";
import { Chess } from "../chess/chess";

export const App: React.FC = () => {
	const activePage = useSelector((state: RootState) => state.game.activePage);
	const getView = () => {
		switch (activePage.page) {
			case "connecting":
				return null;
			case "searching-match":
				return <SearchingMatch></SearchingMatch>;
			case "in-match":
				return <Chess></Chess>;
			default:
				return null;
		}
	};

	return getView();
};

export default App;
