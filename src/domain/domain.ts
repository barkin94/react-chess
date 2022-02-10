import container from "../inversify.config";
import { GetPossibleMoves } from "./use-cases/get-possible-moves";
import { InitMatch } from "./use-cases/init-match";
import { MovePiece } from "./use-cases/move-piece";

export const useCases = {
	getPossibleMoves: container.get(GetPossibleMoves),
	initMatch: container.get(InitMatch),
	movePiece: container.get(MovePiece),
};
