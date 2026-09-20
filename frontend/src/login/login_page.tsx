import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MESSAGES } from "./login_fails";
import "./design_css/login.css";

function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let studentButtonClass = "";
    let professorButtonClass = "";


 async function LoginFunction() {
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
            role
        })
    });

    const data = await response.json();

    if (response.ok) {
        console.log("Login erfolgreich");
        console.log(data);
        if (role =="student"){
            navigate("/student")
        }
          if (role == "professor") {
        // TODO: Später Weiterleitung zum Professor-Dashboard einfügen
        // navigate("/professor");
        }
    } else {
        console.log(LOGIN_MESSAGES.LOGIN_FAILED);
        console.log(data.message);
    }
   } 
 
    if (role == "student") {
    studentButtonClass = "active-role";
    }

    if (role == "professor") {
    professorButtonClass = "active-role";
    }

return (
    <div className="auth-page">

        <div className="login-glass">
            

            <h1>Login</h1>

           <div className="role-buttons">
               <button
                   className={studentButtonClass} onClick={() => setRole("student")}
                   >Student  </button>
                 <button className={professorButtonClass} onClick={() => setRole("professor")}
                  >Professor</button>
                  </div>

            <label>E-Mail</label>
            <input
                type="email"
                placeholder="Ihre E-Mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <label>Passwort</label>
            <input
                type="password"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button onClick={LoginFunction}>
                Login
            </button>

            <button onClick={() => navigate("/register")}>
                Registrieren
            </button>

        </div>

    </div>
);


}

export default LoginPage;