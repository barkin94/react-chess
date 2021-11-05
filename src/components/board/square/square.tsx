import React, { useContext, useReducer } from "react";
import "./square.css";
import { Square as SquareModel } from "../../../domain/chess/square";
import { SquareColor } from "../../../shared/types/square-color";
import { Node } from "../../../shared/models/graph.model";
import { PieceElement } from "../../piece/piece";
import { BoardStateContext } from "../../chess";
import { BoardState } from "../../../shared/contexts/board-state.context";

export interface SquareProps {
  //node: Node<SquareModel>;
  data: SquareModel;
}

export const Square: React.FC<SquareProps> = (props) => {
  //const [state, dispatch] = useReducer(fn, { x: 1 });

  const onPieceClicked = () => {
    console.log("clicked " + props.data.piece?.type);
    console.log();
    //boardState.graph.entryNode.value.removePiece();
  };

  const getColorClass = () => {
    return props.data.color === "black" ? "chocolate" : "wheat";
  };

  return (
    <span className={"square " + getColorClass()}>
      {props.data.piece && (
        <PieceElement
          piece={props.data.piece}
          onClicked={onPieceClicked}
        ></PieceElement>
      )}
    </span>
  );
};
