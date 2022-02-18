import styles from "./player-panel.module.scss";
import { Piece } from "../piece/piece";
import { extractPiecePropsFromId } from "../piece/piece-helper";
import { Spinner } from "../../../shared/spinner/spinner";

interface Props {
	name: string;
	isWaitingTurn: boolean;
	capturedPieceIds: string[];
}

export const PlayerPanel: React.FC<Props> = (props) => {
	return (
		<div className={styles["player-panel"]}>
			<div className={styles.header}>
				<div>{props.name}</div>
				{!props.isWaitingTurn && <Spinner height="1.5em"></Spinner>}
			</div>
			<div className={styles["captured-pieces"]}>
				{props.capturedPieceIds.map((id) => {
					const props = extractPiecePropsFromId(id);
					return <Piece key={id} id={props.id} type={props.type} color={props.color}></Piece>;
				})}
			</div>
		</div>
	);
};
