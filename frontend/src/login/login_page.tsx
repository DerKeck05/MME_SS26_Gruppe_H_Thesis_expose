import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        console.log("Login fehlgeschlagen");
        console.log(data.message);
    }
   } 

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={() => setRole("student")}>Student</button>
            <button onClick={() => setRole("professor")}>Professor</button>
            <label>Email:</label>
            <input type= "email" placeholder="ihre E-Mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}/>
            <label>Passwort:</label>
            <input type= "password" placeholder="password eingeben "
              value={password}
              onChange={(event) => setPassword(event.target.value)}/>
            <button onClick={LoginFunction}>Login</button>
            <button onClick={() => navigate("/register")}> Registrieren </button>
        </div>
    );
}

export default LoginPage;