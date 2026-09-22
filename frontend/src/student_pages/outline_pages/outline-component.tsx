import OutlineItem from "./outline-item.tsx";
import {type Chapter, getChapterNumbers} from "../../utils/outline-utils.ts";
import {dummyChapters} from "../../utils/chapter-dummy-data.ts";

function OutlineComponent() {
    const dummyData: Chapter[] = dummyChapters;


    /*function loadChapter() {

    }
    */
    return (
        <div className={"outline-component flex flex-col gap-4"}>
            {dummyData.map((chapter: Chapter) => {
                return (
                    <OutlineItem key={chapter.id}
                                 chapterNumber={getChapterNumbers(chapter, dummyData)}
                                 title={chapter.title}
                                 isChild={chapter.parentId !== null}
                    />
                );
            })}
        </div>
    );
}

export default OutlineComponent;