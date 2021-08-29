import React, { useContext } from "react";
import "./square.css";
import { BoardStateContext } from "../../../chess/chess";
import { Square } from "../../../shared/models/square.model";
import { SquareColor } from "../../../shared/types/square-color";

export interface SquareProps {
  square: Square;
  color: SquareColor;
}

export const SquareElement: React.FC<SquareProps> = (props) => {
  const boardContext = useContext(BoardStateContext);
  const piece = boardContext.graph.getNode(props.square)?.piece;
  console.log(piece);
  return (
    <div className={"square " + props.color}>
      {piece && <div>{piece.type}</div>}
    </div>
  );
};
