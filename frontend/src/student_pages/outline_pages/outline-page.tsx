import { useEffect, useState} from "react";
import { FileText, PanelRightClose,Plus} from "lucide-react";
import OutlineComponent from "./outline-component.tsx";
import AddChapterModal from "../modals/outline-modals/add-chapter-modal.tsx";
import EditChapterModal from "../modals/outline-modals/edit-chapter-modal.tsx";
import type { Chapter, ChapterInsertMode} from "../../utils/outline-utils.ts";
import { addChapter, deleteChapter, exportPdf, getChapters, updateChapter} from "../../apis/chapter-api.ts";
import {addFeedbackEntry, getFeedbackEntries} from "../../apis/feedback-api.ts";
import CommentItem, {type UIComment} from "./comments/comment-item.tsx";
import {useError} from "../../globals/error-provider.tsx";


/*
Defines the maximum number
of characters allowed
for a chapter title.
The value is exported because
the chapter modals can also use it.
*/
export const MAX_CHAPTER_TITLE_LENGTH =
    60;


/*
Students can manage chapters.
Professors can read the outline
and add feedback comments.
*/
type OutlinePageProps = {
    thesisId: number | null;
    isProfessor: boolean;
};


/*
The backend returns the creation date
as a string.
This function converts it
into a German date and time
for the user interface.
*/
function formatCommentDate(
    dateString: string
) {

    const date =
        new Date(
            dateString
        );


    return (
        date.toLocaleDateString(
            "de-DE"
        )
        +
        " "
        +
        date.toLocaleTimeString(
            "de-DE",
            {
                hour:
                    "2-digit",

                minute:
                    "2-digit"
            }
        )
    );
}


/*
This is the main page
of the outline feature.
It loads the chapters,
handles chapter changes
and manages the comment sidebar.
*/
function OutlinePage({
    thesisId,
    isProfessor
}: OutlinePageProps) {

    /*
    Stores all chapters
    of the current thesis.
    */
    const [
        chapters,
        setChapters
    ] = useState<Chapter[]>([]);


    /*
    Stores the chapter
    that is currently edited.
    null means that
    the edit modal is closed.
    */
    const [
        editChapter,
        setEditChapter
    ] = useState<Chapter | null>(null);


    /*
    Stores where a new chapter
    should be inserted.
    chapter is optional because
    a new root chapter does not need
    a reference chapter.
    */
    const [
        addChapterContext,
        setAddChapterContext
    ] = useState<{
        mode: ChapterInsertMode;
        chapter?: Chapter;
    } | null>(null);


    /*
    Stores if the comment sidebar
    is currently visible.
    */
    const [
        showCommentSidebar,
        setShowCommentSidebar
    ] = useState(false);


    /*
    Stores the chapter
    whose comments are currently shown.
    */
    const [
        selectedChapter,
        setSelectedChapter
    ] = useState<Chapter | null>(null);


    /*
    Stores the comments
    of the selected chapter.
    */
    const [
        comments,
        setComments
    ] = useState<UIComment[]>([]);


    /*
    Stores the text
    entered by the professor.
    */
    const [
        newComment,
        setNewComment
    ] = useState("");


    /*
    showError displays errors
    using the global error provider.
    */
    const {
        showError
    } = useError();


    /*
    Whenever the thesis ID changes,
    all chapters of the thesis
    are loaded again.
    */
    useEffect(() => {

        async function loadChapters() {

            /*
            Without a thesis ID
            there are no chapters to load.
            */
            if (
                thesisId == null
            ) {

                setChapters(
                    []
                );

                return;
            }
            try {

                const loadedChapters =
                    await getChapters(
                        thesisId
                    );

                setChapters(
                    loadedChapters
                );

            } catch (error) {

                console.error(
                    "Kapitel konnten nicht geladen werden:",
                    error
                );


                if (
                    error instanceof Error
                ) {

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

    }, [
        thesisId
    ]);


    /*
    The function returns true
    if the chapter was created successfully.
    */
    async function handleAddChapter(
        title: string
    ): Promise<boolean> {

        if (
            addChapterContext == null
        ) {

            return false;
        }


        if (
            thesisId == null
        ) {

            showError(
                "Keine Thesis zugeordnet."
            );

            return false;
        }


        /*
        They are changed depending
        on the selected insert mode.
        */
        let parentId: number | null =
            null;

        let position =
            0;


        const referenceChapter =
            addChapterContext.chapter;


        /*
        A root chapter has no parent.
        The new chapter is added
        after all existing root chapters.
        */
        if (
            addChapterContext.mode == "root"
        ) {

            let rootChapterCount =
                0;


            for (const chapter of chapters) {

                if (
                    chapter.parentId == null
                ) {

                    rootChapterCount++;
                }
            }


            parentId =
                null;

            position =
                rootChapterCount;
        }


        /*
        The selected reference chapter
        becomes the parent.
        The new chapter is added
        after its existing children.
        */
        if (
            referenceChapter != null &&
            addChapterContext.mode == "child"
        ) {

            let childCount =
                0;


            for (const chapter of chapters) {

                if (
                    chapter.parentId ==
                    referenceChapter.id
                ) {

                    childCount++;
                }
            }


            parentId =
                referenceChapter.id;

            position =
                childCount;
        }


        /*
        The new chapter gets
        the same parent and position
        as the reference chapter.
        The backend handles
        the required position changes.
        */
        if (
            referenceChapter != null &&
            addChapterContext.mode == "before"
        ) {

            parentId =
                referenceChapter.parentId;

            position =
                referenceChapter.position;
        }


        /*
        The new chapter gets
        the same parent.
        Its position is directly
        after the reference chapter.
        */
        if (
            referenceChapter != null &&
            addChapterContext.mode == "after"
        ) {

            parentId =
                referenceChapter.parentId;

            position =
                referenceChapter.position + 1;
        }


        try {

            /*
            Create the chapter
            in the database.
            */
            await addChapter(
                thesisId,
                {
                    title:
                        title,

                    parentId:
                        parentId,

                    position:
                        position
                }
            );


            /*
            Reload all chapters
            so the UI uses
            the newest database state.
            */
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


            if (
                error instanceof Error
            ) {

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


    /*
    Updates the title
    of the currently selected chapter.
    */
    async function handleUpdateChapter(
        title: string
    ) {

        if (
            editChapter == null
        ) {

            return;
        }

        try {

            const updatedChapter =
                await updateChapter(
                    editChapter.id,
                    {
                        title:
                            title
                    }
                );

            /*
            Create a new chapter list.
            The changed chapter is replaced
            with the updated response.
            All other chapters stay unchanged.
            */
            const updatedChapters: Chapter[] =
                [];


            for (const chapter of chapters) {

                if (
                    chapter.id ==
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


            if (
                error instanceof Error
            ) {

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


    /*
    Deletes the chapter
    from the database.
    Afterwards all chapters
    are loaded again.
    */
    async function handleDeleteChapter(
        chapter: Chapter
    ) {

        try {

            await deleteChapter(
                chapter.id
            );


            /*
            Reload the outline
            after deletion.
        This also makes sure
            that deleted child chapters
            no longer remain in the UI.
            */
            if (
                thesisId != null
            ) {

                const updatedChapters =
                    await getChapters(
                        thesisId
                    );


                setChapters(
                    updatedChapters
                );
            }


            setEditChapter(
                null
            );


            /*
            If the deleted chapter
            is currently shown
            in the comment sidebar,
            the sidebar is closed.
            */
            if (
                selectedChapter != null &&
                selectedChapter.id ==
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

        } catch (error) {

            console.error(
                "Kapitel konnte nicht gelöscht werden:",
                error
            );


            if (
                error instanceof Error
            ) {

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


    /*
    Exports the complete outline
    of the current thesis as a PDF.
    */
    async function handleExportPdf() {

        if (
            thesisId == null
        ) {

            return;
        }

        try {

            await exportPdf(
                thesisId
            );

        } catch (error) {

            console.error(
               "PDF konnte nicht exportiert werden:",
                error
            );


            if (
                error instanceof Error
            ) {

                showError(
                    error.message
                );

            } else {

                showError(
                    "PDF konnte nicht exportiert werden!"
                );
            }
        }
    }


    /*
    Loads all feedback entries
    belonging to the clicked chapter.
    Students and professors
    can both read comments.
    */
    async function handleCommentClick(
        chapter: Chapter
    ) {

        try {

            const feedbackEntries =
                await getFeedbackEntries(
                    chapter.id
                );


            const loadedComments: UIComment[] =
                [];


            for (const feedback of feedbackEntries) {

                loadedComments.push({
                    content:
                        feedback.content,

                    createdAt:
                        formatCommentDate(
                            feedback.createdAt
                        ),

                    /*
                    The current backend response
                    does not contain a professor name.
                    Therefore the general label
                    "Betreuer" is shown.
                    */
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


            if (
                error instanceof Error
            ) {

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


    /*
    Only professors are allowed
    to create feedback comments.
    Comments can be created and read,
    but are not edited or deleted.
    */
    async function handleAddFeedback() {

        if (
            isProfessor == false
        ) {

            return;
        }


        if (
            selectedChapter == null
        ) {

            return;
        }

        if (
            newComment.trim() == ""
        ) {
            return;
        }

        try {

            const feedback =
                await addFeedbackEntry(
                    selectedChapter.id,
                    newComment.trim()
                );


            const newUiComment: UIComment = {
                content:
                    feedback.content,

                createdAt:
                    formatCommentDate(
                        feedback.createdAt
                    ),

                supervisorName:
                    "Betreuer"
            };

            const updatedComments =
                [...comments];


            updatedComments.push(
                newUiComment
            );


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


            if (
                error instanceof Error
            ) {

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


    /*
    Closes the sidebar
    and removes all selected
    comment information.
    */
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


    /*
    Shows either an empty message ,all loaded comments
    */
    function showComments() {

        if (
            comments.length == 0
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
                    key={
                        index
                    }
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


    /*
    Students can only read comments.
    Therefore the input field
    is only shown to professors.
    */
    function showCommentInput() {

        if (
            isProfessor == false
        ) {

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
                        text-black
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

            {/*
            Contains the chapter tree,
            chapter controls
            and PDF export.
            */}
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

                {/* OUTLINE HEADER */}

                <div
                    className="
                        outline-page-header
                        flex
                        justify-end
                    "
                >

                    {/*
                    Students can create chapters.
                    Professors only review
                    the existing outline.
                    */}
                    {
                        isProfessor == false && (

                            <button
                                className="
                                    squared-button
                                    w-20
                                    h-10
                                    rounded-(--border-radius)
                                "
                                onClick={() => {

                                    setAddChapterContext({
                                        mode:
                                            "root"
                                    });

                                }}
                            >
                                <Plus />
                            </button>
                        )
                    }


                    {/*
                    PDF export is available
                    for the current outline.
                    */}
                    <button
                        className="
                            squared-button
                            w-20
                            h-10
                            rounded-(--border-radius)
                        "
                        onClick={
                            handleExportPdf
                        }
                    >
                        <FileText />
                    </button>

                </div>


                {/*
                OUTLINE COMPONENT
                Displays all chapters
                and sends user actions
                back to this page.
                */}
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
                            mode:
                                "child",

                            chapter:
                                chapter
                        });

                    }}
                    onAddBefore={(chapter) => {

                        setAddChapterContext({
                            mode:
                                "before",

                            chapter:
                                chapter
                        });

                    }}
                    onAddAfter={(chapter) => {

                        setAddChapterContext({
                            mode:
                                "after",

                            chapter:
                                chapter
                        });

                    }}
                />


                {/* KAPITEL HINZUFÜGEN MODAL */}

                {
                    addChapterContext != null && (

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
                    )
                }


                {/* KAPITEL BEARBEITEN MODAL */}

                {
                    editChapter != null && (

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
                    )
                }

            </div>


            {/*
            The sidebar is shown
            after a chapter comment button
            was clicked.
            */}
            {
                showCommentSidebar == true && (

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

                            {/* SIDEBAR SCHLIESSEN */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    mb-(--spacing-small)
                                "
                            >

                                <button
                                    type="button"
                                    className="
                                        rounded-full
                                        p-2
                                    "
                                    onClick={
                                        closeComments
                                    }
                                >
                                    <PanelRightClose />
                                </button>

                            </div>


                            {/* AUSGEWÄHLTES KAPITEL */}

                            {
                                selectedChapter != null && (

                                    <h3
                                        className="
                                            font-semibold
                                            text-xl
                                            mb-4
                                        "
                                    >
                                        {selectedChapter.title}
                                    </h3>
                                )
                            }


                            {/* VORHANDENE KOMMENTARE */}

                            {showComments()}
            
                            {/* PROFESSOR KOMMENTAR EINGABE */}

                            {showCommentInput()}

                        </div>

                    </div>
                )
            }

        </div>
    );
}


export default OutlinePage;