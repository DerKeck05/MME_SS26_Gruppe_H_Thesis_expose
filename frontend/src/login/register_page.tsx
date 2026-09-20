import { useNavigate } from "react-router-dom";



function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div>
          <h1>Registrieren</h1>

    <p>Bitte eine der folgenden Rollen auswählen</p>
      <button onClick={() => navigate("/register/professor")}>
        Professor
    </button>

    <button onClick={() => navigate("/register/student")}>
        Student
    </button>

    </div>
    );
}

export default RegisterPage;