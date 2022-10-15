import { useEffect } from "react";
import { useAppDispatch } from "../../../redux/store";
import { initMatch } from "../../../redux/thunks/init-match.thunk";
import { getSocket } from "../../../socket/socket-io";
import { Spinner } from "../../shared/spinner/spinner";
import styles from "./searching-match.module.scss";

export const SearchingMatch: React.FC = () => {
	const dispatch = useAppDispatch();

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
		<div className={styles["searching-match"]}>
			<Spinner height="2em"></Spinner>
			<div>Searching Match...</div>
		</div>
	);
};
