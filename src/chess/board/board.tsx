import React, { useContext, useEffect, useState } from "react";
import { SquareElement, SquareProps } from "./square/square";
import "./board.css";
import { BoardStateContext } from "../chess";
import { Square } from "../../shared/models/square.model";
import { Directions } from "../../shared/enums/directions.enum";
import { Node } from "../../shared/models/graph.model";

export function Board() {
  const boardState = useContext(BoardStateContext);

  useEffect(() => {
    placeSquaresUsingMatrice();
    //initSquaresFromGraph();
  }, []);

  const [squareProps, setSquareProps] = useState<SquareProps[][]>([]);

  const placeSquaresUsingMatrice = () => {
    let isLastColorChocolate = false;

    const data: SquareProps[][] = boardState.squareMatrice.map((rowOfNodes) => {
      isLastColorChocolate = !isLastColorChocolate;

      return rowOfNodes.map((node) => {
        const squareProp: SquareProps = {
          node: node as Node<Square>,
          color: isLastColorChocolate ? "wheat" : "chocolate",
        };

        isLastColorChocolate = !isLastColorChocolate;

        return squareProp;
      });
    });

    setSquareProps(data);
  };
  const initSquaresFromGraph = () => {
    // const data: SquareProps[][] = [];
    // let startingNode: Node<Square> | undefined = boardState.graph.entryNode;
    // if (!startingNode) throw new Error("starting node not found");
    // let isLastColorBlack = false;
    // let squareOnRight;
    // let squareOnBottom;
    // while (startingNode) {
    //   let rowProps: SquareProps[] = [
    //     {
    //       color: isLastColorBlack ? "wheat" : "chocolate",
    //       node: startingNode,
    //     },
    //   ];
    //   squareOnRight = boardState.graph.getAdjacentByWeight(
    //     startingNode,
    //     Directions.RIGHT
    //   );
    //   while (squareOnRight) {
    //     rowProps.push({
    //       color: isLastColorBlack ? "wheat" : "chocolate",
    //       node: squareOnRight,
    //     });
    //     squareOnRight = boardState.graph.getAdjacentByWeight(
    //       squareOnRight,
    //       Directions.RIGHT
    //     );
    //     isLastColorBlack = !isLastColorBlack;
    //   }
    //   data.push(rowProps);
    //   squareOnBottom = boardState.graph.getAdjacentByWeight(
    //     startingNode,
    //     Directions.BOTTOM
    //   );
    //   startingNode = squareOnBottom;
    // }
    // setSquareProps(data);
  };

  return (
    <div className="board">
      {squareProps &&
        squareProps.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((squareProp, columnIndex) => (
              <SquareElement
                key={squareProp.node.id}
                color={squareProp.color}
                node={squareProp.node}
              ></SquareElement>
            ))}
          </div>
        ))}
    </div>
  );
}
