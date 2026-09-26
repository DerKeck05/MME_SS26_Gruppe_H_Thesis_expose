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

function OutlineComponent({
                              chapters,
                              onEditChapter,
                              onDeleteChapter,
                              onCommentClick,
                              onAddChild,
                              onAddBefore,
                              onAddAfter
                          }: OutlineComponentProps) {

    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
        new Set()
    );

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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
                isParent: chapters.some(
                    child => child.parentId === chapter.id
                ),
                hasComment: true,
            };
        });

    return (
        <div className="outline-component flex flex-col gap-2 mt-(--spacing-small)">
            {uiChapters.map(chapter => {
                const originalChapter = chapters.find(
                    item => item.id === chapter.id
                );

                if (!originalChapter) {
                    return null;
                }

                if (!isChapterVisible(
                    originalChapter,
                    chapters,
                    expandedChapters
                )) {
                    return null;
                }

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