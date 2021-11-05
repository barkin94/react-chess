import { Directions } from "../enums/directions.enum";
import Graph, { Node } from "../models/graph.model";
import { Piece } from "../models/piece.model";
import { Square } from "../models/square.model";
import { Coordinates } from "../types/coordinates.type";
import { PieceColor } from "../types/piece-color";
import { pieceTypes } from "../types/piece-type";

export class BoardState {
  squareMatrice: (Node<Square> | 1)[][] = [];
  graph = new Graph<Square>(Square.create({ x: 0, y: 0 }));
  private directionCoordinateMap = new Map<
    Directions,
    { x: number; y: number }
  >();

  constructor() {
    this.setSquareMatrice();
    this.setDirectionCoordinateMap();
    this.initSquares();
    this.placePiecesOfOpponent("black");
    this.placePiecesOfSelf("white");

    //this.recursivelyInitNodesForSquares(this.graph.entryNode);
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

  private setSquareMatrice() {
    for (let y = 0; y < 8; y++) {
      this.squareMatrice.push([]);

      for (let x = 0; x < 8; x++) {
        this.squareMatrice[y].push(1);
      }
    }
  }

  addAdjacentOrEdgeIfAvailable(
    sourceNode: Node<Square>,
    direction: Directions
  ) {
    const coordinates = this.getTargetSquareCoordinates(sourceNode, direction);
    if (!coordinates) {
      return;
    }

    if (this.squareMatrice[coordinates.y][coordinates.x] === 1) {
      const squareData = Square.create({
        x: coordinates.x,
        y: coordinates.y,
      });
      const addedNode = this.graph.addNode(squareData, sourceNode, direction);
      this.squareMatrice[coordinates.y][coordinates.x] = addedNode;
    } else {
      this.graph.addEdgeToNode(sourceNode, {
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
    const rowAtIndex = this.squareMatrice[nodeCoordinates.y + result.y];

    if (!rowAtIndex) {
      return;
    }

    const targetSquare = rowAtIndex[nodeCoordinates.x + result.x];

    if (!targetSquare) {
      return;
    }

    return { x: nodeCoordinates.x + result.x, y: nodeCoordinates.y + result.y };
  }

  initSquares() {
    this.squareMatrice[0][0] = this.graph.entryNode;

    for (let y of this.squareMatrice) {
      for (let x of y) {
        this.initNodesForSquares(x as Node<Square>);
      }
    }
  }
  //   private recursivelyInitNodesForSquares(
  //     node: Node<Square>,
  //     excludedNode?: Node<Square>
  //   ) {
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.RIGHT);
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.LEFT);
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.TOP);
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.BOTTOM);
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.TOP_RIGHT);
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.TOP_LEFT);
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.BOTTOM_RIGHT);
  //     this.addAdjacentOrEdgeIfAvailable(node, Directions.BOTTOM_LEFT);

  //     let adjacents = this.graph.getAllAdjacents(node);
  //     if (excludedNode) {
  //       adjacents = adjacents.filter(
  //         (adjacent) => adjacent.target.id !== excludedNode.id
  //       );
  //     }
  //     for (let adjacent of adjacents) {
  //       this.recursivelyInitNodesForSquares(adjacent.target, node);
  //     }
  //   }
  private initNodesForSquares(node: Node<Square>) {
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
