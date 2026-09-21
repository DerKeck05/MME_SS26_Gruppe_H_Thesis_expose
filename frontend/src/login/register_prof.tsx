import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MESSAGES } from "./login_fails";
import "./design_css/login.css";


function RegisterProfessorPage() {
    /* Für wechsel auf andere Seite*/
    const navigate = useNavigate();
    /* hier speichern wir den namen den der nutzer eingibt */
    const [name, setName] = useState("");
    /* email */
    const [email, setEmail] = useState("");
    /* passwort */
    const [password, setPassword] = useState("");
    /* lehrstuhl */
    const [chair, setChair] = useState("");
    /* hier speichern wir eine fehlermeldung falls etwas nicht passt */
    const [errorMessage, setErrorMessage] = useState("");

    async function RegisterFunction() {

        /* zuerst prüfen wir ob irgendein feld leer ist */
        if (name == "" || email == "" || password == "" || chair == "") {

            /* wenn etwas fehlt speichern wir diese meldung */
            setErrorMessage("Bitte alle Felder ausfüllen");

            /* return beendet die funktion sofort
               dadurch wird nichts ans backend geschickt */
            return;
        }


        /* wenn alle felder ausgefüllt sind schicken wir die daten ans backend */
        const response = await fetch(
            "http://localhost:9000/register/professor",
            {

                /* POST weil wir neue daten anlegen wollen */
                method: "POST",

                /* wir sagen dem backend das unsere daten als json kommen */
                headers: {
                    "Content-Type": "application/json"
                },

                /* hier werden unsere eingaben in json umgewandelt
                   und dann ans backend geschickt */
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    chair
                })
            }
        );

        /* antwort vom backend auslesen */
        const data = await response.json();


        /* response.ok ist true wenn die antwort erfolgreich war */
        if (response.ok) {
            /* erfolg wird zusätzlich in der console ausgegeben */
            console.log(LOGIN_MESSAGES.REGISTER_SUCCESS);
            console.log(data);

            /* nach erfolgreicher registrierung geht es zurück zum login */
            navigate("/");

        } else {

            /* wenn das backend einen fehler zurück gibt
               speichern wir die meldung in errorMessage */
            setErrorMessage(data.message);
        }
    }


    /* standardmäßig gibt es keine error box */
    let errorBox = null;


    /* nur wenn errorMessage nicht leer ist
       wird die box erstellt */
    if (errorMessage != "") {

        errorBox = (

            /* error-box kommt aus unserer login.css */
            <div className="error-box">

                {/* hier wird der eigentliche fehlertext angezeigt */}
                {errorMessage}

            </div>
        );
    }


    return (

        /* auth-page macht unseren hintergrund über den ganzen bildschirm */
        <div className="auth-page">


            {/* login-glass ist unsere glass box in der mitte */}
            <div className="login-glass">


                {/* überschrift für die professor registrierung */}
               <h2 className="register-title professor-title">
                    Registrieren als Professor
                </h2>




                {/* beschriftung für den namen */}
                <label>Name:</label>

                <input
                    /* normales texteingabefeld */
                    type="text"

                    /* value zeigt immer den aktuellen wert aus name */
                    value={name}

                    /* sobald etwas eingegeben wird
                       speichern wir den neuen wert in name */
                    onChange={(event) => setName(event.target.value)}
                />


                {/* beschriftung für die email */}
                <label>E-Mail:</label>

                <input
                    /* email eingabefeld */
                    type="email"

                    /* aktueller wert aus email */
                    value={email}

                    /* speichert jede änderung der email */
                    onChange={(event) => setEmail(event.target.value)}
                />


                {/* beschriftung für das passwort */}
                <label>Passwort:</label>

                <input
                    /* password sorgt dafür das die eingabe versteckt wird */
                    type="password"

                    /* aktueller wert aus password */
                    value={password}

                    /* speichert jede änderung vom passwort */
                    onChange={(event) => setPassword(event.target.value)}
                />


                {/* beschriftung für den lehrstuhl */}
                <label>Lehrstuhl:</label>

                <input
                    /* normales texteingabefeld */
                    type="text"

                    /* aktueller wert aus chair */
                    value={chair}

                    /* speichert jede änderung vom lehrstuhl */
                    onChange={(event) => setChair(event.target.value)}
                />


                {/* wenn mann auf den button drückt
                   wird RegisterFunction ausgeführt */}
                <button onClick={RegisterFunction}>
                    Registrieren
                </button>


            </div>


            {/* hier wird die error box angezeigt */}
            {errorBox}


        </div>
    );
}

/* dadurch können wir die seite in App.tsx importieren */
export default RegisterProfessorPage;