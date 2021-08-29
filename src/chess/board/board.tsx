import React, { useContext, useEffect, useState } from "react";
import { SquareElement, SquareProps } from "./square/square";
import "./board.css";
import { BoardStateContext } from "../chess";
import { Square } from "../../shared/models/square.model";
import { pieceTypes } from "../../shared/types/piece-type";
import { Piece } from "../../shared/models/piece.model";
import { Directions } from "../../shared/enums/directions.enum";

export function Board() {
  const boardState = useContext(BoardStateContext);

  useEffect(() => {
    initSquares();
  }, []);

  const [squareProps, setSquareProps] = useState<SquareProps[][]>([]);

  const initSquares = () => {
    const data: SquareProps[][] = [];

    let startingNode = boardState.graph.getNode(Square.create({ x: 0, y: 0 }));

    if (!startingNode) throw new Error("node not found");

    let isLastColorBlack = false;

    let squareOnRight;
    let squareOnBottom;
    while (startingNode) {
      let rowProps: SquareProps[] = [
        {
          color: isLastColorBlack ? "wheat" : "chocolate",
          square: startingNode,
        },
      ];

      squareOnRight = boardState.graph.getAdjacentbByWeight(
        startingNode,
        Directions.RIGHT
      );
      while (squareOnRight) {
        rowProps.push({
          color: isLastColorBlack ? "wheat" : "chocolate",
          square: squareOnRight,
        });

        squareOnRight = boardState.graph.getAdjacentbByWeight(
          squareOnRight,
          Directions.RIGHT
        );
      }
      isLastColorBlack = !isLastColorBlack;

      data.push(rowProps);

      squareOnBottom = boardState.graph.getAdjacentbByWeight(
        startingNode,
        Directions.BOTTOM
      );

      startingNode = squareOnBottom;
    }

    //console.log(boardState.graph);
    setSquareProps(data);

    // let isLastColorBlack = false;

    // const data = boardState.squareMatrice.map((row, rowIndex) => {
    //   isLastColorBlack = !isLastColorBlack;

    //     const square = boardState.graph.getNode(
    //       Square.create({
    //         x: columnIndex,
    //         y: rowIndex,
    //       })
    //     ) as Square;
    //   return row.map((column, columnIndex) => {

    //     const data: SquareProps = {
    //       color: isLastColorBlack ? "wheat" : "chocolate",
    //       square,
    //     };

    //     isLastColorBlack = !isLastColorBlack;
    //     return data;
    //   });
    // });

    // Piece.getSquaresWithPieces().forEach((square) => {
    //   boardState.graph.updateNodeValue(
    //     Square.create(square.coordinates),
    //     square
    //   );
    // });

    //setSquareProps(data);
  };

  return (
    <div className="board">
      {squareProps &&
        squareProps.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((squareProp, columnIndex) => (
              <SquareElement
                key={columnIndex.toString() + rowIndex.toString()}
                color={squareProp.color}
                square={squareProp.square}
              ></SquareElement>
            ))}
          </div>
        ))}
    </div>
  );
}
