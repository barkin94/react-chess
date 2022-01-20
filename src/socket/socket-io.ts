import { io, Socket } from "socket.io-client";

let socket: Socket;
export const initSocket = () => {
	socket = io("localhost:3001");
	return socket;
};

export const getSocket = (): Socket => {
	if (!socket) {
		throw new Error("socket not found. run initSocket() first");
	}

	return socket;
};
