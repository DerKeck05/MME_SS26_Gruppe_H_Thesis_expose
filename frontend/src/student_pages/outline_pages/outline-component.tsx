import OutlineItem from "./outline-item.tsx";

function OutlineComponent() {

    /*function loadChapter() {

    }
    */
    return (
        <div className={"outline-component flex-col gap-4"}>
            <OutlineItem chapterNumber={"1"} title={"Kapitel 1"} isChild={true}/>
            <OutlineItem chapterNumber={"2"} title={"Kapitel 2"} isChild={false}/>
        </div>
    );
}

export default OutlineComponent;