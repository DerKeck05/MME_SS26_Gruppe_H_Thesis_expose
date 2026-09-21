import express from "express";
import calendarRoutes from "./routes/calendar-route.js";
import chapterRoute from "./routes/chapter-route.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());

app.use("/api/calendar", calendarRoutes);
app.use("api/chapter", chapterRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
