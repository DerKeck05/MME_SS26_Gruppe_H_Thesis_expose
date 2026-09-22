import OutlineItem from "./outline-item.tsx";
import {type Chapter, getChapterNumbers} from "../../utils/outline-utils.ts";
import {dummyChapters} from "../../utils/chapter-dummy-data.ts";

function OutlineComponent() {
    const dummyData: Chapter[] = dummyChapters;

    const sortedChapters = [...dummyData].sort((a, b) => {
        return getChapterNumbers(a, dummyData).localeCompare(
            getChapterNumbers(b, dummyData),
            undefined,
            {numeric: true}
        );
    });

    /*function loadChapter() {

    }
    */
    return (
        <div className={"outline-component flex flex-col gap-2 mt-(--spacing-small) "}>
            {sortedChapters.map((chapter: Chapter) => {
                return (
                    <OutlineItem key={chapter.id}
                                 chapterNumber={getChapterNumbers(chapter, dummyData)}
                                 title={chapter.title}
                                 level={getChapterNumbers(chapter, dummyData).split(".").length - 1}
                                 isParent={dummyData.some(child => child.parentId === chapter.id)}
                    />
                );
            })}
        </div>
    );
}

export default OutlineComponent;