import express from "express";
import type {Request, Response} from "express";
import calendarRoutes from "./routes/calendar-route.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());

app.use("/api/calendar", calendarRoutes)

app.get("/", (req:Request, res:Response) => {
  res.send("Hello from Server");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
