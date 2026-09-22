import {useState} from "react";
import {ChevronDown, ChevronUp, MessageSquareText} from "lucide-react";

interface ChapterDisplay {
    chapterNumber: string;
    title: string;
    level: number;
    isParent: boolean;
    hasComment: boolean;
}

function OutlineItem({
                         chapterNumber,
                         title,
                         level,
                         isParent,
                         hasComment
                     }: ChapterDisplay) {
    const [showChildren, setShowChildren] = useState(true);

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
    "
            style={{
                marginLeft: `${level * 32}px`
            }}
        >
            {/* Kapitelnummer */}
            <p className="font-semibold text-xl">
                {chapterNumber}
            </p>

            {/* Titel */}
            <p className="font-medium text-lg text-left">
                {title}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2">
                {hasComment && (
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        onClick={() => {
                        }}
                    >
                        <MessageSquareText/>
                    </button>
                )}

                {isParent && (
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        onClick={() => setShowChildren(!showChildren)}
                    >
                        {showChildren ? <ChevronUp/> : <ChevronDown/>}
                    </button>
                )}
            </div>
        </div>
    );
}

export default OutlineItem;