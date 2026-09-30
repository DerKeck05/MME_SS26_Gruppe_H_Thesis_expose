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
    addFeedbackEntry,
    getFeedbackEntries
} from "../../apis/feedback-api.ts";

import CommentItem, {
    type UIComment
} from "./comments/comment-item.tsx";

import {useError} from "../../globals/error-provider.tsx";


export const MAX_CHAPTER_TITLE_LENGTH = 60;


type OutlinePageProps = {
    thesisId: number | null;
    isProfessor: boolean;
};


function OutlinePage({
    thesisId,
    isProfessor
}: OutlinePageProps) {

    const [chapters, setChapters] =
        useState<Chapter[]>([]);

    const [editChapter, setEditChapter] =
        useState<Chapter | null>(null);

    const [addChapterContext, setAddChapterContext] =
        useState<{
            mode: ChapterInsertMode;
            chapter?: Chapter;
        } | null>(null);

    const [showCommentSidebar, setShowCommentSidebar] =
        useState(false);

    const [selectedChapter, setSelectedChapter] =
        useState<Chapter | null>(null);

    const [comments, setComments] =
        useState<UIComment[]>([]);

    const [newComment, setNewComment] =
        useState("");

    const {showError} = useError();


    useEffect(() => {

        async function loadChapters() {

            if (thesisId === null) {
                return;
            }

            try {

                const loadedChapters =
                    await getChapters(thesisId);

                setChapters(
                    loadedChapters
                );

            } catch (error) {

                console.error(
                    "Kapitel konnten nicht geladen werden:",
                    error
                );

                if (error instanceof Error) {

                    showError(
                        error.message
                    );

                } else {

                    showError(
                        "Kapitel konnten nicht geladen werden!"
                    );
                }
            }
        }


        loadChapters();

    }, [thesisId]);


    async function handleAddChapter(
        title: string
    ): Promise<boolean> {

        if (!addChapterContext) {
            return false;
        }


        if (thesisId === null) {

            showError(
                "Keine Thesis zugeordnet."
            );

            return false;
        }


        let parentId: number | null = null;

        let position = 0;


        const referenceChapter =
            addChapterContext.chapter;


        // Neues Hauptkapitel
        if (
            addChapterContext.mode === "root"
        ) {

            const rootChapters =
                chapters.filter(
                    chapter =>
                        chapter.parentId === null
                );


            parentId = null;

            position =
                rootChapters.length;
        }


        // Neues Unterkapitel
        if (
            referenceChapter &&
            addChapterContext.mode === "child"
        ) {

            const children =
                chapters.filter(
                    chapter =>
                        chapter.parentId ===
                        referenceChapter.id
                );


            parentId =
                referenceChapter.id;

            position =
                children.length;
        }


        // Kapitel davor
        if (
            referenceChapter &&
            addChapterContext.mode === "before"
        ) {

            parentId =
                referenceChapter.parentId;

            position =
                referenceChapter.position;
        }


        // Kapitel danach
        if (
            referenceChapter &&
            addChapterContext.mode === "after"
        ) {

            parentId =
                referenceChapter.parentId;

            position =
                referenceChapter.position + 1;
        }


        try {

            await addChapter(
                thesisId,
                {
                    title: title,
                    parentId: parentId,
                    position: position
                }
            );


            const updatedChapters =
                await getChapters(
                    thesisId
                );


            setChapters(
                updatedChapters
            );


            setAddChapterContext(
                null
            );


            return true;

        } catch (error) {

            console.error(
                "Kapitel konnte nicht erstellt werden:",
                error
            );


            if (error instanceof Error) {

                showError(
                    error.message
                );

            } else {

                showError(
                    "Kapitel konnte nicht erstellt werden!"
                );
            }


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


            const updatedChapters: Chapter[] = [];


            for (const chapter of chapters) {

                if (
                    chapter.id ===
                    updatedChapter.id
                ) {

                    updatedChapters.push(
                        updatedChapter
                    );

                } else {

                    updatedChapters.push(
                        chapter
                    );
                }
            }


            setChapters(
                updatedChapters
            );


            setEditChapter(
                null
            );

        } catch (error) {

            console.error(
                "Kapitel konnte nicht aktualisiert werden:",
                error
            );


            if (error instanceof Error) {

                showError(
                    error.message
                );

            } else {

                showError(
                    "Kapitel konnte nicht aktualisiert werden!"
                );
            }
        }
    }


    async function handleDeleteChapter(
        chapter: Chapter
    ) {

        try {

            await deleteChapter(
                chapter.id
            );


            const updatedChapters =
                chapters.filter(
                    currentChapter =>
                        currentChapter.id !==
                        chapter.id
                );


            setChapters(
                updatedChapters
            );


            setEditChapter(
                null
            );


            if (selectedChapter) {

                if (
                    selectedChapter.id ===
                    chapter.id
                ) {

                    setSelectedChapter(
                        null
                    );

                    setComments(
                        []
                    );

                    setShowCommentSidebar(
                        false
                    );
                }
            }

        } catch (error) {

            console.error(
                "Kapitel konnte nicht gelöscht werden:",
                error
            );


            if (error instanceof Error) {

                showError(
                    error.message
                );

            } else {

                showError(
                    "Kapitel konnte nicht gelöscht werden!"
                );
            }
        }
    }


    async function handleCommentClick(
        chapter: Chapter
    ) {

        try {

            const feedbackEntries =
                await getFeedbackEntries(
                    chapter.id
                );


            const loadedComments:
                UIComment[] = [];


            for (
                const feedback
                of feedbackEntries
            ) {

                const date =
                    new Date(
                        feedback.createdAt
                    );


                const formattedDate =
                    date.toLocaleDateString(
                        "de-DE"
                    )
                    +
                    " "
                    +
                    date.toLocaleTimeString(
                        "de-DE",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );


                loadedComments.push({

                    content:
                        feedback.content,

                    createdAt:
                        formattedDate,

                    supervisorName:
                        "Betreuer"

                });
            }


            setSelectedChapter(
                chapter
            );


            setComments(
                loadedComments
            );


            setNewComment(
                ""
            );


            setShowCommentSidebar(
                true
            );

        } catch (error) {

            console.error(
                "Kommentare konnten nicht geladen werden:",
                error
            );


            if (error instanceof Error) {

                showError(
                    error.message
                );

            } else {

                showError(
                    "Kommentare konnten nicht geladen werden!"
                );
            }
        }
    }


    async function handleAddFeedback() {

        // Studenten dürfen keine
        // Kommentare hinzufügen
        if (!isProfessor) {
            return;
        }


        if (!selectedChapter) {
            return;
        }


        if (
            newComment.trim() === ""
        ) {
            return;
        }


        try {

            const feedback =
                await addFeedbackEntry(
                    selectedChapter.id,
                    newComment
                );


            const date =
                new Date(
                    feedback.createdAt
                );


            const formattedDate =
                date.toLocaleDateString(
                    "de-DE"
                )
                +
                " "
                +
                date.toLocaleTimeString(
                    "de-DE",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            const newUiComment:
                UIComment = {

                content:
                    feedback.content,

                createdAt:
                    formattedDate,

                supervisorName:
                    "Betreuer"

            };


            const updatedComments = [
                ...comments,
                newUiComment
            ];


            setComments(
                updatedComments
            );


            setNewComment(
                ""
            );

        } catch (error) {

            console.error(
                "Kommentar konnte nicht gespeichert werden:",
                error
            );


            if (error instanceof Error) {

                showError(
                    error.message
                );

            } else {

                showError(
                    "Kommentar konnte nicht gespeichert werden!"
                );
            }
        }
    }


    function closeComments() {

        setShowCommentSidebar(
            false
        );

        setSelectedChapter(
            null
        );

        setComments(
            []
        );

        setNewComment(
            ""
        );
    }


    function showComments() {

        if (
            comments.length === 0
        ) {

            return (

                <p className="opacity-60 mb-4">

                    Noch keine Kommentare vorhanden.

                </p>

            );
        }


        return comments.map(
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
        );
    }


    function showCommentInput() {

        // Student darf Kommentare
        // nur lesen
        if (!isProfessor) {
            return null;
        }


        return (

            <div
                className="
                    mt-4
                    pt-4
                    border-t
                    border-gray-200
                "
            >

                <h4
                    className="
                        font-semibold
                        mb-2
                    "
                >
                    Kommentar hinzufügen
                </h4>


                <textarea

                    value={
                        newComment
                    }

                    onChange={(event) => {

                        setNewComment(
                            event.target.value
                        );

                    }}

                    placeholder="Kommentar schreiben..."

                    rows={4}

                    className="
                        w-full
                        border
                        border-gray-300
                        rounded-(--border-radius)
                        p-3
                        resize-none
                    "

                />


                <button
                    type="button"

                    onClick={
                        handleAddFeedback
                    }

                    className="
                        mt-3
                        px-4
                        py-2
                        bg-night-blue
                        text-(--white)
                        rounded-(--border-radius)
                    "
                >

                    Kommentar speichern

                </button>

            </div>
        );
    }


    return (

        <div
            className="
                flex
                flex-row
                items-start
            "
        >

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

                    {!isProfessor && (

                        <button
                            className="
                                squared-button
                                w-20
                                h-10
                                rounded-(--border-radius)
                            "

                            onClick={() => {

                                setAddChapterContext({
                                    mode: "root"
                                });

                            }}
                        >

                            <Plus/>

                        </button>

                    )}

                </div>


                <OutlineComponent

                    chapters={
                        chapters
                    }

                    isProfessor={
                        isProfessor
                    }

                    onEditChapter={
                        setEditChapter
                    }

                    onDeleteChapter={
                        handleDeleteChapter
                    }

                    onCommentClick={
                        handleCommentClick
                    }

                    onAddChild={(chapter) => {

                        setAddChapterContext({
                            mode: "child",
                            chapter: chapter
                        });

                    }}

                    onAddBefore={(chapter) => {

                        setAddChapterContext({
                            mode: "before",
                            chapter: chapter
                        });

                    }}

                    onAddAfter={(chapter) => {

                        setAddChapterContext({
                            mode: "after",
                            chapter: chapter
                        });

                    }}

                />


                {addChapterContext && (

                    <AddChapterModal

                        mode={
                            addChapterContext.mode
                        }

                        referenceChapter={
                            addChapterContext.chapter
                        }

                        onCancel={() => {

                            setAddChapterContext(
                                null
                            );

                        }}

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

                        onCancel={() => {

                            setEditChapter(
                                null
                            );

                        }}

                        onSubmit={
                            handleUpdateChapter
                        }

                        onDelete={() => {

                            handleDeleteChapter(
                                editChapter
                            );

                        }}

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
                            pb-(--spacing-medium)
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
                                    closeComments
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

                                {
                                    selectedChapter.title
                                }

                            </h3>

                        )}


                        {showComments()}


                        {showCommentInput()}


                    </div>

                </div>

            )}

        </div>
    );
}


export default OutlinePage;