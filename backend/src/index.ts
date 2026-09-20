/* Express für unser Backend */
import express from "express";

/* Typen für Request und Response */
import type { Request, Response } from "express";

/* Cors damit unser Frontend auf das Backend zugreifen darf */
import cors from "cors";

/* Kalender Route von unserem aktuellen main */
import calendarRoutes from "./routes/calendar-route.js";

/* Funktionen zum Passwort verschlüsseln und prüfen */
import {
    verifyPassword,
    hashPassword
} from "./utils/password.js";

/* Funktionen für Studenten aus unserer Datenbank */
import {
    getStudentByEmail,
    createStudent
} from "./database/repos/student-repo.js";

/* Funktionen für Professoren aus unserer Datenbank */
import {
    getSupervisorByEmail,
    createSupervisor
} from "./database/repos/supervisor-repo.js";


/* Express Anwendung erstellen */
const app = express();


/* Port aus dem neuen main
   wenn nichts anderes eingestellt ist läuft das Backend auf 9000 */
const PORT = process.env.PORT || 9000;


/* erlaubt unserem Frontend auf localhost:5173
   Anfragen an das Backend zu schicken */
app.use(cors({
    origin: "http://localhost:5173"
}));


/* sorgt dafür das Express JSON Daten lesen kann */
app.use(express.json());


/* Kalender Route vom neuen main bleibt bestehen */
app.use("/api/calendar", calendarRoutes);



/* einfache Test Route um zu sehen ob das Backend läuft */
app.get("/", (req: Request, res: Response) => {

    res.send("Hello from Server");
});



/* LOGIN */
app.post("/login", async (req, res) => {

    /* Daten die vom Frontend kommen */
    const { email, password, role } = req.body;


    /* STUDENT LOGIN */
    if (role == "student") {

        /* Student mit der Email in der Datenbank suchen */
        const student = await getStudentByEmail(email);


        /* wenn kein Student gefunden wurde */
        if (!student) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* eingegebenes Passwort mit dem gespeicherten Hash vergleichen */
        const passwordCorrect = await verifyPassword(
            password,
            student.passwordHash
        );


        /* wenn Passwort falsch ist */
        if (!passwordCorrect) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* wenn alles stimmt bekommt das Frontend
           die Daten vom eingeloggten Studenten zurück */
        return res.json({
            message: "Login erfolgreich",
            role: "student",

            user: {
                id: student.id,
                name: student.name,
                email: student.email
            }
        });
    }



    /* PROFESSOR LOGIN */
    if (role == "professor") {

        /* Professor über seine Email suchen */
        const supervisor = await getSupervisorByEmail(email);


        /* wenn Professor nicht gefunden wurde */
        if (!supervisor) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* Passwort prüfen */
        const passwordCorrect = await verifyPassword(
            password,
            supervisor.passwordHash
        );


        /* Passwort stimmt nicht */
        if (!passwordCorrect) {

            return res.status(401).json({
                message: "E-Mail oder Passwort falsch"
            });
        }


        /* Login war erfolgreich */
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


    /* falls eine Rolle geschickt wird die es nicht gibt */
    return res.status(400).json({
        message: "Ungültige Rolle"
    });
});



/* STUDENT REGISTRIERUNG */
app.post("/register/student", async (req, res) => {

    /* Daten vom Frontend auslesen */
    const { name, email, password, course } = req.body;


    /* prüfen ob die Email bei einem Studenten schon existiert */
    const existingStudent = await getStudentByEmail(email);


    /* wenn die Email schon vorhanden ist */
    if (existingStudent) {

        return res.status(400).json({
            message: "E-Mail ist bereits registriert"
        });
    }


    /* Passwort wird verschlüsselt
       das normale Passwort landet also nicht in der Datenbank */
    const passwordHash = await hashPassword(password);


    /* neuen Studenten in der Datenbank erstellen */
    await createStudent(
        name,
        email,
        passwordHash,
        course
    );


    /* Erfolg an das Frontend zurückgeben */
    res.json({
        message: "Student erfolgreich registriert"
    });
});



/* PROFESSOR REGISTRIERUNG */
app.post("/register/professor", async (req, res) => {

    /* Daten vom Frontend auslesen */
    const { name, email, password, chair } = req.body;


    /* prüfen ob Professor mit dieser Email schon existiert */
    const existingProfessor = await getSupervisorByEmail(email);


    /* wenn Email schon vorhanden ist */
    if (existingProfessor) {

        return res.status(400).json({
            message: "E-Mail ist bereits registriert"
        });
    }


    /* Passwort verschlüsseln */
    const passwordHash = await hashPassword(password);


    /* Professor in der Datenbank erstellen */
    await createSupervisor(
        name,
        email,
        passwordHash,
        chair
    );


    /* Erfolg zurückgeben */
    res.json({
        message: "Professor erfolgreich registriert"
    });
});



/* Backend starten */
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});