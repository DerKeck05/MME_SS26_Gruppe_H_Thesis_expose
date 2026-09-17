import { useState } from "react";


function LoginPage() {
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
    } else {
        console.log("Login fehlgeschlagen");
        console.log(data.message);
    }
   } 

    if(role == "student"){
        //Logik hinzufügen bei ZEIT 
    }
    if(role == "professor"){
        //Logik einfügen 
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
            {/*überprüfung des States später entfernen  */}
            <p>{role}</p>
            <button onClick={LoginFunction}>Login</button>
        </div>
    );
}

export default LoginPage;