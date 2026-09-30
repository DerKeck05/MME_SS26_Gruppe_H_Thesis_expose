import {useEffect, useState} from "react";

import "./faq-stylesheet.css";


type FaqPageProps = {
    isProfessor: boolean;
    supervisorId: number | null;
};


type Faq = {
    id: number;
    question: string;
    answer: string;
};


function FaqPage({
    isProfessor,
    supervisorId
}: FaqPageProps) {

    const [faqs, setFaqs] =
        useState<Faq[]>([]);

    const [selectedFaqIds, setSelectedFaqIds] =
        useState<number[]>([]);

    const [isAddOpen, setIsAddOpen] =
        useState(false);

    const [newQuestion, setNewQuestion] =
        useState("");

    const [newAnswer, setNewAnswer] =
        useState("");

    const [isEditOpen, setIsEditOpen] =
        useState(false);

    const [editQuestion, setEditQuestion] =
        useState("");

    const [editAnswer, setEditAnswer] =
        useState("");


    useEffect(() => {

        async function loadFaqs() {

            if (supervisorId === null) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `http://localhost:3000/api/faq/supervisor/${supervisorId}`
                    );


                if (!response.ok) {

                    console.error(
                        "FAQ konnte nicht geladen werden"
                    );

                    return;
                }


                const data =
                    await response.json();


                setFaqs(data);

            } catch (error) {

                console.error(
                    "Fehler beim Laden der FAQ:",
                    error
                );
            }
        }


        loadFaqs();

    }, [supervisorId]);


    function toggleFaqSelection(
        id: number
    ) {

        if (
            selectedFaqIds.includes(id)
        ) {

            const newSelection =
                selectedFaqIds.filter(
                    faqId =>
                        faqId !== id
                );


            setSelectedFaqIds(
                newSelection
            );

        } else {

            setSelectedFaqIds([
                ...selectedFaqIds,
                id
            ]);
        }
    }


    async function deleteSelectedFaqs() {

        if (
            selectedFaqIds.length === 0
        ) {
            return;
        }


        for (const id of selectedFaqIds) {

            await fetch(
                `http://localhost:3000/api/faq/${id}`,
                {
                    method: "DELETE"
                }
            );
        }


        const remainingFaqs =
            faqs.filter(
                faq =>
                    !selectedFaqIds.includes(
                        faq.id
                    )
            );


        setFaqs(
            remainingFaqs
        );


        setSelectedFaqIds([]);
    }


    async function addFaq() {

        if (supervisorId === null) {
            return;
        }


        if (
            newQuestion.trim() === ""
        ) {
            return;
        }


        if (
            newAnswer.trim() === ""
        ) {
            return;
        }


        const response =
            await fetch(
                `http://localhost:3000/api/faq/supervisor/${supervisorId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question:
                            newQuestion,

                        answer:
                            newAnswer
                    })
                }
            );


        if (!response.ok) {

            console.error(
                "FAQ konnte nicht erstellt werden"
            );

            return;
        }


        const createdFaq =
            await response.json();


        setFaqs([
            ...faqs,
            createdFaq
        ]);


        setNewQuestion("");

        setNewAnswer("");

        setIsAddOpen(false);
    }


    function editSelectedFaq() {

        if (
            selectedFaqIds.length !== 1
        ) {
            return;
        }


        const selectedFaq =
            faqs.find(
                faq =>
                    faq.id ===
                    selectedFaqIds[0]
            );


        if (!selectedFaq) {
            return;
        }


        setEditQuestion(
            selectedFaq.question
        );


        setEditAnswer(
            selectedFaq.answer
        );


        setIsEditOpen(true);
    }


    async function saveEditedFaq() {

        if (
            selectedFaqIds.length !== 1
        ) {
            return;
        }


        const id =
            selectedFaqIds[0];


        const response =
            await fetch(
                `http://localhost:3000/api/faq/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        question:
                            editQuestion,

                        answer:
                            editAnswer
                    })
                }
            );


        if (!response.ok) {

            console.error(
                "FAQ konnte nicht geändert werden"
            );

            return;
        }


        const updatedFaq =
            await response.json();


        const updatedFaqs: Faq[] =
            [];


        for (const faq of faqs) {

            if (
                faq.id === id
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


        setSelectedFaqIds([]);


        setIsEditOpen(false);
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


                {isProfessor && (

                    <button
                        type="button"

                        className="
                            faq-button
                            faq-button-primary
                        "

                        onClick={() => {

                            setIsAddOpen(true);

                        }}
                    >

                        FAQ hinzufügen

                    </button>

                )}

            </div>


            {isProfessor && (

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

            )}


            <div className="faq-list">

                {faqs.length === 0 && (

                    <div className="faq-empty">

                        Noch keine FAQ vorhanden.

                    </div>

                )}


                {faqs.map(faq => (

                    <div
                        key={faq.id}
                        className="faq-item glass-card"
                    >

                        {isProfessor && (

                            <div className="faq-selection">

                                <input
                                    type="checkbox"

                                    checked={
                                        selectedFaqIds.includes(
                                            faq.id
                                        )
                                    }

                                    onChange={() => {

                                        toggleFaqSelection(
                                            faq.id
                                        );

                                    }}
                                />

                            </div>

                        )}


                        <div className="faq-content">

                            <h2>
                                {faq.question}
                            </h2>


                            <p>
                                {faq.answer}
                            </p>

                        </div>

                    </div>

                ))}

            </div>


            {isAddOpen && (

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

                            onChange={(event) => {

                                setNewQuestion(
                                    event.target.value
                                );

                            }}
                        />


                        <label>
                            Antwort
                        </label>


                        <textarea
                            rows={5}

                            value={
                                newAnswer
                            }

                            onChange={(event) => {

                                setNewAnswer(
                                    event.target.value
                                );

                            }}
                        />


                        <div className="faq-modal-buttons">

                            <button
                                type="button"

                                className="faq-button"

                                onClick={() => {

                                    setIsAddOpen(false);

                                }}
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

            )}


            {isEditOpen && (

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

                            onChange={(event) => {

                                setEditQuestion(
                                    event.target.value
                                );

                            }}
                        />


                        <label>
                            Antwort
                        </label>


                        <textarea
                            rows={5}

                            value={
                                editAnswer
                            }

                            onChange={(event) => {

                                setEditAnswer(
                                    event.target.value
                                );

                            }}
                        />


                        <div className="faq-modal-buttons">

                            <button
                                type="button"

                                className="faq-button"

                                onClick={() => {

                                    setIsEditOpen(false);

                                }}
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
            )}

        </div>
    );
}
export default FaqPage;