import React from "react";
import { Piece } from "../../../shared/models/piece.model";

interface PieceProps {
  piece: Piece;
  onClicked?: () => void;
}

export const PieceElement = (props: PieceProps) => {
  return <div>{props.piece}</div>;
};
