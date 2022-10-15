import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useCases } from "../domain/domain";
import { getSocket } from "../socket/socket-io";
import board from "./reducers/board";
import game from "./reducers/game";
import modal from "./reducers/modal";

const extraArgument: AppThunkExtraArgs = {
	...useCases,
	getSocket,
};

export const store = configureStore({
	reducer: {
		board,
		game,
		modal
	},
	middleware: (defaultMiddlewares) =>
		defaultMiddlewares({
			thunk: {
				extraArgument,
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkExtraArgs = typeof useCases & { getSocket: () => Socket };

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;