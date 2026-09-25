import {useEffect, useState} from "react";
import OutlineComponent from "./outline-component.tsx";
import AddChapterModal from "../modals/outline-modals/add-chapter-modal.tsx";
import EditChapterModal from "../modals/outline-modals/edit-chapter-modal.tsx";
import type {Chapter} from "../../utils/outline-utils.ts";
import {
    getChapterNumbers,
    getParentIdAndPosition
} from "../../utils/outline-utils.ts";
import {
    getChapters,
    addChapter,
    updateChapter,
    deleteChapter
} from "../../apis/chapter-api.ts";
import {dummyChapters} from "../../utils/chapter-dummy-data.ts";
import {Plus} from "lucide-react";
import {useStudent} from "../route_handling/student-provider.tsx";

function OutlinePage() {
    const [chapters, setChapters] = useState<Chapter[]>(dummyChapters);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editChapter, setEditChapter] = useState<Chapter | null>(null);
    const [showCommentSidebar, setShowCommentSidebar] = useState(false);

    const thesisId = useStudent().thesisId;

    useEffect(() => {
        async function loadChapters() {
            try {
                const loadedChapters = await getChapters(thesisId);
                setChapters(loadedChapters);
            } catch (error) {
                console.error("Kapitel konnten nicht geladen werden:", error);
            }
        }

        void loadChapters();
    }, []);

    async function handleAddChapter(
        title: string,
        chapterNumber: string
    ): Promise<boolean> {
        const data = getParentIdAndPosition(chapterNumber, chapters);

        if (!data) {
            return false;
        }

        try {
            const newChapter = await addChapter(thesisId, {
                title,
                parentId: data.parentId,
                position: data.position,
            });

            setChapters(current => [...current, newChapter]);
            return true;
        } catch (error) {
            console.error("Kapitel konnte nicht erstellt werden:", error);
            return false;
        }
    }

    async function handleUpdateChapter(
        title: string,
        chapterNumber: string
    ) {
        if (!editChapter) {
            return;
        }

        const data = getParentIdAndPosition(chapterNumber, chapters);

        if (!data) {
            return;
        }

        try {
            const updatedChapter = await updateChapter(editChapter.id, {
                title,
                parentId: data.parentId,
                position: data.position,
            });

            setChapters(current =>
                current.map(chapter =>
                    chapter.id === updatedChapter.id
                        ? updatedChapter
                        : chapter
                )
            );

            setEditChapter(null);
        } catch (error) {
            console.error("Kapitel konnte nicht aktualisiert werden:", error);
        }
    }

    async function handleDeleteChapter() {
        if (!editChapter) {
            return;
        }

        try {
            await deleteChapter(editChapter.id);

            setChapters(current =>
                current.filter(chapter => chapter.id !== editChapter.id)
            );

            setEditChapter(null);
        } catch (error) {
            console.error("Kapitel konnte nicht gelöscht werden:", error);
        }
    }

    return (
        <div className={"flex flex-row"}>
            <div
                className="outline-page flex flex-4/6 bg-(--white) rounded-(--border-radius) flex-col m-(--spacing-medium) p-(--spacing-medium)">
                <div className="outline-page-header flex justify-end">
                    <button className="w-20 h-10 rounded-(--border-radius)" onClick={() => {
                        setShowAddModal(true);
                    }}>
                        <Plus/>
                    </button>
                </div>

                <OutlineComponent
                    chapters={chapters}
                    onEditChapter={setEditChapter}
                    onCommentClick={() => {setShowCommentSidebar(!showCommentSidebar)}}
                />

                {showAddModal && (
                    <AddChapterModal
                        onCancel={() => setShowAddModal(false)}
                        onSubmit={async (title, chapterNumber) => {
                            const result = await handleAddChapter(title, chapterNumber);
                            if (result) setShowAddModal(false);
                        }}
                    />
                )}

                {editChapter && (
                    <EditChapterModal
                        chapter={editChapter}
                        initialChapterNumber={
                            getChapterNumbers(editChapter, chapters)
                        }
                        onCancel={() => setEditChapter(null)}
                        onSubmit={handleUpdateChapter}
                        onDelete={handleDeleteChapter}
                    />
                )}
            </div>

            {showCommentSidebar && (
                <div
                    className={"flex flex-1/3 bg-(--white) rounded-(--border-radius) flex-col mr-(--spacing-medium) mt-(--spacing-medium) mb-(--spacing-medium)p-(--spacing-medium)"}>
                    {/*TODO hier dann Kommentare für Kapitel laden*/}
                </div>
            )}
        </div>
    );
}

export default OutlinePage;