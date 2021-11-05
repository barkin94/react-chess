import React, { useContext, useEffect, useState } from "react";
import { Square, SquareProps } from "./square/square";
import "./board.css";
import { BoardStateContext } from "../chess";
import { Square as SquareModel } from "../../domain/chess/square";
import { Directions } from "../../shared/enums/directions.enum";
import { Node } from "../../shared/models/graph.model";

export function Board() {
  const boardState = useContext(BoardStateContext);

  useEffect(() => {
    placeSquaresUsingMatrice();
  }, []);

  const [squareProps, setSquareProps] = useState<SquareModel[][]>([]);

  const placeSquaresUsingMatrice = () => {
    setSquareProps(boardState.squares);
  };

  return (
    <div className="board">
      {squareProps &&
        squareProps.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((squareProp, columnIndex) => (
              <Square
                key={rowIndex.toString() + columnIndex.toString()}
                data={squareProp}
              ></Square>
            ))}
          </div>
        ))}
    </div>
  );
}
