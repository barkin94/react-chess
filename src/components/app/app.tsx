import React from "react";
import { Board } from "../board/board";

import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { Square } from "../../domain/chess/board/square.class";
import { StartingData } from "../../domain/chess/board/board.class";

export const App: React.FC<any> = (props) => {
	return (
		<Provider store={store}>
			<Board squares={props.squares}></Board>
		</Provider>
	);
};

export default App;
