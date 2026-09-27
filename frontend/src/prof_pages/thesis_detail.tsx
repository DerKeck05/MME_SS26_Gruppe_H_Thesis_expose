import {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import CalendarPreview
    from "../student_pages/student_dashboard/cards/calendar-preview.tsx";


type Thesis = {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    studentId: number;
    supervisorId: number;
};

function ThesisDetail() {

    const {id} =
        useParams();


    const [thesis, setThesis] =
        useState<Thesis | null>(null);


    const [errorMessage, setErrorMessage] =
        useState("");


    useEffect(() => {

        async function loadThesis() {

            try {

                setErrorMessage("");


                const response =
                    await fetch(
                        "http://localhost:3000/api/thesis/" + id
                    );


                if (!response.ok) {

                    throw new Error(
                        "Thesis konnte nicht geladen werden"
                    );
                }


                const data =
                    await response.json();


                setThesis(
                    data
                );


            } catch (error) {

                console.error(
                    error
                );


                setErrorMessage(
                    "Thesis konnte nicht geladen werden"
                );
            }
        }


        loadThesis();

    }, [id]);


    function formatDate(
        date: string
    ) {

        if (
            date == null ||
            date == ""
        ) {

            return "–";
        }


        return new Date(
            date
        ).toLocaleDateString(
            "de-DE"
        );
    }


    function getDaysRemaining() {

        if (
            thesis == null ||
            thesis.endDate == null
        ) {

            return null;
        }


        const today =
            new Date();


        const deadline =
            new Date(
                thesis.endDate
            );


        const difference =
            deadline.getTime() -
            today.getTime();


        return Math.ceil(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );
    }


    if (
        errorMessage != ""
    ) {

        return (

            <div className="dashboard-content">

                <h2>
                    Fehler
                </h2>

                <p>
                    {errorMessage}
                </p>

            </div>
        );
    }


    if (
        thesis == null
    ) {

        return (

            <div className="dashboard-content">

                <p>
                    Thesis wird geladen...
                </p>

            </div>
        );
    }


    const daysRemaining =
        getDaysRemaining();


    return (

        <div className="dashboard-content">


            <h2>
                {thesis.title}
            </h2>


            <CalendarPreview
                events={[]}
            />


            <div className="card-row">


                <div className="placeholder">

                    <h3>
                        Thesis
                    </h3>


                    <p>
                        Startdatum:{" "}
                        {
                            formatDate(
                                thesis.startDate
                            )
                        }
                    </p>


                    <p>
                        Abgabedatum:{" "}
                        {
                            formatDate(
                                thesis.endDate
                            )
                        }
                    </p>

                </div>


                <div className="placeholder">

                    <h3>
                        Verbleibende Zeit
                    </h3>


                    {
                        daysRemaining == null && (

                            <p>
                                Kein Abgabedatum vorhanden.
                            </p>
                        )
                    }


                    {
                        daysRemaining != null &&
                        daysRemaining >= 0 && (

                            <p>
                                Noch {daysRemaining} Tage
                            </p>
                        )
                    }


                    {
                        daysRemaining != null &&
                        daysRemaining < 0 && (

                            <p>
                                Abgabedatum überschritten
                            </p>
                        )
                    }

                </div>


            </div>


        </div>
    );
}

export default ThesisDetail;