import { AsyncThunkPayloadCreator, configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useCases } from "../domain/domain";
import { getSocket, initSocket } from "../socket/socket-io";
import board from "./reducers/board";
import game from "./reducers/game";
import modal from "./reducers/modal";

export interface Socket {
	on: <T = void>(eventName: string, callback: (args: T) => void) => void,
	off: (eventName: string) => void
	emit: <T>(eventName: string, payload?: T) => void
}

type AppThunkExtraArgs = 
	typeof useCases &
	{
		initSocket: () => Promise<Socket>,
		getSocket: () => Socket 
	};


const extraArgument: AppThunkExtraArgs = {
	...useCases,
	getSocket,
	initSocket
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

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type AppDispatch = typeof store.dispatch;
type AppAsyncThunkConfig = {
	state: RootState;
	dispatch: AppDispatch;
	extra: AppThunkExtraArgs;
};

export const useAppDispatch: () => AppDispatch = useDispatch;

// Exported as function to avoid "can't access lexical declaration before initialization" error
export function appCreateAsyncThunk<Returned, ThunkArg>(
	typePrefix: string,
	payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, AppAsyncThunkConfig>
) {
	return createAsyncThunk<Returned, ThunkArg, AppAsyncThunkConfig>(typePrefix, payloadCreator);
} 