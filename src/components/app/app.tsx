import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { SearchingMatch } from "../searching-match/searching-match";
import { Chess } from "../chess/chess";

export const App: React.FC = () => {
	const isConnected = useSelector((state: RootState) => state.gameState.isConnected);
	const matchStartingData = useSelector((state: RootState) => state.gameState.matchStartingData);

	const getView = () => {
		if (!isConnected) return null;

		if (!matchStartingData) return <SearchingMatch></SearchingMatch>;
		else return <Chess matchStartingData={matchStartingData}></Chess>;
	};

	return getView();
};

export default App;
