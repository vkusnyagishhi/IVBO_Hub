import { PayloadAction } from "@reduxjs/toolkit";

const baseString = 'wss://ws.twodev.cc/ivbo?client=user_';

class Socket {
    socket: WebSocket | null;

    constructor() {
        this.socket = null;
    }

    connect(url: string) {
        if (!this.socket) this.socket = new WebSocket(url);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    send(message: any) {
        if (this.socket) this.socket.send(JSON.stringify(message));
    }

    on(eventName: string, callback: any) {
        if (this.socket) this.socket.addEventListener(eventName, callback);
    }
}

const socketMiddleware = (socket: Socket) => (params: any) => (next: any) => (action: PayloadAction<any>) => {
    if (action.type === 'socket/connect') {
        socket.connect(baseString + action.payload);

        socket.on('open', () => {
            console.log('wscon');
        });

        socket.on('message', (e: any) => {
            const data = JSON.parse(e.data);
            if (data.action === 'opened') params.dispatch({ action: 'misc/addEditingHW', payload: data.subject });
            else if (data.action === 'closed') params.dispatch({ action: 'misc/removeEditingHW', payload: data.subject });
        });

        socket.on('close', () => {
            setTimeout(() => socket.connect(baseString + action.payload), 1000);
        });
    } else if (action.type === 'socket/send') socket.send(action.payload);
    else if (action.type === 'socket/disconnect') socket.disconnect();

    return next(action);
}

export { Socket, socketMiddleware };