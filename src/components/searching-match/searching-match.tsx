import "./searching-match.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { initMatch } from "../../redux/thunks/init-match.thunk";
import { getSocket } from "../../socket/socket-io";
import { Spinner } from "../chess/player-panel/spinner/spinner";

export const SearchingMatch: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const socket = getSocket();
		socket.emit("search-match");

		socket.on("matchFound", (args) => {
			dispatch(initMatch({ playerColor: args.color }));
		});

		return () => {
			socket.off("match-found");
		};
	});

	return (
		<div className="searching-match">
			<Spinner height="2em"></Spinner>
			<div>Searching Match...</div>
		</div>
	);
};
