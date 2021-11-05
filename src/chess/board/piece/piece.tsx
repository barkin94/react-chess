import { useReducer } from "react";
import { Piece } from "../../../shared/models/piece.model";
import { pieceClick } from "../../../shared/reducers/piece.reducer";
import "./piece.css";
interface PieceProps {
  piece: Piece;
  onClicked?: () => void;
}

export const PieceElement = (props: PieceProps) => {
  //const [state, dispatch] = useReducer(pieceClick, initialState);
  return (
    <span
      onClick={props.onClicked}
      className={"piece"}
      dangerouslySetInnerHTML={{ __html: props.piece.icon }}
    ></span>
  );
};
