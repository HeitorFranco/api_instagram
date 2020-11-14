import SocketIo from "socket.io";
declare global {
  declare namespace Express {
    export interface Request {
      userId: string;
      io: SocketIo.Server;
    }
  }
}
