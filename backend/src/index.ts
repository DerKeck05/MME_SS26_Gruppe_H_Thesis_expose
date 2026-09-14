import express from "express";
import type {Request, Response} from "express";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());

app.get("/", (req:Request, res:Response) => {
  res.send("Hello from Server");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
