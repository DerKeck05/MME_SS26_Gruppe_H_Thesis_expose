import CloseModalButton from "../../../globals/close-modal-button.tsx";
import {useState} from "react";
import {MAX_CHAPTER_TITLE_LENGTH} from "../../outline_pages/outline-page.tsx";
import type {Chapter, ChapterInsertMode} from "../../../utils/outline-utils.ts";

interface AddChapterModalProps {
    onSubmit: (title: string) => void;
    onCancel: () => void;

    mode: ChapterInsertMode;
    referenceChapter?: Chapter;
}

function AddChapterModal({
                             onSubmit,
                             onCancel,
                             mode,
                             referenceChapter
                         }: AddChapterModalProps) {

    const [chapterTitle, setChapterTitle] = useState("");

    const isTitleValid =
        chapterTitle.trim() !== "" &&
        chapterTitle.trim().length <= MAX_CHAPTER_TITLE_LENGTH;

    function getModalTitle(): string {
        switch (mode) {
            case "child":
                return "Unterkapitel erstellen";

            case "before":
                return "Kapitel davor einfügen";

            case "after":
                return "Kapitel danach einfügen";

            case "root":
            default:
                return "Kapitel erstellen";
        }
    }

    function getDescription(): string {
        if (!referenceChapter) {
            return "";
        }

        switch (mode) {
            case "child":
                return `Unterkapitel von „${referenceChapter.title}“`;

            case "before":
                return `Vor „${referenceChapter.title}“`;

            case "after":
                return `Nach „${referenceChapter.title}“`;

            default:
                return "";
        }
    }

    return (
        <div
            className="modal-backdrop"
            onClick={onCancel}
        >
            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>{getModalTitle()}</h3>

                    <CloseModalButton onClick={onCancel}/>
                </div>

                <div className="modal-body">
                    <div className="add-chapter-modal">

                        {getDescription() && (
                            <p className="text-sm">
                                {getDescription()}
                            </p>
                        )}

                        <input
                            id="title-input"
                            placeholder="Titel"
                            type="text"
                            value={chapterTitle}
                            maxLength={MAX_CHAPTER_TITLE_LENGTH}
                            onChange={(event) =>
                                setChapterTitle(event.target.value)
                            }
                        />
                    </div>

                    <p className="ui-error-notice">
                        {!isTitleValid && chapterTitle.length > 0
                            ? `Titel erforderlich und darf ${MAX_CHAPTER_TITLE_LENGTH} Zeichen nicht überschreiten.`
                            : "\u00A0"
                        }
                    </p>
                </div>

                <button
                    className="squared-button modal-submit-button"
                    type="button"
                    disabled={!isTitleValid}
                    onClick={() => onSubmit(chapterTitle.trim())}
                >
                    Kapitel erstellen
                </button>
            </div>
        </div>
    );
}

export default AddChapterModal;