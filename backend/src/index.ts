/* Express für unser Backend */
import express from "express";

/* CORS damit unser Frontend auf das Backend zugreifen darf */
import cors from "cors";

/* Unsere Routes */
import calendarRoutes from "./routes/calendar-route.js";
import authRoutes from "./routes/auth-route.js";
import chapterRoute from "./routes/chapter-route.js";


/* Express Anwendung erstellen */
const app = express();


/* Port aus der Umgebungsvariable
   wenn nichts anderes eingestellt ist, läuft das Backend auf 3000 */
const PORT = process.env.PORT || 3000;


/* Erlaubt unserem Frontend Anfragen an das Backend zu schicken */
app.use(cors({
    origin: "http://localhost:5173"
}));


/* Damit Express JSON-Daten aus Requests lesen kann */
app.use(express.json());


/* =========================
   ROUTES
   ========================= */

/* Kalender */
app.use("/api/calendar", calendarRoutes);

/* Login und Registrierung */
app.use("/api/auth", authRoutes);
/* Chapter */
app.use("/api/chapter", chapterRoute)


/* =========================
   SERVER STARTEN
   ========================= */

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
