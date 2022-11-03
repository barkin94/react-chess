import React from "react";
import { useAppSelector } from "../../redux/store";
import { Chess } from "./chess/chess";
import { Loading } from "./loading/loading";
import { ModalContainer } from "./modal-container/modal-container";

export const App: React.FC = () => {
	const activePage = useAppSelector(state => state.game.activePage);

	const getView = () => {
		switch (activePage.name) {
			case "loading":
				return <Loading />;
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