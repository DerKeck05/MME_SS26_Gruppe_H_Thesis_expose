import {
    Link
} from "react-router-dom";


/*
This page is shown
when the requested route
does not exist.
The user can return
to the start page
using the link below.
*/
function ErrorPage() {

    return (

        <div>

            <h1>
                Fehler!
            </h1>


            <p>
                Die gewünschte Seite wurde nicht gefunden.
            </p>


            <p>
                Klicken Sie{" "}

                <Link to="/">
                    hier
                </Link>

                {" "}um auf die Startseite zurückzukehren.
            </p>

        </div>
    );
}


export default ErrorPage;