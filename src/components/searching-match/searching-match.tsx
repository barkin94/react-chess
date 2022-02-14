import "./searching-match.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { initMatch } from "../../redux/thunks/init-match.thunk";
import { getSocket } from "../../socket/socket-io";

export const SearchingMatch: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const socket = getSocket();
		socket.emit("search-match");

		socket.on("matchFound", (args) => {
			dispatch(initMatch({ isStartingFirst: args.isStartingFirst, playerColor: args.color }));
		});

		return () => {
			socket.off("match-found");
		};
	});

	return <div className="searching-match">Searching Match...</div>;
};
