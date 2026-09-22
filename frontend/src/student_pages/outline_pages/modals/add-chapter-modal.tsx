import CloseModalButton from "../../../globals/close-modal-button.tsx";
import {useState} from "react";

function AddChapterModal({onSubmit, onCancel}: { onSubmit: () => void, onCancel: () => void }) {
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");

    const chapterNumberRegex = /^\d+(?:\.\d+){0,3}$/;
    const isNumberValid = chapterNumberRegex.test(chapterNumber);
    const isTitleValid = chapterTitle.trim() !== "" && chapterTitle.trim().length <= 40;
    const isFormValid = isTitleValid && isNumberValid && chapterNumber.length !== null;

    return (
        <div className={"modal-backdrop"} onClick={onCancel}>
            <div className={"modal"} onClick={(e) => {
                e.stopPropagation()
            }}>
                <div className={"modal-header"}>
                    <h3>Kapitel erstellen</h3>

                    <CloseModalButton onClick={onCancel}/>
                </div>

                <div className={"modal-body"}>
                    <div className={"add-chapter-modal"}>
                        <input id={"title-input"} placeholder={"Titel"} value={chapterTitle.trim()}
                               onChange={(e) => setChapterTitle(e.target.value)}/>
                        <input id={"chapter-number-input"} placeholder={""} value={chapterNumber}
                               onChange={(e) => setChapterNumber(e.target.value)}/>
                    </div>
                    <p className={"ui-error-notice"}>
                        {chapterNumber.length > 0 && !isNumberValid
                            ? "Kapitelnummer muss das Format X, X.X, X.X.X oder X.X.X.X haben."
                            : "\u00A0"
                        }
                        {!isTitleValid && chapterTitle.length > 0 ? "Titel erforderlich und darf 40 Zeichen nicht überschreiten." : "\u00A0"}
                    </p>
                </div>

                <button
                    className={"modal-submit-button"}
                    type={"button"}
                    disabled={!isFormValid}
                    onClick={async () => {
                        onSubmit();
                    }}
                >
                    Kapitel erstellen
                </button>
            </div>
        </div>
    );
}

export default AddChapterModal;