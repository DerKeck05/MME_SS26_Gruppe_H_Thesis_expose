import { useState } from "react";
function FaqPage() {

    const faqs = [
        {
            id: 1,
            question: " wqdwdqwdq",
            answer: " wdfwdqw"
        },
        {
            id: 2,
            question: " wdfqdwfqwdwqddw",
            answer: " werwf."
        }
    ];
    const [selectedFaqIds, setSelectedFaqIds] = useState<number[]>([]);
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
    return (
        <div>
            <h1> FAQ Bereich</h1>
            <div>
                <button type="button">einstellung</button>
                <button type="button">add</button>
                <button type="button">minus</button>
            </div>
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