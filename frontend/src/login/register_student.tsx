import { useState } from "react";





function RegisterStudentPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
     const [course, setCourse] = useState("");

    return (
        <div>
            <h1>Student registrieren</h1>

            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
           <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <input
                type="text"
                value={course}
                onChange={(event) => setCourse(event.target.value)}
            />


        </div>
    );
}

export default RegisterStudentPage;