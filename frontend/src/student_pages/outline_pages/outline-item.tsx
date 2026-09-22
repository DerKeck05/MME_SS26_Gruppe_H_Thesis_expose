import {useState} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

interface ChapterDisplay {
    chapterNumber: string;
    title: string;
    isChild: boolean;
}

function OutlineItem({chapterNumber, title, isChild }: ChapterDisplay) {
    const [showChildren, setShowChildren] = useState(true);

    return (
        <div className="outline-item grid grid-cols-[40px_1fr_40px] items-center p-(--spacing-small) bg-night-blue text-(--white) rounded-(--border-radius) mt-(--spacing-small) mb-(--spacing-small)">
            <p className="font-semibold text-xl">
                {chapterNumber}
            </p>

            <p className="font-medium text-lg text-center">
                {title}
            </p>

            <div className="flex justify-center">
                {isChild && (
                    <button
                        className="show-children-button rounded-full"
                        onClick={() => setShowChildren(!showChildren)}
                    >
                        {showChildren ? <ChevronUp /> : <ChevronDown />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default OutlineItem;