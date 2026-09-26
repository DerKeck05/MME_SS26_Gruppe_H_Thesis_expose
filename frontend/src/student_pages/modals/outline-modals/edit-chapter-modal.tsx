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

function EditChapterModal({
                              onCancel,
                              onSubmit,
                              onDelete,
                              chapter
                          }: EditChapterModalProps) {
    const [chapterTitle, setChapterTitle] = useState(chapter.title);

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