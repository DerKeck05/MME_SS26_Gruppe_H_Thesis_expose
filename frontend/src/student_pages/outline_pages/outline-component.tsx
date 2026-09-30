import {useEffect, useState} from "react";
import OutlineItem from "./outline-item.tsx";
import {
    type Chapter,
    getChapterNumbers,
    isChapterVisible
} from "../../utils/outline-utils.ts";

export interface UIChapter {
    id: number;
    title: string;
    number: string;
    level: number;
    isParent: boolean;
    hasComment: boolean;
}

interface OutlineComponentProps {
    chapters: Chapter[];

    onEditChapter: (chapter: Chapter) => void;
    onDeleteChapter: (chapter: Chapter) => void;
    onCommentClick: (chapter: Chapter) => void;

    onAddChild: (chapter: Chapter) => void;
    onAddBefore: (chapter: Chapter) => void;
    onAddAfter: (chapter: Chapter) => void;
}

// Outline container that holds and displays the outline items
function OutlineComponent({
                              chapters,
                              onEditChapter,
                              onDeleteChapter,
                              onCommentClick,
                              onAddChild,
                              onAddBefore,
                              onAddAfter
                          }: OutlineComponentProps) {

    // Stores the IDs of chapters whose children are currently expanded
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
        new Set()
    );

    // Stores the ID of the chapter whose action menu is currently open
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Expands all chapters that have children when the chapter list changes
    useEffect(() => {
        const parentChapterIds = chapters
            .filter(chapter =>
                chapters.some(
                    child => child.parentId === chapter.id
                )
            )
            .map(chapter => chapter.id);

        setExpandedChapters(new Set(parentChapterIds));
    }, [chapters]);

    // Toggles the expanded state of a chapter
    function toggleChapter(chapterId: number) {
        setExpandedChapters(current => {
            const next = new Set(current);

            if (next.has(chapterId)) {
                next.delete(chapterId);
            } else {
                next.add(chapterId);
            }

            return next;
        });
    }

    // Converts the backend chapter data into the format needed by the UI
    // and sorts the chapters according to their hierarchical chapter number
    const uiChapters: UIChapter[] = [...chapters]
        .sort((a, b) => {
            return getChapterNumbers(a, chapters).localeCompare(
                getChapterNumbers(b, chapters),
                undefined,
                {numeric: true}
            );
        })
        .map(chapter => {
            const number = getChapterNumbers(
                chapter,
                chapters
            );

            return {
                id: chapter.id,
                title: chapter.title,
                number,
                level: number.split(".").length - 1,

                // Checks if the chapter has any children
                isParent: chapters.some(
                    child => child.parentId === chapter.id
                ),

                // Currently set to true for the dummy comments
                hasComment: true,
            };
        });

    return (
        <div className="outline-component flex flex-col gap-2 mt-(--spacing-small)">
            {uiChapters.map(chapter => {

                // Finds the original chapter data for the current UI chapter
                const originalChapter = chapters.find(
                    item => item.id === chapter.id
                );

                // Skips the chapter if the original data cannot be found
                if (!originalChapter) {
                    return null;
                }

                // Skips chapters whose parent chapter is currently collapsed
                if (!isChapterVisible(
                    originalChapter,
                    chapters,
                    expandedChapters
                )) {
                    return null;
                }

                // Displays the chapter with all required actions and callbacks
                return (
                    <OutlineItem
                        key={chapter.id}
                        chapter={chapter}
                        isExpanded={expandedChapters.has(chapter.id)}

                        isMenuOpen={openMenuId === chapter.id}

                        onMenuToggle={() => {
                            setOpenMenuId(current =>
                                current === chapter.id
                                    ? null
                                    : chapter.id
                            );
                        }}

                        onMenuClose={() => {
                            setOpenMenuId(null);
                        }}

                        onToggle={() =>
                            toggleChapter(chapter.id)
                        }

                        onEdit={() =>
                            onEditChapter(originalChapter)
                        }

                        onDelete={() =>
                            onDeleteChapter(originalChapter)
                        }

                        onCommentClick={() =>
                            onCommentClick(originalChapter)
                        }

                        onAddChild={() =>
                            onAddChild(originalChapter)
                        }

                        onAddBefore={() =>
                            onAddBefore(originalChapter)
                        }

                        onAddAfter={() =>
                            onAddAfter(originalChapter)
                        }
                    />
                );
            })}
        </div>
    );
}

export default OutlineComponent;