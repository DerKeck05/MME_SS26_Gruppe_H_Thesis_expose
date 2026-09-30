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

import {
    getFeedbackEntries
} from "../../apis/feedback-api.ts";

import CommentItem, {
    type UIComment
} from "./comments/comment-item.tsx";
import {useError} from "../../globals/error-provider.tsx";


export const MAX_CHAPTER_TITLE_LENGTH = 60;

type OutlinePageProps = {
    thesisId: number | null;
};
function OutlinePage({thesisId}: OutlinePageProps) {
    const [chapters, setChapters] = useState<Chapter[]>([]);

    const [editChapter, setEditChapter] =
        useState<Chapter | null>(null);

    const [addChapterContext, setAddChapterContext] = useState<{
        mode: ChapterInsertMode;
        chapter?: Chapter;
    } | null>(null);

    const [showCommentSidebar, setShowCommentSidebar] =
        useState(false);

    const [selectedChapter, setSelectedChapter] =
        useState<Chapter | null>(null);

    const [comments, setComments] =
        useState<UIComment[]>([]);

    const {showError} = useError();


    useEffect(() => {
        async function loadChapters() {
            if (thesisId === null) {
                return;
            }

            try {

                const loadedChapters =
                    await getChapters(thesisId);

                setChapters(loadedChapters);
            } catch (error) {
                console.error(
                    "Kapitel konnten nicht geladen werden:",
                    error
                );

                showError(
                    error instanceof Error
                        ? error.message
                        : "Kapitel konnten nicht geladen werden!"
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

        if (thesisId === null) {
            showError("Keine Thesis zugeordnet.");
            return false;
        }

        let parentId: number | null = null;
        let position = 0;

        const referenceChapter =
            addChapterContext.chapter;


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

            await addChapter(
                thesisId,
                {
                    title,
                    parentId,
                    position
                }
            );

            const updatedChapters =
                await getChapters(thesisId);

            setChapters(updatedChapters);
            setAddChapterContext(null);

            return true;
        } catch (error) {
            console.error(
                "Kapitel konnte nicht erstellt werden:",
                error
            );

            showError(
                error instanceof Error
                    ? error.message
                    : "Kapitel konnte nicht erstellt werden!"
            );

            return false;
        }
    }


    async function handleUpdateChapter(
        title: string
    ) {

        if (!editChapter) {
            return;
        }

        try {

            const updatedChapter =
                await updateChapter(
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

            showError(
                error instanceof Error
                    ? error.message
                    : "Kapitel konnte nicht aktualisiert werden!"
            );
        }
    }

    async function handleDeleteChapter(
        chapter: Chapter
    ) {

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

            if (selectedChapter?.id === chapter.id) {
                setSelectedChapter(null);
                setComments([]);
                setShowCommentSidebar(false);
            }
        } catch (error) {
            console.error(
                "Kapitel konnte nicht gelöscht werden:",
                error
            );

            showError(
                error instanceof Error
                    ? error.message
                    : "Kapitel konnte nicht gelöscht werden!"
            );
        }
    }
    async function handleCommentClick(
        chapter: Chapter
    ) {

        try {

            setSelectedChapter(chapter);

            const feedbackEntries =
                await getFeedbackEntries(chapter.id);

            const loadedComments: UIComment[] =
                feedbackEntries.map(entry => ({

                    content: entry.content,

                    createdAt:
                        new Date(entry.createdAt)
                            .toLocaleDateString(
                                "de-DE"
                            )
                        +
                        " "
                        +
                        new Date(entry.createdAt)
                            .toLocaleTimeString(
                                "de-DE",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            ),

                    supervisorName: "Betreuer"

                }));

            setComments(loadedComments);

            setShowCommentSidebar(true);

        } catch (error) {

            console.error(
                "Kommentare konnten nicht geladen werden:",
                error
            );

            showError(
                error instanceof Error
                    ? error.message
                    : "Kommentare konnten nicht geladen werden!"
            );
        }
    }
    function handleCloseCommentSidebar() {
        setShowCommentSidebar(false);
        setSelectedChapter(null);
        setComments([]);
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

                <div
                    className="
                        outline-page-header
                        flex
                        justify-end
                    "
                >

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

                    onEditChapter={
                        setEditChapter
                    }

                    onDeleteChapter={
                        handleDeleteChapter
                    }

                    onCommentClick={
                        handleCommentClick
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

                        mode={
                            addChapterContext.mode
                        }

                        referenceChapter={
                            addChapterContext.chapter
                        }
                        onCancel={() =>
                            setAddChapterContext(null)
                        }

                        onSubmit={
                            handleAddChapter
                        }

                    />
                )}

                {editChapter && (
                    <EditChapterModal

                        chapter={
                            editChapter
                        }

                        onCancel={() =>
                            setEditChapter(null)
                        }

                        onSubmit={
                            handleUpdateChapter
                        }

                        onDelete={() =>
                            handleDeleteChapter(
                                editChapter
                            )
                        }

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
                                className="
                                    rounded-full
                                    p-2
                                "
                                onClick={
                                    handleCloseCommentSidebar
                                }
                            >
                                <PanelRightClose/>
                            </button>
                        </div>


                        {selectedChapter && (

                            <h3
                                className="
                                    font-semibold
                                    text-xl
                                    mb-4
                                "
                            >
                                {selectedChapter.title}
                            </h3>

                        )}


                        {comments.length === 0 ? (

                            <p className="opacity-60">
                                Noch keine Kommentare vorhanden.
                            </p>

                        ) : (

                            comments.map(
                                (comment, index) => (

                                    <CommentItem

                                        key={index}

                                        content={
                                            comment.content
                                        }

                                        createdAt={
                                            comment.createdAt
                                        }

                                        supervisorName={
                                            comment.supervisorName
                                        }

                                    />

                                )
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