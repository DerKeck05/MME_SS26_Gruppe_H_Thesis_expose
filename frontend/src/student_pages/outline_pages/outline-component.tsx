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
}


interface OutlineComponentProps {

    chapters: Chapter[];

    isProfessor: boolean;

    onEditChapter:
        (chapter: Chapter) => void;

    onDeleteChapter:
        (chapter: Chapter) => void;

    onCommentClick:
        (chapter: Chapter) => void;

    onAddChild:
        (chapter: Chapter) => void;

    onAddBefore:
        (chapter: Chapter) => void;

    onAddAfter:
        (chapter: Chapter) => void;
}

// Outline container that holds and displays the outline items
function OutlineComponent({
    chapters,
    isProfessor,
    onEditChapter,
    onDeleteChapter,
    onCommentClick,
    onAddChild,
    onAddBefore,
    onAddAfter
}: OutlineComponentProps) {

    // Stores the IDs of chapters whose children are currently expanded
    const [expandedChapters, setExpandedChapters] =
        useState<Set<number>>(
            new Set()
        );

    // Stores the ID of the chapter whose action menu is currently open
    const [openMenuId, setOpenMenuId] =
        useState<number | null>(
            null
        );

    // Expands all chapters that have children when the chapter list changes
    useEffect(() => {

        const parentChapterIds: number[] = [];


        for (const chapter of chapters) {

            const children =
                chapters.filter(
                    child =>
                        child.parentId === chapter.id
                );


            if (children.length > 0) {

                parentChapterIds.push(
                    chapter.id
                );
            }
        }


        setExpandedChapters(
            new Set(parentChapterIds)
        );

    }, [chapters]);


    function toggleChapter(
        chapterId: number
    ) {

        const newExpanded =
            new Set(expandedChapters);


        if (newExpanded.has(chapterId)) {

            newExpanded.delete(chapterId);

        } else {

            newExpanded.add(chapterId);
        }


        setExpandedChapters(
            newExpanded
        );
    }

    // Converts the backend chapter data into the format needed by the UI
    // and sorts the chapters according to their hierarchical chapter number
    const uiChapters: UIChapter[] = [];


    const sortedChapters =
        [...chapters].sort(
            (a, b) => {

                const numberA =
                    getChapterNumbers(
                        a,
                        chapters
                    );


                const numberB =
                    getChapterNumbers(
                        b,
                        chapters
                    );


                return numberA.localeCompare(
                    numberB,
                    undefined,
                    {
                        numeric: true
                    }
                );
            }
        );


    for (const chapter of sortedChapters) {

        const number =
            getChapterNumbers(
                chapter,
                chapters
            );


        let isParent = false;


        for (const otherChapter of chapters) {

            if (
                otherChapter.parentId ===
                chapter.id
            ) {

                isParent = true;
            }
        }


        const uiChapter: UIChapter = {

            id: chapter.id,

            title: chapter.title,

            number: number,

            level:
                number.split(".").length - 1,

            isParent: isParent
        };


        uiChapters.push(uiChapter);
    }


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

                const visible =
                    isChapterVisible(
                        originalChapter,
                        chapters,
                        expandedChapters
                    );


                if (!visible) {

                    return null;
                }
        
                // Displays the chapter with all required actions and callbacks
                return (

                    <OutlineItem
                        key={chapter.id}

                        chapter={chapter}

                        isProfessor={
                            isProfessor
                        }

                        isExpanded={
                            expandedChapters.has(
                                chapter.id
                            )
                        }

                        isMenuOpen={
                            openMenuId ===
                            chapter.id
                        }

                        onMenuToggle={() => {

                            if (
                                openMenuId ===
                                chapter.id
                            ) {

                                setOpenMenuId(null);

                            } else {

                                setOpenMenuId(
                                    chapter.id
                                );
                            }
                        }}

                        onMenuClose={() =>
                            setOpenMenuId(null)
                        }

                        onToggle={() =>
                            toggleChapter(
                                chapter.id
                            )
                        }

                        onEdit={() =>
                            onEditChapter(
                                originalChapter
                            )
                        }

                        onDelete={() =>
                            onDeleteChapter(
                                originalChapter
                            )
                        }

                        onCommentClick={() =>
                            onCommentClick(
                                originalChapter
                            )
                        }

                        onAddChild={() =>
                            onAddChild(
                                originalChapter
                            )
                        }

                        onAddBefore={() =>
                            onAddBefore(
                                originalChapter
                            )
                        }

                        onAddAfter={() =>
                            onAddAfter(
                                originalChapter
                            )
                        }
                    />

                );
            })}

        </div>
    );
}


export default OutlineComponent;