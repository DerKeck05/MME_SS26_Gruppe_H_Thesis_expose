import express from "express";
import { verifyPassword, hashPassword } from "./utils/password.js";
import { getStudentByEmail, createStudent } from "../../database/repos/studentRepository.js";
import {getSupervisorByEmail,createSupervisor} from "../../database/repos/supervisorRepository.js";
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

    app.post("/register/student", async (req, res) => {
    const { name, email, password, course } = req.body;
    const existingStudent = await getStudentByEmail(email);

    if (existingStudent) {
    return res.status(400).json({
        message: "E-Mail ist bereits registriert"
    });
     }
    const passwordHash = await hashPassword(password);
     await createStudent(
        name,
        email,
        passwordHash,
        course
      )  ;
    console.log(name);
    console.log(email);
    console.log(passwordHash);
    console.log(course);

    res.json({
        message: "Registrierungsdaten angekommen"
    });
    
   });
   app.post("/register/professor", async (req, res) => {
    const { name, email, password, chair } = req.body;

    const existingProfessor = await getSupervisorByEmail(email);

    if (existingProfessor) {
        return res.status(400).json({
            message: "E-Mail ist bereits registriert"
        });
    }

    const passwordHash = await hashPassword(password);

    await createSupervisor(
        name,
        email,
        passwordHash,
        chair
    );

    res.json({
        message: "Professor erfolgreich registriert"
    });
    });
   app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
    });
