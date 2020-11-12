import express from "express";
import routes from "./routes";
import path from "path";
import cors from "cors";

const app = express();
import "./database/connect";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(routes);

app.listen(3333, () => console.log("🏃 Running server"));
