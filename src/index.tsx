import "./inversify.config";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import App from "./components/app/app";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { initSocket } from "./socket/socket-io";
import { initServerEventHandlers } from "./socket/socket-io-events";
import ReactModal from "react-modal";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

ReactModal.setAppElement(document.getElementById("root")!);
const socket = initSocket();
initServerEventHandlers(socket, store);
