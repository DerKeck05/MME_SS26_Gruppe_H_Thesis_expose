import { useEffect, useState } from "react";
type FaqPageProps = {
    isProfessor: boolean;
    supervisorId: number | null;
};

function FaqPage({
    isProfessor,
    supervisorId
}: FaqPageProps) {

    const [faqs, setFaqs] = useState<
        { id: number; question: string; answer: string }[]
    >([]);

    const [selectedFaqIds, setSelectedFaqIds] = useState<number[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");
    useEffect(() => {
        if (supervisorId === null) {
            return;
        }

        fetch(`http://localhost:3000/api/faq/supervisor/${supervisorId}`)
            .then((response) => response.json())
            .then((data) => {
                setFaqs(data);
            });
    }, [supervisorId]);


    function toggleFaqSelection(id: number) {
        if (selectedFaqIds.includes(id)) {
            setSelectedFaqIds(
                selectedFaqIds.filter((faqId) => faqId !== id)
            );
        } else {
            setSelectedFaqIds([
                ...selectedFaqIds,
                id
            ]);
        }
    }
    async function deleteSelectedFaqs() {
        await Promise.all(
            selectedFaqIds.map((id) =>
                fetch(`http://localhost:3000/api/faq/${id}`, {
                    method: "DELETE"
                })
            )
        );

        setFaqs(
            faqs.filter(
                (faq) => !selectedFaqIds.includes(faq.id)
            )
        );

        setSelectedFaqIds([]);
    }

    async function addFaq() {
        if (supervisorId === null) {
            return;
        }
        const response = await fetch(
            `http://localhost:3000/api/faq/supervisor/${supervisorId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: newQuestion,
                    answer: newAnswer
                })
            }
        );

        const createdFaq = await response.json();

        setFaqs([...faqs, createdFaq]);

        setNewQuestion("");
        setNewAnswer("");
        setIsAddOpen(false);
    }
    function editSelectedFaq() {
        if (selectedFaqIds.length !== 1) {
            return;
        }
        const selectedFaq = faqs.find(
            (faq) => faq.id == selectedFaqIds[0]

        );
        if (selectedFaq) {
            setEditQuestion(selectedFaq.question);
            setEditAnswer(selectedFaq.answer);
            setIsEditOpen(true);
        }
    }
    async function saveEditedFaq() {
        const id = selectedFaqIds[0];

        const response = await fetch(
            `http://localhost:3000/api/faq/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: editQuestion,
                    answer: editAnswer
                })
            }
        );

        const updatedFaq = await response.json();

        setFaqs(
            faqs.map((faq) =>
                faq.id === id ? updatedFaq : faq
            )
        );

        setSelectedFaqIds([]);
        setIsEditOpen(false);
    }

    return (
        <div>
            <h1> FAQ Bereich</h1>
            {isProfessor && (
                <div>
                    <button
                        type="button"
                        onClick={editSelectedFaq}
                    >
                        einstellungen
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsAddOpen(true)}
                    >
                        add
                    </button>

                    <button
                        type="button"
                        onClick={deleteSelectedFaqs}
                    >
                        minus
                    </button>
                </div>
            )}
            {isAddOpen && (
                <div>
                    <h2>FAQ hinzufügen</h2>
                    <input type="text"
                        placeholder="Frage"
                        value={newQuestion}
                        onChange={(event) => setNewQuestion(event.target.value)}
                    />
                    <textarea
                        placeholder="Antwort"
                        value={newAnswer}
                        onChange={(event) => setNewAnswer(event.target.value)}
                    />
                    <button type="button" onClick={addFaq}
                    >speichern</button>

                    <button
                        type="button"
                        onClick={() => setIsAddOpen(false)}
                    >
                        schließen
                    </button>
                </div>
            )}
            {isEditOpen && (
                <div>
                    <h2> FAQ bearbeiten </h2>
                    <input
                        type="text"
                        value={editQuestion}
                        onChange={(event) => setEditQuestion(event.target.value)}
                    />
                    <textarea
                        value={editAnswer}
                        onChange={(event) => setEditAnswer(event.target.value)}
                    />
                    <button type="button" onClick={saveEditedFaq}>speichern</button>
                    <button
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                    >schließen</button>
                </div>
            )}
            <div>
                {faqs.map((faq) => (
                    <div key={faq.id}>
                        {isProfessor && (
                            <input
                                type="checkbox"
                                checked={selectedFaqIds.includes(faq.id)}
                                onChange={() => toggleFaqSelection(faq.id)}
                            />
                        )}
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default FaqPage;