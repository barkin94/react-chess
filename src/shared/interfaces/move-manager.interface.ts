import { Coordinates } from "../types/coordinates.type";

export interface MoveManager {
  getMovableCoordinates: (location: Coordinates) => Coordinates[];
}
