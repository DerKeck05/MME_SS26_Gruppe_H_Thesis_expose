import {useEffect, useState} from "react";
import {PanelRightClose, Plus} from "lucide-react";

import OutlineComponent from "./outline-component.tsx";
import AddChapterModal from "../modals/outline-modals/add-chapter-modal.tsx";
import EditChapterModal from "../modals/outline-modals/edit-chapter-modal.tsx";

import type {
    Chapter,
    ChapterInsertMode
} from "../../utils/outline-utils.ts";

import {
    addChapter,
    deleteChapter,
    getChapters,
    updateChapter
} from "../../apis/chapter-api.ts";

import {useStudent} from "../route_handling/student-provider.tsx";
import CommentItem, {
    type UIComment
} from "./comments/comment-item.tsx";


export const MAX_CHAPTER_TITLE_LENGTH = 60;


function OutlinePage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [editChapter, setEditChapter] = useState<Chapter | null>(null);

    const [addChapterContext, setAddChapterContext] = useState<{
        mode: ChapterInsertMode;
        chapter?: Chapter;
    } | null>(null);

    const [showCommentSidebar, setShowCommentSidebar] = useState(false);

    const {thesisId} = useStudent();

    function loadDummyComments(): UIComment[] {
        return [
            {
                content:
                    "Die Definition an dieser Stelle passt gut. Vielleicht noch eine Quelle ergänzen, die den Begriff wissenschaftlich einordnet.",
                createdAt:
                    new Date("2026-09-24T10:34:00").toLocaleDateString(
                        "de-DE"
                    ) +
                    " " +
                    new Date("2026-09-24T10:34:00").toLocaleTimeString(
                        "de-DE",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),
                supervisorName: "Prof. Mueller"
            },
            {
                content:
                    "Der Abschnitt ist grundsätzlich verständlich, allerdings fehlt mir noch etwas die Verbindung zum vorherigen Kapitel. Es wäre hilfreich, kurz zu erklären, warum dieser Aspekt für eure weitere Untersuchung relevant ist.",
                createdAt:
                    new Date("2026-09-25T15:47:00").toLocaleDateString(
                        "de-DE"
                    ) +
                    " " +
                    new Date("2026-09-25T15:47:00").toLocaleTimeString(
                        "de-DE",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),
                supervisorName: "Prof. Mueller"
            },
            {
                content:
                    "Inhaltlich ist das Kapitel schon sehr ausführlich und deckt die wichtigsten Punkte ab. Ich würde allerdings empfehlen, die einzelnen Argumente noch etwas stärker miteinander zu verknüpfen. Momentan wirken einige Absätze eher wie voneinander unabhängige Informationen. Besonders bei der Überleitung zum nächsten Abschnitt könnte eine kurze Zusammenfassung helfen, damit der rote Faden für den Leser deutlicher wird. Außerdem würde ich an dieser Stelle noch prüfen, ob alle verwendeten Quellen aktuell genug sind und ob sich eventuell noch eine zusätzliche wissenschaftliche Quelle zur Untermauerung der zentralen Aussage finden lässt.",
                createdAt:
                    new Date("2026-09-26T09:18:00").toLocaleDateString(
                        "de-DE"
                    ) +
                    " " +
                    new Date("2026-09-26T09:18:00").toLocaleTimeString(
                        "de-DE",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),
                supervisorName: "Prof. Mueller"
            }
        ];
    }

    useEffect(() => {
        async function loadChapters() {
            try {
                const loadedChapters = await getChapters(thesisId);

                setChapters(loadedChapters);
            } catch (error) {
                console.error(
                    "Kapitel konnten nicht geladen werden:",
                    error
                );
            }
        }

        void loadChapters();
    }, [thesisId]);

    async function handleAddChapter(
        title: string
    ): Promise<boolean> {

        if (!addChapterContext) {
            return false;
        }

        let parentId: number | null = null;
        let position = 0;

        const referenceChapter = addChapterContext.chapter;


        // Neues Hauptkapitel
        if (addChapterContext.mode === "root") {
            const rootChapters = chapters.filter(
                chapter => chapter.parentId === null
            );

            parentId = null;
            position = rootChapters.length;
        }


        // Neues Unterkapitel
        if (
            referenceChapter &&
            addChapterContext.mode === "child"
        ) {
            const children = chapters.filter(
                chapter =>
                    chapter.parentId === referenceChapter.id
            );

            parentId = referenceChapter.id;
            position = children.length;
        }


        // Kapitel davor
        if (
            referenceChapter &&
            addChapterContext.mode === "before"
        ) {
            parentId = referenceChapter.parentId;
            position = referenceChapter.position;
        }


        // Kapitel danach
        if (
            referenceChapter &&
            addChapterContext.mode === "after"
        ) {
            parentId = referenceChapter.parentId;
            position = referenceChapter.position + 1;
        }


        try {
            await addChapter(thesisId, {
                title,
                parentId,
                position
            });

            const updatedChapters = await getChapters(thesisId);

            setChapters(updatedChapters);
            setAddChapterContext(null);

            return true;
        } catch (error) {
            console.error(
                "Kapitel konnte nicht erstellt werden:",
                error
            );

            return false;
        }
    }

    async function handleUpdateChapter(title: string) {
        if (!editChapter) {
            return;
        }

        try {
            const updatedChapter = await updateChapter(
                editChapter.id,
                {
                    title: title
                }
            );

            setChapters(current =>
                current.map(chapter =>
                    chapter.id === updatedChapter.id
                        ? updatedChapter
                        : chapter
                )
            );

            setEditChapter(null);
        } catch (error) {
            console.error(
                "Kapitel konnte nicht aktualisiert werden:",
                error
            );
        }
    }

    async function handleDeleteChapter(chapter: Chapter) {
        try {
            await deleteChapter(chapter.id);

            setChapters(current =>
                current.filter(
                    currentChapter =>
                        currentChapter.id !== chapter.id
                )
            );

            setEditChapter(current =>
                current?.id === chapter.id
                    ? null
                    : current
            );
        } catch (error) {
            console.error(
                "Kapitel konnte nicht gelöscht werden:",
                error
            );
        }
    }

    return (
        <div className="flex flex-row items-start">
            <div
                className="
                    outline-page
                    h-auto
                    flex
                    flex-4/6
                    bg-(--white)
                    rounded-(--border-radius)
                    flex-col
                    m-(--spacing-medium)
                    p-(--spacing-medium)
                "
            >
                <div className="outline-page-header flex justify-end">
                    <button
                        className="
                            squared-button
                            w-20
                            h-10
                            rounded-(--border-radius)
                        "
                        onClick={() =>
                            setAddChapterContext({
                                mode: "root"
                            })
                        }
                    >
                        <Plus/>
                    </button>
                </div>
                <OutlineComponent
                    chapters={chapters}

                    onEditChapter={setEditChapter}

                    onDeleteChapter={handleDeleteChapter}

                    onCommentClick={() =>
                        setShowCommentSidebar(
                            current => !current
                        )
                    }

                    onAddChild={(chapter) =>
                        setAddChapterContext({
                            mode: "child",
                            chapter
                        })
                    }

                    onAddBefore={(chapter) =>
                        setAddChapterContext({
                            mode: "before",
                            chapter
                        })
                    }

                    onAddAfter={(chapter) =>
                        setAddChapterContext({
                            mode: "after",
                            chapter
                        })
                    }
                />

                {addChapterContext && (
                    <AddChapterModal
                        mode={addChapterContext.mode}
                        referenceChapter={
                            addChapterContext.chapter
                        }
                        onCancel={() =>
                            setAddChapterContext(null)
                        }
                        onSubmit={handleAddChapter}
                    />
                )}

                {editChapter && (
                    <EditChapterModal
                        chapter={editChapter}
                        onCancel={() =>
                            setEditChapter(null)
                        }
                        onSubmit={handleUpdateChapter}
                        onDelete={() => handleDeleteChapter(editChapter)}
                    />
                )}

            </div>

            {showCommentSidebar && (
                <div
                    className="
                        relative
                        flex
                        flex-1/3
                        h-[88vh]
                        mr-(--spacing-medium)
                        mt-(--spacing-medium)
                        mb-(--spacing-medium)
                    "
                >

                    <div
                        className="
                            flex
                            w-full
                            overflow-y-auto
                            bg-(--white)
                            rounded-(--border-radius)
                            flex-col
                            pl-(--spacing-large)
                            pr-(--spacing-large)
                            pt-(--spacing-medium)
                        "
                    >
                        <div
                            className="
                                flex
                                justify-end
                                mb-(--spacing-small)
                            "
                        >
                            <button
                                className="rounded-full p-2"
                                onClick={() =>
                                    setShowCommentSidebar(false)
                                }
                            >
                                <PanelRightClose/>
                            </button>
                        </div>

                        {loadDummyComments().map(
                            (comment, index) => (
                                <CommentItem
                                    key={index}
                                    content={comment.content}
                                    createdAt={comment.createdAt}
                                    supervisorName={
                                        comment.supervisorName
                                    }
                                />
                            )
                        )}

                    </div>

                    <div
                        className="
                            pointer-events-none
                            absolute
                            bottom-0
                            left-0
                            right-0
                            h-8
                            rounded-b-(--border-radius)
                            bg-linear-to-t
                            from-(--white)/70
                            to-transparent
                        "
                    />

                </div>
            )}

        </div>
    );
}

export default OutlinePage;