import {Check, Trash, X} from "lucide-react";
import {useState} from "react";
import type {UIChapter} from "../outline-component.tsx";

function EditChapterModal({onCancel, onSubmit, onDelete, chapter}: {
    onCancel: () => void,
    onSubmit: () => void,
    onDelete: () => void,
    chapter: UIChapter
}) {
    const [chapterTitle, setChapterTitle] = useState(chapter.title);
    const [chapterNumber, setChapterNumber] = useState(chapter.number);

    const chapterNumberRegex = /^\d+(?:\.\d+){0,3}$/;
    const isNumberValid = chapterNumberRegex.test(chapterNumber);
    const isTitleValid = chapterTitle.trim() !== "" && chapterTitle.trim().length <= 40;
    const isFormValid = isTitleValid &&
        isNumberValid &&
        chapterNumber.length !== null;


    return (
        <div className={"modal-backdrop"} onClick={onCancel}>
            <div className={"modal"} onClick={(event) => event.stopPropagation()}>
                <div className={"modal-header"}>
                    <h3>Kapitel bearbeiten</h3>

                    <button
                        type="button"
                        onClick={() => {
                            onCancel();
                        }}
                        className="modal-close"
                        aria-label="Modal schließen"
                    >
                        <X/>
                    </button>

                    <button
                        type={"button"}
                        onClick={onDelete}
                        className={"edit-calendar-entry"}
                        aria-label="Kapitel löschen"
                    >
                        <Trash/>
                    </button>
                </div>

                <div className="modal-body flex mb-(--spacing-medium)" id="edit-chapter-modal">
                    <input
                        type="text"
                        placeholder="Neues Kapitel"
                        value={chapterTitle}
                        onChange={(c) => setChapterTitle(c.target.value)}
                    />

                    <div className="chapter-number-field">
                        <label htmlFor="chapter-number-input">
                            Kapitel-Nummer:
                        </label>

                        <input
                            id="chapter-number-input"
                            type="text"
                            value={chapterNumber}
                            onChange={(c) => setChapterNumber(c.target.value)}
                        />
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
                    <Check/>
                </button>
            </div>
        </div>
    );
}

export default EditChapterModal;