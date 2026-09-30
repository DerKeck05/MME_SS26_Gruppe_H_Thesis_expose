import express from "express";
import cors from "cors";

import calendarRoutes from "./routes/calendar-route.js";
import authRoutes from "./routes/auth-route.js";
import chapterRoute from "./routes/chapter-route.js";
import studentRoute from "./routes/student-route.js";
import thesisRoute from "./routes/thesis-route.js";
import universityRoute from "./routes/university-route.js";
import faqRoute from "./routes/faq-route.js";
import feedbackEntryRoute from "./routes/feedback-entry-route.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

/* Kalender */
app.use("/api/calendar", calendarRoutes);

/* Login und Registrierung */
app.use("/api/auth", authRoutes);

/* Chapter */
app.use("/api/chapter", chapterRoute);

/* Student */
app.use("/api/student", studentRoute);

/* Professor Dashboard */
app.use("/api/students", studentRoute);

/* Thesis */
app.use("/api/thesis", thesisRoute);

/* Hochschulen, Studiengänge und Professoren */
app.use("/api/universities", universityRoute);

/* FAQ */
app.use("/api/faq", faqRoute);

/* Feedback */
app.use("/api/feedback", feedbackEntryRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});