import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/app/app";
import { GiveUp } from "./components/app/modal-children/give-up";
import { MatchEnd } from "./components/app/modal-children/match-end";
import { OpponentLeftMatch } from "./components/app/modal-children/opponent-left-match";
import { OpponentRejectedRematch } from "./components/app/modal-children/opponent-rejected-rematch";
import { RematchRequestReceived } from "./components/app/modal-children/rematch-request-received";
import { RematchRequestSent } from "./components/app/modal-children/rematch-request-sent";
import { setModalConfig } from "./components/app/modal-container/modal-container";
import "./index.scss";
import "./inversify.config";
import { GIVE_UP, MATCH_END, OPPONENT_LEFT_MATCH, OPPONENT_REJECTED_REMATCH, REMATCH_REQUEST_RECEIVED } from "./redux/modal-component-names";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { initSocket } from "./socket/socket-io";
import { initServerEventHandlers } from "./socket/socket-io-events";

setModalConfig([
	{ name: GIVE_UP, component: GiveUp },
	{ name: MATCH_END, component: MatchEnd },
	{ name: OPPONENT_LEFT_MATCH, component: OpponentLeftMatch },
	{ name: OPPONENT_REJECTED_REMATCH, component: OpponentRejectedRematch },
	{ name: REMATCH_REQUEST_RECEIVED, component: RematchRequestReceived },
	{ name: REMATCH_REQUEST_RECEIVED, component: RematchRequestSent },
]);

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
if (process.env.NODE_ENV === "production") {
	reportWebVitals();
}

const socket = initSocket();
initServerEventHandlers(socket, store);
