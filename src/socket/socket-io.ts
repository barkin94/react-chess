import { io } from "socket.io-client";
import { Socket } from "../redux/store";

let socket: Socket;

/**
 * Connects to the server, and resolves on connection
 * @returns connected socket 
 */
export const initSocket = async (): Promise<Socket> => {
	const conn = io(process.env.REACT_APP_SOCKET_URL || "localhost:3001");
	
	return new Promise(resolve => {
		conn.on('connect', () => {
			const connectionSocket: Socket = {
				emit: conn.emit,
				off: conn.off,
				on: conn.on
			}

			socket = connectionSocket;
			resolve(socket)
		})
	})
};

export const getSocket = (): Socket => {
	if (!socket) {
		throw new Error("socket not found. run initSocket() first");
	}

	return socket;
};
