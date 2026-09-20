import express from "express";
import { verifyPassword } from "./utils/password.js";
import { getStudentByEmail } from "../../database/repos/studentRepository.js";
import { getSupervisorByEmail } from "../../database/repos/supervisorRepository.js"; 
import cors from "cors";


const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend läuft!"
    });
});

app.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    if (role == "student"){
        const student = await getStudentByEmail(email);

        if (!student){
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });

        }
        const passwordCorrect = await verifyPassword (
            password,
            student.passwordHash
        );

        if (!passwordCorrect){
            return res.status(401).json({
                message: "Emaio. Passwort falsch"
            });
        }
        return res.json({
            message: "Login erflog",
            role: "student",
            user: {
                id:student.id,
                name:student.name,
                email: student.email,
            }
        });
    }
        if (role === "professor") {
        const supervisor = await getSupervisorByEmail(email);

        if (!supervisor) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }

        const passwordCorrect = await verifyPassword(
            password,
            supervisor.passwordHash
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }

        return res.json({
            message: "Login erfolgreich",
            role: "professor",
            user: {
                id: supervisor.id,
                name: supervisor.name,
                email: supervisor.email
            }
        });
    }

    return res.status(400).json({
        message: "Ungültige Rolle"
    });
 });

   app.post("/register/student", (req, res) => {
    const { name, email, password, course } = req.body;

    console.log(name);
    console.log(email);
    console.log(password);
    console.log(course);

    res.json({
        message: "Registrierungsdaten angekommen"
    });
   });

    app.listen(3000, () => {
     console.log("Server läuft auf Port 3000");
}); 
