import OutlineItem from "./outline-item.tsx";
import {type Chapter, getChapterNumbers} from "../../utils/outline-utils.ts";
import {dummyChapters} from "../../utils/chapter-dummy-data.ts";

export interface UIChapter {
    title: string;
    number: string;
    level: number;
    isParent: boolean;
    hasComment: boolean;
}

function OutlineComponent() {
    const dummyData: Chapter[] = dummyChapters;

    const uiChapters: UIChapter[] = [...dummyData]
        .sort((a, b) => {
            return getChapterNumbers(a, dummyData).localeCompare(
                getChapterNumbers(b, dummyData),
                undefined,
                {numeric: true}
            );
        })
        .map((chapter) => {
            const number = getChapterNumbers(chapter, dummyData);

            return {
                title: chapter.title,
                number,
                level: number.split(".").length - 1,
                thesisId: 1, // später chapter.thesisId
                isParent: dummyData.some(
                    child => child.parentId === chapter.id
                ),
                hasComment: true,
            };
        });

    /*function loadChapter() {

    }
    */
    return (
        <div className={"outline-component flex flex-col gap-2 mt-(--spacing-small) "}>
            {uiChapters.map((chapter: UIChapter) => {
                return (
                    <OutlineItem key={chapter.number}
                                 chapter={chapter}
                                 onDoubleClick={() => {
                                     //showEditModal
                                 }}
                                 onCommentClick={() => {
                                     //showCommentSidebar
                                 }}
                    />
                );
            })}
        </div>
    );
}

export default OutlineComponent;