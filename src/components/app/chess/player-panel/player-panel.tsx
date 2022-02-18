import "./player-panel.scss";
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
		<div className="player-panel">
			<div className="header">
				<div>{props.name}</div>
				{!props.isWaitingTurn && <Spinner height="1.5em"></Spinner>}
			</div>
			<div className="captured-pieces">
				{props.capturedPieceIds.map((id) => {
					const props = extractPiecePropsFromId(id);
					return <Piece key={id} id={props.id} type={props.type} color={props.color}></Piece>;
				})}
			</div>
		</div>
	);
};
