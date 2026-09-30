import { useEffect, useState} from "react";
import "./faq-stylesheet.css";

const API_URL =
    import.meta.env.VITE_API_URL;


/*
isProfessor decides if the user
is alloed to manage FAQ entries.
Students can only read the FAQ.
supervisorId is needed
to load the FAQ entries
of the correct professor.
*/
type FaqPageProps = {
    isProfessor: boolean;
    supervisorId: number | null;
};


/*
This type describes
one FAQ entry.
*/
type Faq = {
    id: number;
    question: string;
    answer: string;
};


function FaqPage({
    isProfessor,
    supervisorId
}: FaqPageProps) {

    /*
    Stores all FAQ entries
    loaded from the backend.
    */
    const [
        faqs,
        setFaqs
    ] = useState<Faq[]>([]);


    /*
    Stores the IDs
    of the selected FAQ entries.
    Multiple entries can be selected
    for deleting.
    Exactly one entry must be selected
    for editing.
    */
    const [
        selectedFaqIds,
        setSelectedFaqIds
    ] = useState<number[]>([]);


    /*
    isAddOpen stores if
    the add modal is open.
    newQuestion and newAnswer
    store the entered values.
    */
    const [
        isAddOpen,
        setIsAddOpen
    ] = useState(false);

    const [
        newQuestion,
        setNewQuestion
    ] = useState("");

    const [
        newAnswer,
        setNewAnswer
    ] = useState("");


    /*
    These states are used
    for the edit modal.
    */
    const [
        isEditOpen,
        setIsEditOpen
    ] = useState(false);

    const [
        editQuestion,
        setEditQuestion
    ] = useState("");

    const [
        editAnswer,
        setEditAnswer
    ] = useState("");


    /*
    Whenever the supervisor ID changes,
    the FAQ entries of this professor
    are loaded again.
    */
    useEffect(() => {

        async function loadFaqs() {

            /*
            Without a supervisor ID
            no FAQ entries can be loaded.
            */
            if (
                supervisorId == null
            ) {

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/api/faq/supervisor/${supervisorId}`
                    );


                if (
                    response.ok == false
                ) {

                    throw new Error(
                        "FAQ konnte nicht geladen werden"
                    );
                }


                const data: Faq[] =
                    await response.json();


                setFaqs(
                    data
                );


            } catch (error) {

                console.error(
                    "Fehler beim Laden der FAQ:",
                    error
                );
            }
        }


        loadFaqs();

    }, [supervisorId]);


    /*
    If the FAQ is already selected,
    its ID is removed.
    Otherwise the ID is added
    to the selection.
    */
    function toggleFaqSelection(
        id: number
    ) {

        if (
            selectedFaqIds.includes(id)
        ) {

            const newSelection: number[] =
                [];


            for (const faqId of selectedFaqIds) {

                if (
                    faqId != id
                ) {

                    newSelection.push(
                        faqId
                    );
                }
            }


            setSelectedFaqIds(
                newSelection
            );

            return;
        }


        const newSelection =
            [...selectedFaqIds];


        newSelection.push(
            id
        );


        setSelectedFaqIds(
            newSelection
        );
    }


    /*
    Every selected FAQ
    is deleted from the backend.
    After successful deletion
    the local FAQ list is updated.
    */
    async function deleteSelectedFaqs() {

        if (
            selectedFaqIds.length == 0
        ) {

            return;
        }


        try {

            /*
            Delete every selected FAQ
            one after another.
            */
            for (const id of selectedFaqIds) {

                const response =
                    await fetch(
                        `${API_URL}/api/faq/${id}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (
                    response.ok == false
                ) {

                    throw new Error(
                        "FAQ konnte nicht gelöscht werden"
                    );
                }
            }


            /*
            Build a new list
            without the deleted FAQ entries.
            */
            const remainingFaqs: Faq[] =
                [];


            for (const faq of faqs) {

                if (
                    selectedFaqIds.includes(
                        faq.id
                    ) == false
                ) {

                    remainingFaqs.push(
                        faq
                    );
                }
            }


            setFaqs(
                remainingFaqs
            );


            /*
            Clear the selection
            after deletion.
            */
            setSelectedFaqIds(
                []
            );


        } catch (error) {

            console.error(
                "Fehler beim Löschen der FAQ:",
                error
            );
        }
    }


    /*
    Question and answer
    are required.
    The new FAQ is sent
    to the backend and added
    to the local list afterwards.
    */
    async function addFaq() {

        if (
            supervisorId == null
        ) {
        return;
        }


        if (
            newQuestion.trim() == "" ||
            newAnswer.trim() == ""
        ) {
            return;
        }

        try {

            const response =
                await fetch(
                    `${API_URL}/api/faq/supervisor/${supervisorId}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                question:
                                    newQuestion.trim(),

                                answer:
                                    newAnswer.trim()
                            })
                    }
                );


            if (
                response.ok == false
            ) {

                throw new Error(
                    "FAQ konnte nicht erstellt werden"
                );
            }


            const createdFaq: Faq =
                await response.json();


            const newFaqs =
                [...faqs];


            newFaqs.push(
                createdFaq
            );


            setFaqs(
                newFaqs
            );


            /*
            Clear the input fields
            and close the modal.
            */
            setNewQuestion("");

            setNewAnswer("");

            setIsAddOpen(
                false
            );


        } catch (error) {

            console.error(
                "Fehler beim Erstellen der FAQ:",
                error
            );
        }
    }


    /*
    Exactly one FAQ
    has to be selected.
    Its current question and answer
    are copied into the edit fields.
    */
    function editSelectedFaq() {

        if (
            selectedFaqIds.length != 1
        ) {

            return;
        }


        const selectedId =
            selectedFaqIds[0];


        let selectedFaq: Faq | null =
            null;


        /*
        Search for the selected FAQ
        in the loaded FAQ list.
        */
        for (const faq of faqs) {

            if (
                faq.id == selectedId
            ) {

                selectedFaq =
                    faq;

                break;
            }
        }


        if (
            selectedFaq == null
        ) {

            return;
        }


        setEditQuestion(
            selectedFaq.question
        );


        setEditAnswer(
            selectedFaq.answer
        );


        setIsEditOpen(
            true
        );
    }


    /*
    Exactly one FAQ
    must be selected.
    Question and answer
    are both sent to the backend.
    */
    async function saveEditedFaq() {

        if (
            selectedFaqIds.length != 1
        ) {
           return;
        }

        if (
            editQuestion.trim() == "" ||
            editAnswer.trim() == ""
        ) {

            return;
        }


        const id =
            selectedFaqIds[0];

        try {

            const response =
                await fetch(
                    `${API_URL}/api/faq/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                question:
                                    editQuestion.trim(),

                                answer:
                                    editAnswer.trim()
                            })
                    }
                );


            if (
                response.ok == false
            ) {

                throw new Error(
                    "FAQ konnte nicht geändert werden"
                );
            }


            const updatedFaq: Faq =
                await response.json();


            /*
            The edited FAQ is replaced
            by the response from the backend.
            All other FAQ entries
            stay unchanged.
            */
            const updatedFaqs: Faq[] =
                [];


            for (const faq of faqs) {

                if (
                    faq.id == id
                ) {

                    updatedFaqs.push(
                        updatedFaq
                    );

                } else {

                    updatedFaqs.push(
                        faq
                    );
                }
            }


            setFaqs(
                updatedFaqs
            );


            setSelectedFaqIds(
                []
            );


            setIsEditOpen(
                false
            );


        } catch (error) {

            console.error(
                "Fehler beim Bearbeiten der FAQ:",
                error
            );
        }
    }


    return (

        <div className="faq-page glass-panel">

            <div className="faq-header">

                <div>

                    <h1>
                        FAQ
                    </h1>

                    <p>
                        Häufig gestellte Fragen zur Thesis
                    </p>

                </div>


                {/*
                Only professors
                can add new FAQ entries.
                */}
                {
                    isProfessor && (

                        <button
                            type="button"
                            className="
                                faq-button
                                faq-button-primary
                            "
                            onClick={() =>
                                setIsAddOpen(true)
                            }
                        >
                            FAQ hinzufügen
                        </button>
                    )
                }

            </div>


            {/*
            Students only read FAQ entries.
            Professors can edit
            or delete entries.
            */}
            {
                isProfessor && (

                    <div className="faq-toolbar">

                        <button
                            type="button"
                            className="faq-button"
                            onClick={
                                editSelectedFaq
                            }
                        >
                            Bearbeiten
                        </button>


                        <button
                            type="button"
                            className="
                                faq-button
                                faq-button-delete
                            "
                            onClick={
                                deleteSelectedFaqs
                            }
                        >
                            Löschen
                        </button>

                    </div>
                )
            }
            <div className="faq-list">

                {
                    faqs.length == 0 && (

                        <div className="faq-empty">
                            Noch keine FAQ vorhanden.
                        </div>
                    )
                }


                {
                    faqs.map(
                        (faq) => (

                            <div
                                key={faq.id}
                                className="faq-item glass-card"
                            >

                                {/*
                                Only professors need
                                the selection checkbox.
                                */}
                                {
                                    isProfessor && (

                                        <div className="faq-selection">

                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedFaqIds.includes(
                                                        faq.id
                                                    )
                                                }
                                                onChange={() =>
                                                    toggleFaqSelection(
                                                        faq.id
                                                    )
                                                }
                                            />

                                        </div>
                                    )
                                }


                                <div className="faq-content">

                                    <h2>
                                        {faq.question}
                                    </h2>

                                    <p>
                                        {faq.answer}
                                    </p>

                                </div>

                            </div>
                        )
                    )
                }

            </div>



            {
                isAddOpen && (

                    <div className="faq-modal-background">

                        <div className="faq-modal glass-panel">

                            <h2>
                                FAQ hinzufügen
                            </h2>


                            <label>
                                Frage
                            </label>

                            <input
                                type="text"
                                value={
                                    newQuestion
                                }
                                onChange={(event) =>
                                    setNewQuestion(
                                        event.target.value
                                    )
                                }
                            />


                            <label>
                                Antwort
                            </label>

                            <textarea
                                rows={5}
                                value={
                                    newAnswer
                                }
                                onChange={(event) =>
                                    setNewAnswer(
                                        event.target.value
                                    )
                                }
                            />


                            <div className="faq-modal-buttons">

                                <button
                                    type="button"
                                    className="faq-button"
                                    onClick={() =>
                                        setIsAddOpen(false)
                                    }
                                >
                                    Abbrechen
                                </button>


                                <button
                                    type="button"
                                    className="
                                        faq-button
                                        faq-button-primary
                                    "
                                    onClick={
                                        addFaq
                                    }
                                >
                                    Speichern
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }


            {
                isEditOpen && (

                    <div className="faq-modal-background">

                        <div className="faq-modal glass-panel">

                            <h2>
                                FAQ bearbeiten
                            </h2>


                            <label>
                                Frage
                            </label>

                            <input
                                type="text"
                                value={
                                    editQuestion
                                }
                                onChange={(event) =>
                                    setEditQuestion(
                                        event.target.value
                                    )
                                }
                            />


                            <label>
                                Antwort
                            </label>

                            <textarea
                                rows={5}
                                value={
                                    editAnswer
                                }
                                onChange={(event) =>
                                    setEditAnswer(
                                        event.target.value
                                    )
                                }
                            />


                            <div className="faq-modal-buttons">

                                <button
                                    type="button"
                                    className="faq-button"
                                    onClick={() =>
                                        setIsEditOpen(false)
                                    }
                                >
                                    Abbrechen
                                </button>


                                <button
                                    type="button"
                                    className="
                                        faq-button
                                        faq-button-primary
                                    "
                                    onClick={
                                        saveEditedFaq
                                    }
                                >
                                    Speichern
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

        </div>
    );
}
export default FaqPage;