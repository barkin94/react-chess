import { configureStore } from "@reduxjs/toolkit";
import boardState from "./reducers/board-state";
//import moveHighlight from "./reducers/move-highlight";

///console.log(boardState.reducer);
export const store = configureStore({
	reducer: {
		//		moveHighlight,
		boardState,
		//boardState: boardState.reducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
