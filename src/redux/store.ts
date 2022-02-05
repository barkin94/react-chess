import { configureStore } from "@reduxjs/toolkit";
import board from "./reducers/board";
import game from "./reducers/game";
import container from "../inversify.config";
import { Container } from "inversify";
import { getSocket } from "../socket/socket-io";
import { Socket } from "socket.io-client";

export const store = configureStore({
	reducer: {
		board,
		game,
	},
	middleware: (defaultMiddlewares) =>
		defaultMiddlewares({
			thunk: {
				extraArgument: { container },
			},
		}),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunkExtraArgs = { container: Container; socket: Socket };
