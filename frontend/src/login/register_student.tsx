import { useState } from "react";





function RegisterStudentPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [course, setCourse] = useState("");

    function RegisterFunction() {
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(course);
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