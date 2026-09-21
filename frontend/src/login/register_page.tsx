import { useNavigate } from "react-router-dom";
import "./design_css/login.css";


function RegisterPage() {
      /* Zum navigieren auf andere Seite */
    const navigate = useNavigate();

    return (
        /* auth-page für Seitenbereich */
        <div className="auth-page">
              {/* luiqid class box*/}
            <div className="login-glass">

                <h1>Registrieren</h1>

                <p>Bitte eine der folgenden Rollen auswählen</p>
                  {/* Wenn mann auf Professor klickt
                    wird man zur Professor Registrierung weitergeleitet */}
                <button onClick={() => navigate("/register/professor")}>
                    Professor
                </button>
                 {/* Wenn mann auf Student klickt
                    wird man zur Student Registrierung weitergeleitet */}
                <button onClick={() => navigate("/register/student")}>
                    Student
                </button>

            </div>

        </div>
    );
}
/* Dadurch können wir die RegisterPage
   in App.tsx importieren und benutzen */
export default RegisterPage;