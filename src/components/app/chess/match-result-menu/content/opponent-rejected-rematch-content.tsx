interface RematchRequestContent {
	onSearchMatchBtnClick: () => void;
}

export const OpponentRejectedRematchContent: React.FC<RematchRequestContent> = (props) => {
	return (
		<div>
			<div>Opponent rejected your rematch request.</div>
			<button onClick={props.onSearchMatchBtnClick}>Search Match</button>
		</div>
	);
};
