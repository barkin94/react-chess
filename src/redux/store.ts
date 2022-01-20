import { configureStore } from "@reduxjs/toolkit";
import board from "./reducers/board";
import game from "./reducers/game";

export const store = configureStore({
	reducer: {
		board,
		game,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
