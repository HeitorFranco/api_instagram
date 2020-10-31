import express from "express";
import routes from "./routes";

const app = express();
import "./database/connect";

app.use(express.json());
app.use(routes);

app.listen(3333, () => console.log("🏃 Running server"));
