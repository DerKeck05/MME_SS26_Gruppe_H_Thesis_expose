import { useNavigate } from "react-router-dom";
import "./design_css/login.css";


function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="auth-page">

            <div className="login-glass">

                <h1>Registrieren</h1>

                <p>Bitte eine der folgenden Rollen auswählen</p>

                <button onClick={() => navigate("/register/professor")}>
                    Professor
                </button>

                <button onClick={() => navigate("/register/student")}>
                    Student
                </button>

            </div>

        </div>
    );
}

export default RegisterPage;