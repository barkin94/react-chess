interface Props {
	name: string;
	isWaitingTurn: boolean;
}

export const PlayerPanel: React.FC<Props> = (props) => {
	return (
		<div>
			<div>{props.name}</div>
			{!props.isWaitingTurn && <div>Sıra bunda</div>}
		</div>
	);
};
