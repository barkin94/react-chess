import { Coordinates } from "../../shared/types/coordinates.type";
import { PieceColor } from "../../shared/types/piece-color";
import { Piece } from "./piece";

export class Square {
  private _piece?: Piece;
  private _color: PieceColor;

  private constructor(private _coordinates: Coordinates) {
    this._color = this.calculateColor(this.coordinates);
  }

  get color() {
    return this._color;
  }

  placePiece(piece: Piece) {
    this._piece = piece;
  }

  removePiece() {
    delete this._piece;
  }

  private calculateColor(coordinates: Coordinates): PieceColor {
    if (coordinates.y % 2 === 1) {
      return coordinates.x % 2 === 1 ? "white" : "black";
    } else {
      return coordinates.x % 2 === 1 ? "black" : "white";
    }
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
