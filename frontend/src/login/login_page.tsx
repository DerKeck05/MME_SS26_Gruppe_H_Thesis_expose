import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./design_css/login.css";

function LoginPage() {
    const navigate = useNavigate();
    /* speichert welche Rolle gerade ausgewählt ist
       standardmäßig ist Student ausgewählt */
    const [role, setRole] = useState("student");
    /* speichert die eingegebene Email */
    const [email, setEmail] = useState("");
    /* speichert das eingegebene Passwort */
    const [password, setPassword] = useState("");
     /* hier speichern wir später die CSS Klasse
       für den aktiven Student Button */
    let studentButtonClass = "";
     /* hier speichern wir später die CSS Klasse
       für den aktiven Professor Button */
    let professorButtonClass = "";
      /* hier wird eine Fehlermeldung gespeichert
       zb wenn Email oder Passwort falsch sind */
    const [errorMessage, setErrorMessage] = useState("");
    /* standardmäßig gibt es keine Error Box */
    let errorBox = null;


 async function LoginFunction() {
    /* Prüfung ob emial oder Passwort leer ist */
        if (email == "" || password == "") {
            /* wenn etwas fehlt wird diese Fehlermeldung gespeichert */
        setErrorMessage("Bitte E-Mail und Passwort eingeben");
        return;
        }
        /* hier schicken wir die Login Daten an unser Backend */
        const response = await fetch("http://localhost:3000/login", {
            /* POST weil wir Daten an das Backend schicken */
        method: "POST",
         /* wir schicken die Daten als JSON */
        headers: {
            "Content-Type": "application/json"
        },
        /* unsere Daten werden in JSON umgewandelt */
        body: JSON.stringify({
            email,
            password,
            role
        })
    });
    /* Antwort vom Backend wird ausgelesen */
    const data = await response.json();
    /* wenn das Backend sagt das der Login erfolgreich war */
    if (response.ok) {
        console.log("Login erfolgreich");
        console.log(data);
        /* wenn die Rolle Student ist
               geht es zum Student Dashboard */
        if (role =="student"){
            navigate("/student")
        }/* Professor Login funktioniert schon
               aber es gibt aktuell noch kein Professor Dashboard */
          if (role == "professor") {
        // TODO: Später Weiterleitung zum Professor-Dashboard einfügen
        // navigate("/professor");
        }
    } else {
         /* wenn der Login nicht funktioniert
               wird die Fehlermeldung vom Backend gespeichert */
        setErrorMessage(data.message);
    }
   } 
      /* wenn Student ausgewählt ist bekommt der
       Student Button die CSS Klasse active-role */
    if (role == "student") {
    studentButtonClass = "active-role";
    }
    /* wenn Professor ausgewählt ist bekommt der
       Professor Button die CSS Klasse active-role */
    if (role == "professor") {
    professorButtonClass = "active-role";
    }
    /* nur wenn eine Fehlermeldung vorhanden ist
       wird die Error Box erstellt */
    if (errorMessage != "") {
    errorBox = (
        /* CSS für error-box kommt aus unserer login.css */
        <div className="error-box">
            {/* hier wird die gespeicherte Fehlermeldung angezeigt */}
            {errorMessage}
        </div>
    );
   }

  return (
    /* komplette Login Seite mit Hintergrundbild */
    <div className="auth-page">
         {/* Glass Container in der Mitte */ }
        <div className="login-glass">
            

            <h1>Clevermate</h1>
            {/* Container für die Auswahl zwischen Professor und Student */}
           <div className="role-buttons">
            {/* beim klicken wird die Rolle auf Professor geändert

                        professorButtonClass enthält active-role
                        wenn Professor gerade ausgewählt ist */
                    }
            <button className={professorButtonClass} onClick={() => setRole("professor")}
                  >Professor</button>
                   {/* beim klicken wird die Rolle auf Student geändert

                        studentButtonClass enthält active-role
                        wenn Student gerade ausgewählt ist */
                    }
               <button
                   className={studentButtonClass} onClick={() => setRole("student")}
                   >Student  </button>
                  </div>

            <label>E-Mail: </label>
            <input
                 /* Email Eingabefeld */
                type="email"
                /* Text der angezeigt wird solange noch nichts eingegeben wurde */
                placeholder="Ihre E-Mail"
                /* aktueller Wert aus unserem email State */
                value={email}
                /* sobald etwas eingegeben wird
                       speichern wir den neuen Wert in email */
                onChange={(event) => setEmail(event.target.value)}
            />
             {/* Beschriftung für Passwort */}
            <label>Passwort: </label>
            <input
                /* password sorgt dafür das die Eingabe versteckt wird */
                type="password"
                /* Text solange noch nichts eingegeben wurde */
                placeholder="Passwort eingeben"
                /* aktueller Wert aus unserem password State */
                value={password}
                /* speichert jede Änderung vom Passwort */
                onChange={(event) => setPassword(event.target.value)}
            />
              {/* beim Klick wird unsere LoginFunction ausgeführt */}
            <button onClick={LoginFunction}>
                Login
            </button>
               {/* wenn mann noch keinen Account hat
                    kommt man hier zur Register Seite */  }
            <button onClick={() => navigate("/register")}>
                Registrieren
            </button>

        </div>
           {/* hier wird die Error Box angezeigt

                wenn errorBox = null ist sieht man nichts

                wenn ein Fehler vorhanden ist
                erscheint die rote Box unten rechts */
            }
        {errorBox}

    </div>
);


}

export default LoginPage;