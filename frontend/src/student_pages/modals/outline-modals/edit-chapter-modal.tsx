import {Check, Trash, X} from "lucide-react";
import {useState} from "react";
import type {Chapter} from "../../../utils/outline-utils.ts";
import {MAX_CHAPTER_TITLE_LENGTH} from "../../outline_pages/outline-page.tsx";

interface EditChapterModalProps {
    onCancel: () => void;
    onSubmit: (title: string) => void;
    onDelete: () => void;
    chapter: Chapter;
}

// Modal for editing the Chapters Title and also deleting it
function EditChapterModal({
                              onCancel,
                              onSubmit,
                              onDelete,
                              chapter
                          }: EditChapterModalProps) {

    // Title Variable for the input field, initialized with the current chapter title
    const [chapterTitle, setChapterTitle] = useState(chapter.title);

    // Checks if the title is not empty and does not exceed the character max
    const isTitleValid =
        chapterTitle.trim() !== "" &&
        chapterTitle.trim().length <= MAX_CHAPTER_TITLE_LENGTH;

    return (
        <div
            className="modal-backdrop"
            onClick={onCancel}
        >
            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header with Title, Close Button and Delete Button */}
                <div className="modal-header">
                    <h3>Kapitel bearbeiten</h3>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="modal-close"
                        aria-label="Modal schließen"
                    >
                        <X/>
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        className="edit-calendar-entry"
                        aria-label="Kapitel löschen"
                    >
                        <Trash/>
                    </button>
                </div>

                {/* Body with the Title input and Error Notice if the Title isn't valid */}
                <div
                    className="modal-body flex mb-(--spacing-medium)"
                    id="edit-chapter-modal"
                >
                    <input
                        type="text"
                        placeholder="Kapitelname"
                        value={chapterTitle}
                        maxLength={MAX_CHAPTER_TITLE_LENGTH}
                        onChange={(event) =>
                            setChapterTitle(event.target.value)
                        }
                    />

                    <p className="ui-error-notice">
                        {!isTitleValid && chapterTitle.length > 0
                            ? `Titel erforderlich und darf ${MAX_CHAPTER_TITLE_LENGTH} Zeichen nicht überschreiten.`
                            : "\u00A0"
                        }
                    </p>
                </div>

                {/* Submit button, that is enabled when the title is a valid one */}
                <button
                    className="squared-button modal-submit-button"
                    type="button"
                    disabled={!isTitleValid}
                    onClick={() => onSubmit(chapterTitle.trim())}
                >
                    <Check/>
                </button>
            </div>
        </div>
    );
}

export default EditChapterModal;
