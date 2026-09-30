import { useNavigate } from "react-router-dom";
import "./design_css/login.css";


/*
This page lets the user choose
which type of account should be created.
*/
function RegisterPage() {

    /*
    useNavigate is used
    to change to another page
    after clicking one of the buttons.
    */
    const navigate =
        useNavigate();


    return (

        /*
        auth-page is used
        for the complete page layout
        and background.
        */
        <div className="auth-page">

            {/*
            login-glass creates
            the glass container
            in the middle of the page.
            */}
            <div className="login-glass">

                <h1>
                    Registrieren
                </h1>


                <p>
                    Bitte eine der folgenden Rollen auswählen
                </p>


                {/*
                If the professor button is clicked,
                the user is sent
                to the professor registration page.
                */}
                <button
                    onClick={() =>
                        navigate("/register/professor")
                    }
                >
                    Professor
                </button>


                {/*
                If the student button is clicked,
                the user is sent
                to the student registration page.
                */}
                <button
                    onClick={() =>
                        navigate("/register/student")
                    }
                >
                    Student
                </button>

            </div>

        </div>
    );
}


/*
Makes RegisterPage available
for other files like App.tsx.
*/
export default RegisterPage;