import {ChevronDown, ChevronUp, MessageSquareText} from "lucide-react";
import type {UIChapter} from "./outline-component.tsx";

interface OutlineItemProps {
    chapter: UIChapter;
    isExpanded: boolean;
    onToggle: () => void;
    onCommentClick?: () => void;
    onEdit?: () => void;
}

function OutlineItem({
                         chapter,
                         isExpanded,
                         onToggle,
                         onCommentClick,
                         onEdit
                     }: OutlineItemProps) {

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
            onDoubleClick={onEdit}
        >
            <p className="font-semibold text-xl">
                {chapter.number}
            </p>

            <p className="font-medium text-lg text-left">
                {chapter.title}
            </p>

            <div className="flex items-center justify-end gap-2">
                {chapter.hasComment && (
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        onClick={onCommentClick}
                    >
                        <MessageSquareText/>
                    </button>
                )}

                {chapter.isParent && (
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        onClick={onToggle}
                    >
                        {isExpanded
                            ? <ChevronUp/>
                            : <ChevronDown/>
                        }
                    </button>
                )}
            </div>
        </div>
    );
}

export default OutlineItem;