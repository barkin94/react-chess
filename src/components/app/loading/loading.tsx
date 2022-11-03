import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { initSocketConnection } from "../../../redux/thunks/init-socket-connection.thunk";
import { searchMatch } from "../../../redux/thunks/search-match.thunk";
import { Spinner } from "../../shared/spinner/spinner";
import styles from "./loading.module.scss";

export const Loading: React.FC = () => {
	const dispatch = useAppDispatch();
	const socketConnectionStatus = useAppSelector(state => state.game.socketStataus)
	const [dots, setDots] = useState('');

	const getLoadingText = () => {
		switch(socketConnectionStatus) {
			case "connecting":
				return "Connecting";
			case "connected":
				return "Searching Match"
		}
	}

	useEffect(() => {
		let counter = 0;
		const interval = setInterval(() => {
			counter++;
			if (counter === 4)
				counter = 0;
			
			setDots('.'.repeat(counter))
		}, 1000)

		return () => clearInterval(interval);
	}, [setDots])

	useEffect(() => {
		if(socketConnectionStatus === 'not-connected') {
			dispatch(initSocketConnection())
		} else if(socketConnectionStatus === 'connected') {
			dispatch(searchMatch())
		}

	}, [socketConnectionStatus, dispatch]);

	return (
		<div className={styles["loading"]}>
			<Spinner height="2em"></Spinner>
			<div className={styles["loading-text"]}>
				{ getLoadingText() }
				<span className={styles["dots"]}>{ dots }</span>
			</div>
		</div>
	);
};
