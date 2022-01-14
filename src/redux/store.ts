import { configureStore } from "@reduxjs/toolkit";
import boardState from "./reducers/board-state";
import gameState from "./reducers/game-state";

export const store = configureStore({
	reducer: {
		boardState,
		gameState,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
