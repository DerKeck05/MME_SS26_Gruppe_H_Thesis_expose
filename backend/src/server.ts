import express from "express";
import { verifyPassword } from "./utils/password.js";
import { getStudentByEmail } from "../../database/repos/studentRepository.js";
import { getSupervisorByEmail } from "../../database/repos/supervisorRepository.js";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend läuft!"
    });
});

app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);

    res.json({
        message: "Login-Daten angekommen"
    });
});

app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});