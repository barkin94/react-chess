import React, { useContext, useReducer } from "react";
import "./square.css";
import { Square } from "../../../shared/models/square.model";
import { SquareColor } from "../../../shared/types/square-color";
import { Node } from "../../../shared/models/graph.model";
import { PieceElement } from "../piece/piece";
import { BoardStateContext } from "../../chess";
import { BoardState } from "../../../shared/contexts/board-state.context";

export interface SquareProps {
  node: Node<Square>;
  color: SquareColor;
}

export const SquareElement: React.FC<SquareProps> = (props) => {
  //const [state, dispatch] = useReducer(fn, { x: 1 });

  const boardState = useContext(BoardStateContext);

  const onPieceClicked = () => {
    console.log("clicked " + props.node.value.piece?.type);
    //boardState.graph.entryNode.value.removePiece();
    console.log(boardState);
  };

  return (
    <span className={"square " + props.color}>
      {props.node.value.piece && (
        <PieceElement
          piece={props.node.value.piece}
          onClicked={onPieceClicked}
        ></PieceElement>
      )}
    </span>
  );
};
