import "./player-panel.css";
import { Piece } from "../piece/piece";
import { extractPiecePropsFromId } from "../piece/piece-helper";

interface Props {
	name: string;
	isWaitingTurn: boolean;
	killedPieceIds: string[];
}

export const PlayerPanel: React.FC<Props> = (props) => {
	return (
		<div className="player-panel">
			<div>{props.name}</div>
			{!props.isWaitingTurn && <div>Sıra bunda</div>}
			<div className="dead-pieces">
				{props.killedPieceIds.map((id) => {
					const props = extractPiecePropsFromId(id);
					return <Piece id={props.id} type={props.type} color={props.color}></Piece>;
				})}
			</div>
		</div>
	);
};
