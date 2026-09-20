import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_MESSAGES } from "./login_fails";




function RegisterStudentPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [course, setCourse] = useState("");
    

   async function RegisterFunction() {
    const response = await fetch("http://localhost:3000/register/student", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password,
            course
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
            <h1>Student registrieren</h1>

            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <label>Email</label>
           <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <label>Kurs</label>
            <input
                type="text"
                value={course}
                onChange={(event) => setCourse(event.target.value)}
            />
            <button onClick={RegisterFunction}>Registrieren</button>

        </div>
    );
}

export default RegisterStudentPage;