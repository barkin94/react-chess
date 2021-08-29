import { Directions } from "../enums/directions.enum";
import { Coordinates } from "../types/coordinates.type";
import Graph from "../models/graph.model";
import { PieceType } from "../types/piece-type";
import { Piece } from "../models/piece.model";
import { Square } from "../models/square.model";

export class BoardState {
  squareMatrice: 1[][];
  graph = new Graph<Square>();
  pieceCoordinates: {
    self: Record<PieceType, Coordinates[]>;
    opponent: Record<PieceType, Coordinates[]>;
  };

  constructor() {
    this.squareMatrice = [];
    this.setSquareMatrice();
    this.setGraph();
    this.pieceCoordinates = {
      self: this.getSelfPieceCoordinates(),
      opponent: this.getOpponentPieceCoordinates(),
    };
    this.placeSquares();
    console.log(this.graph);
  }

  private placeSquares() {
    Piece.getSquaresWithPieces().forEach((square) => {
      this.graph.updateNodeValue(Square.create(square.coordinates), square);
    });
  }

  private getSelfPieceCoordinates(): Record<PieceType, Coordinates[]> {
    return {
      pawn: Piece.getStartingPositionForSelf("pawn"),
      bishop: Piece.getStartingPositionForSelf("bishop"),
      rook: Piece.getStartingPositionForSelf("rook"),
      king: Piece.getStartingPositionForSelf("king"),
      knight: Piece.getStartingPositionForSelf("knight"),
      queen: Piece.getStartingPositionForSelf("queen"),
    };
  }

  private getOpponentPieceCoordinates(): Record<PieceType, Coordinates[]> {
    return {
      pawn: Piece.getStartingPositionForOpponent("pawn"),
      bishop: Piece.getStartingPositionForOpponent("bishop"),
      rook: Piece.getStartingPositionForOpponent("rook"),
      king: Piece.getStartingPositionForOpponent("king"),
      knight: Piece.getStartingPositionForOpponent("knight"),
      queen: Piece.getStartingPositionForOpponent("queen"),
    };
  }

  private setSquareMatrice() {
    this.squareMatrice = [];
    for (let y = 0; y < 8; y++) {
      this.squareMatrice.push([]);

      for (let x = 0; x < 8; x++) {
        this.squareMatrice[y].push(1);
      }
    }
  }

  private setGraph() {
    this.setNodes();
    this.setEdges();
  }

  private setNodes() {
    for (let y = 0; y < this.squareMatrice.length; y++) {
      for (let x = 0; x < this.squareMatrice[y].length; x++) {
        this.graph.addNode(Square.create({ x, y }));
      }
    }
  }

  private setEdges() {
    for (let node of this.graph.getAllNodes()) {
      const rightNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x + 1,
          y: node.coordinates.y,
        })
      );
      if (rightNode) {
        this.graph.addEdge(node, {
          target: rightNode,
          weight: Directions.RIGHT,
        });
      }

      const leftNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x - 1,
          y: node.coordinates.y,
        })
      );
      if (leftNode) {
        this.graph.addEdge(node, { target: leftNode, weight: Directions.LEFT });
      }

      const topNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x,
          y: node.coordinates.y - 1,
        })
      );
      if (topNode) {
        this.graph.addEdge(node, { target: topNode, weight: Directions.TOP });
      }

      const bottomNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x,
          y: node.coordinates.y + 1,
        })
      );
      if (bottomNode) {
        this.graph.addEdge(node, {
          target: bottomNode,
          weight: Directions.BOTTOM,
        });
      }

      const topRightNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x + 1,
          y: node.coordinates.y - 1,
        })
      );
      if (topRightNode) {
        this.graph.addEdge(node, {
          target: topRightNode,
          weight: Directions.TOP_RIGHT,
        });
      }

      const topLeftNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x - 1,
          y: node.coordinates.y - 1,
        })
      );
      if (topLeftNode) {
        this.graph.addEdge(node, {
          target: topLeftNode,
          weight: Directions.TOP_LEFT,
        });
      }

      const bottomRightNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x + 1,
          y: node.coordinates.y + 1,
        })
      );
      if (bottomRightNode) {
        this.graph.addEdge(node, {
          target: bottomRightNode,
          weight: Directions.BOTTOM_RIGHT,
        });
      }

      const bottomLeftNode = this.graph.getNode(
        Square.create({
          x: node.coordinates.x - 1,
          y: node.coordinates.y + 1,
        })
      );
      if (bottomLeftNode) {
        this.graph.addEdge(node, {
          target: bottomLeftNode,
          weight: Directions.BOTTOM_LEFT,
        });
      }
    }
  }
}
