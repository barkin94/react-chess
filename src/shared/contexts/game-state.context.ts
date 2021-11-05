import { Piece } from "../models/piece.model";
import { PieceColor } from "../types/piece-color";

export class GameState {
  _timerLength = 60000;

  private constructor(
    private _self: PlayerData,
    private _opponent: PlayerData
  ) {}

  get timerLength() {
    return this._timerLength;
  }

  //   public static init() {
  //     const selfData: PlayerData = {
  //       color: "black",
  //       piecesOnBoard: Piece.initPiecesForSelf(),
  //       piecesOffBoard: [],
  //     };
  //     const opponentData: PlayerData = {
  //       color: "black",
  //       piecesOnBoard: Piece.initPiecesForSelf(),
  //       piecesOffBoard: [],
  //     };
  //     return new GameState(selfData, opponentData);
  //   }
}

type PlayerData = {
  color: PieceColor;
  piecesOnBoard: Piece[];
  piecesOffBoard: Piece[];
};
