import { useState } from "react";

function FaqPage() {
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
    return (
        <div>
            <h1> FAQ Bereich</h1>
            <div>
                <button type="button">einstellung</button>
                <button type="button" onClick={() => setIsAddOpen(true)}
                >add</button>
                <button type="button" onClick={deleteSelectedFaqs}> minus </button>
            </div>
            {isAddOpen && (
                <div>
                    <h2>FAQ hinzufügen</h2>
                    <input type="text"
                    placeholder="Frage"
                    value={newQuestion}
                    onChange={(event)=>setNewQuestion(event.target.value)}
                    />

                    <button
                        type="button"
                        onClick={() => setIsAddOpen(false)}
                    >
                        schließen
                    </button>
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