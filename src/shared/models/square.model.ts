import { Coordinates } from "../types/coordinates.type";
import { Piece } from "./piece.model";

export class Square {
  private _piece?: Piece;

  private constructor(private _coordinates: Coordinates) {}

  placePiece(piece: Piece) {
    this._piece = piece;
  }

  removePiece() {
    delete this._piece;
  }

  public get piece() {
    return this._piece;
  }

  public get coordinates() {
    return this._coordinates;
  }

  public static create(coordinates: Coordinates) {
    return new Square(coordinates);
  }
}
