import { useState } from "react";
type FaqPageProps = {
    isProfessor: boolean;
};

function FaqPage({ isProfessor }: FaqPageProps) {
    const [faqs, setFaqs] = useState([
        {
            id: 1,
            question: "wqdwdqwdq",
            answer: "wdfwdqw"
        },
        {
            id: 2,
            question: "wdfqdwfqwdwqddw",
            answer: "werwf."
        }
    ]);

    const [selectedFaqIds, setSelectedFaqIds] = useState<number[]>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editQuestion, setEditQuestion] = useState("");
    const [editAnswer, setEditAnswer] = useState("");
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
    function deleteSelectedFaqs() {
        const remainingFaqs = faqs.filter(
            (faq) => !selectedFaqIds.includes(faq.id)
        );

        setFaqs(remainingFaqs);
        setSelectedFaqIds([]);
    }

    function addFaq() {
        const newFaq = {
            id: Date.now(),
            question: newQuestion,
            answer: newAnswer
        };

        setFaqs([
            ...faqs,
            newFaq
        ]);
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
    function saveEditedFaq() {
        const updatedFaqs = faqs.map((faq) => {
            if (faq.id == selectedFaqIds[0]) {
                return {
                    ...faq,
                    question: editQuestion,
                    answer: editAnswer
                };
            }
            return faq;
        });
        setFaqs(updatedFaqs);
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
                        <input
                            type="checkbox"
                            checked={selectedFaqIds.includes(faq.id)}
                            onChange={() => toggleFaqSelection(faq.id)}
                        />

                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default FaqPage;