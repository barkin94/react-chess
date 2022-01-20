import { Piece } from "../piece/piece";
import { getPiecePropsViaId } from "../piece/piece-helper";

interface Props {
	name: string;
	isWaitingTurn: boolean;
	killedPieceIds: string[];
}

export const PlayerPanel: React.FC<Props> = (props) => {
	return (
		<div>
			<div>{props.name}</div>
			{!props.isWaitingTurn && <div>Sıra bunda</div>}
			{props.killedPieceIds.map((id) => {
				const props = getPiecePropsViaId(id);
				return <Piece id={props.id} type={props.type} color={props.color}></Piece>;
			})}
		</div>
	);
};
