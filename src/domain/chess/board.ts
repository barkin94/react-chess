import { Directions } from "../../shared/enums/directions.enum";
import { Node, Graph } from "../../shared/models/graph.model";
import { Piece } from "./piece";
import { Square } from "./square";
import { Coordinates } from "../../shared/types/coordinates.type";
import { PieceColor } from "../../shared/types/piece-color";
import { pieceTypes } from "../../shared/types/piece-type";

export class Board {
  private _graph = new Graph<Square>(Square.create({ x: 0, y: 0 }));

  /**
   * A convenience array to help fill the graph without duplicate squares.
   */
  private squareMatrice: (Node<Square> | 1)[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];

  /**
   * A mapping that translates graph directions to array directions
   */
  private directionCoordinateMap = new Map<
    Directions,
    { x: number; y: number }
  >();

  constructor() {
    this.setDirectionCoordinateMap();
    this.fillSquareGraph();
    this.placePiecesOfOpponent("black");
    this.placePiecesOfSelf("white");
  }

  get squares() {
    //return Object.freeze(this.squareMatrice as Node<Square>[][]);
    return (this.squareMatrice as Node<Square>[][]).map((nodeRow) => {
      return nodeRow.map((node) => node.value);
    });
  }

  private setDirectionCoordinateMap() {
    this.directionCoordinateMap.set(Directions.LEFT, { x: -1, y: 0 });
    this.directionCoordinateMap.set(Directions.RIGHT, { x: 1, y: 0 });
    this.directionCoordinateMap.set(Directions.BOTTOM, { x: 0, y: 1 });
    this.directionCoordinateMap.set(Directions.TOP, { x: 0, y: -1 });
    this.directionCoordinateMap.set(Directions.TOP_RIGHT, { x: 1, y: -1 });
    this.directionCoordinateMap.set(Directions.BOTTOM_RIGHT, { x: 1, y: 1 });
    this.directionCoordinateMap.set(Directions.TOP_LEFT, { x: -1, y: -1 });
    this.directionCoordinateMap.set(Directions.BOTTOM_LEFT, { x: -1, y: 1 });
  }

  private fillSquareGraph() {
    this.squareMatrice[0][0] = this._graph.entryNode;

    for (let y of this.squareMatrice) {
      for (let x of y) {
        const node = x as Node<Square>;
        this.addAdjacentOrEdgeIfAvailable(node, Directions.RIGHT);
        this.addAdjacentOrEdgeIfAvailable(node, Directions.LEFT);
        this.addAdjacentOrEdgeIfAvailable(node, Directions.TOP);
        this.addAdjacentOrEdgeIfAvailable(node, Directions.BOTTOM);
        this.addAdjacentOrEdgeIfAvailable(node, Directions.TOP_RIGHT);
        this.addAdjacentOrEdgeIfAvailable(node, Directions.TOP_LEFT);
        this.addAdjacentOrEdgeIfAvailable(node, Directions.BOTTOM_RIGHT);
        this.addAdjacentOrEdgeIfAvailable(node, Directions.BOTTOM_LEFT);
      }
    }
  }

  private addAdjacentOrEdgeIfAvailable(
    sourceNode: Node<Square>,
    direction: Directions
  ) {
    const coordinates = this.getTargetSquareCoordinates(sourceNode, direction);

    if (!coordinates) {
      return;
    }

    if (this.squareMatrice[coordinates.y][coordinates.x] === 1) {
      const square = Square.create({
        x: coordinates.x,
        y: coordinates.y,
      });

      const addedNode = this._graph.addNode(square, sourceNode, direction);
      this.squareMatrice[coordinates.y][coordinates.x] = addedNode;
    } else {
      this._graph.addEdgeToNode(sourceNode, {
        target: this.squareMatrice[coordinates.y][
          coordinates.x
        ] as Node<Square>,
        weight: direction,
      });
    }
  }

  private getTargetSquareCoordinates(
    node: Node<Square>,
    direction: Directions
  ): Coordinates | undefined {
    const result = this.directionCoordinateMap.get(direction);

    if (!result) {
      throw new Error("direction not found in directionCoordinateMap");
    }

    const nodeCoordinates = node.value.coordinates;
    const boardRow = this.squareMatrice[nodeCoordinates.y + result.y];

    if (!boardRow) {
      return;
    }

    const targetSquare = boardRow[nodeCoordinates.x + result.x];

    if (!targetSquare) {
      return;
    }

    return { x: nodeCoordinates.x + result.x, y: nodeCoordinates.y + result.y };
  }

  private placePiecesOfOpponent(color: PieceColor) {
    for (let pieceType of pieceTypes) {
      Piece.getStartingPositionsForOpponent(pieceType).forEach(
        (coordinates) => {
          const node = this.squareMatrice[coordinates.y][
            coordinates.x
          ] as Node<Square>;

          const piece = Piece.initPiece(pieceType, color);
          node.value.placePiece(piece);
        }
      );
    }
  }

  private placePiecesOfSelf(color: PieceColor) {
    for (let pieceType of pieceTypes) {
      Piece.getStartingPositionsForSelf(pieceType).forEach((coordinates) => {
        const node = this.squareMatrice[coordinates.y][
          coordinates.x
        ] as Node<Square>;
        const piece = Piece.initPiece(pieceType, color);
        node.value.placePiece(piece);
      });
    }
  }
}
