import {useState} from "react";
import {ChevronDown, ChevronUp, MessageSquareText} from "lucide-react";
import type {UIChapter} from "./outline-component.tsx";
import EditChapterModal from "./modals/edit-chapter-modal.tsx";

function OutlineItem({
                         chapter,
                         onCommentClick
                     }: {
    chapter: UIChapter;
    onCommentClick?: () => void;
}) {
    const [showChildren, setShowChildren] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <div
            className="
        outline-item
        grid
        grid-cols-[auto_1fr_auto]
        items-center
        gap-4
        p-(--spacing-small)
        bg-night-blue
        text-(--white)
        rounded-(--border-radius)
        select-none
    "
            style={{
                marginLeft: `${chapter.level * 32}px`
            }}
            onDoubleClick={() => {
                setShowEditModal(true)
            }}
        >

            {/* Kapitelnummer */}
            <p className="font-semibold text-xl">
                {chapter.number}
            </p>

            {/* Titel */}
            <p className="font-medium text-lg text-left">
                {chapter.title}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2">
                {chapter.hasComment && (
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        onClick={onCommentClick}
                    >
                        <MessageSquareText/>
                    </button>
                )}

                {chapter.isParent && (
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        onClick={() => setShowChildren(!showChildren)}
                    >
                        {showChildren ? <ChevronUp/> : <ChevronDown/>}
                    </button>
                )}
            </div>

            {showEditModal && (
                <EditChapterModal
                    onCancel={() => {
                        setShowEditModal(false)
                    }}
                    onSubmit={() => {
                        setShowEditModal(false)
                    }}
                    onDelete={() => {
                    }}
                    chapter={chapter}
                />
            )}
        </div>
    );
}

export default OutlineItem;