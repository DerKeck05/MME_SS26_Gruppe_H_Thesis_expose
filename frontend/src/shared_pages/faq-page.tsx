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
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default FaqPage;