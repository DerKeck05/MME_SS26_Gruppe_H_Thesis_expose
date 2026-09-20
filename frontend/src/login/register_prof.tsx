import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MESSAGES } from "./login_fails";


function RegisterProfessorPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [chair, setChair] = useState("");

    async function RegisterFunction() {
        const response = await fetch("http://localhost:3000/register/professor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                chair
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(LOGIN_MESSAGES.REGISTER_SUCCESS);
            console.log(data);

            navigate("/");
        } else {
            console.log(LOGIN_MESSAGES.REGISTER_FAILED);
            console.log(data.message);
        }
    }

    return (
        <div>
            <h1>Professor registrieren</h1>

            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />

            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <label>Passwort:</label>
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <label>Lehrstuhl:</label>
            <input
                type="text"
                value={chair}
                onChange={(event) => setChair(event.target.value)}
            />

            <button onClick={RegisterFunction}>
                Registrieren
            </button>
        </div>
    );
}

export default RegisterProfessorPage;