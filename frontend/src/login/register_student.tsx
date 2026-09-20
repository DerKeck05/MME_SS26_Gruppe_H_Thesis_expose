import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MESSAGES } from "./login_fails";
import "./design_css/login.css";


function RegisterStudentPage() {
    /* Wird benutzt, um nach erfolgreicher Registrierung
       wieder auf eine andere Seite zu wechseln */
    const navigate = useNavigate();
    /* Speichert den eingegebenen Namen */
    const [name, setName] = useState("");
    /* Speichert die eingegebene E-Mail */
    const [email, setEmail] = useState("");
    /* Speichert das eingegebene Passwort */
    const [password, setPassword] = useState("");
    /* Speichert den eingegebenen Studiengang/Kurs */
    const [course, setCourse] = useState("");
    /* Speichert eine mögliche Fehlermeldung
       Am Anfang ist die Meldung leer */
    const [errorMessage, setErrorMessage] = useState("");

    async function RegisterFunction() {

        /* Prüft zuerst, ob irgendein Feld leer ist */
        if (name == "" || email == "" || password == "" || course == "") {

            /* Holt den Text aus login_fails.ts */
            
              console.log(LOGIN_MESSAGES);

               setErrorMessage(LOGIN_MESSAGES.REGISTER_FIELDS_MISSING);
            /* Beendet die Funktion sofort.
               Dadurch wird nichts an das Backend geschickt */
            return;
        }


        /* Schickt die eingegebenen Daten ans Backend */
        const response = await fetch("http://localhost:3000/register/student", {

            /* POST bedeutet:
               Wir schicken Daten ans Backend */
            method: "POST",

            /* Sagt dem Backend, dass wir JSON schicken */
            headers: {
                "Content-Type": "application/json"
            },

            /* Wandelt unsere Daten in JSON um */
            body: JSON.stringify({
                name,
                email,
                password,
                course
            })
        });


        /* Liest die Antwort vom Backend aus */
        const data = await response.json();


        /* Wenn das Backend eine erfolgreiche Antwort schickt */
        if (response.ok) {

            /* Erfolg nur in der Konsole ausgeben */
            console.log(LOGIN_MESSAGES.REGISTER_SUCCESS);
            console.log(data);

            /* Nach erfolgreicher Registrierung
               zurück zum Login */
            navigate("/");

        } else {

            /* Wenn etwas nicht funktioniert,
               speichern wir die Meldung vom Backend.

               Beispiel:
               "E-Mail ist bereits registriert"

               Dadurch wird weiter unten unsere Error-Box angezeigt */
            setErrorMessage(data.message);
        }
    }



    /* Am Anfang gibt es keine Error-Box */
    let errorBox = null;


    /* Wenn in errorMessage ein Text gespeichert wurde,
       erstellen wir die rote Fehlerbox */
    if (errorMessage != "") {

        errorBox = (
            <div className="error-box">

                {/* Gibt den gespeicherten Fehlertext aus */}
                {errorMessage}

            </div>
        );
    }



    return (
        <div className="auth-page">

            {/* Unser Liquid-Glass-Container */}
            <div className="login-glass">


                {/* Überschrift der Student-Registrierung */}
                <h2 className="register-title">
                    Registrieren als Student
                </h2>


                {/* Eingabe für den Namen */}
                <label>Name:</label>

                <input
                    type="text"
                    value={name}

                    /* Bei jeder Eingabe wird der neue Wert
                       in name gespeichert */
                    onChange={(event) => setName(event.target.value)}
                />


                {/* Eingabe für die E-Mail */}
                <label>E-Mail:</label>

                <input
                    type="email"
                    value={email}

                    /* Speichert die eingegebene E-Mail */
                    onChange={(event) => setEmail(event.target.value)}
                />


                {/* Eingabe für das Passwort */}
                <label>Passwort:</label>

                <input
                    type="password"
                    value={password}

                    /* Speichert das eingegebene Passwort */
                    onChange={(event) => setPassword(event.target.value)}
                />


                {/* Eingabe für den Kurs*/}
                <label>Kurs:</label>

                <input
                    type="text"
                    value={course}

                    /* Speichert den eingegebenen Kurs */
                    onChange={(event) => setCourse(event.target.value)}
                />


                {/* Beim Klick wird RegisterFunction ausgeführt */}
                <button onClick={RegisterFunction}>
                    Registrieren
                </button>

            </div>


            {/* Hier wird die Error-Box angezeigt.

                Wenn kein Fehler vorhanden ist,
                ist errorBox = null und React zeigt nichts an.

                Wenn ein Fehler vorhanden ist,
                erscheint unsere .error-box unten rechts. */}
            {errorBox}

        </div>
    );
}
export default RegisterStudentPage;