import React, { useEffect, useState } from "react";
import { Board } from "./board/board";
import { BoardState } from "../shared/contexts/board-state.context";
import { GameState } from "../shared/contexts/game-state.context";

const boardState = new BoardState();
export const BoardStateContext = React.createContext(boardState);
//export const GameStateContext = React.createContext(GameState.init());

export function Chess() {
  return (
    <BoardStateContext.Provider value={boardState}>
      <Board></Board>
    </BoardStateContext.Provider>
  );
}

export default Chess;
