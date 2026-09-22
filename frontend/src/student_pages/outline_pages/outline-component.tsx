import OutlineItem from "./outline-item.tsx";
import {type Chapter, getChapterNumbers} from "../../utils/outline-utils.ts";
//import {useEffect, useState} from "react";
//import {getChapters} from "../../apis/chapter-api.ts";

export interface UIChapter {
    id: number;
    title: string;
    number: string;
    level: number;
    isParent: boolean;
    hasComment: boolean;
}

//const thesisId = 1;

interface OutlineComponentProps {
    chapters: Chapter[];
    onEditChapter: (chapter: Chapter) => void;
}

function OutlineComponent({chapters, onEditChapter}: OutlineComponentProps) {
    const uiChapters: UIChapter[] = [...chapters]
        .sort((a, b) => {
            return getChapterNumbers(a, chapters).localeCompare(
                getChapterNumbers(b, chapters),
                undefined,
                {numeric: true}
            );
        })
        .map((chapter) => {
            const number = getChapterNumbers(chapter, chapters);

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
            {uiChapters.map((chapter) => {
                const originalChapter = chapters.find(
                    item => item.id === chapter.id
                );

                if (!originalChapter) {
                    return null;
                }

                return (
                    <OutlineItem
                        key={chapter.id}
                        chapter={chapter}
                        onEdit={() => onEditChapter(originalChapter)}
                        onCommentClick={() => {
                            // showCommentSidebar
                        }}
                    />
                );
            })}
        </div>
    );
}

export default OutlineComponent;