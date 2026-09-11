import {Link} from "react-router-dom";

function ErrorPage() {
    return (
        <div>
            <h1>Fehler!</h1>
            <p>Die gewünschte Seite wurde nicht gefunden.</p>
            <p>Klicken Sie <Link to={"/"} >hier </Link> um auf die Startseite zurückzukehren.</p>
        </div>
    );
}

export default ErrorPage;