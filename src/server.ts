import express from "express";
import * as http from "http";
import routes from "./routes";
import path from "path";
import SocketIo from "socket.io";
import cors from "cors";
import "./database/connect";

const app = express();
const server = http.createServer(app);

const io = SocketIo(server);

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(routes);

server.listen(process.env.PORT || 3333, () => console.log("🏃 Running server"));
