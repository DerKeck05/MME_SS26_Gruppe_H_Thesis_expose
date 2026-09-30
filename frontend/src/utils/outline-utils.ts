//
// Business Frontend Logic for the outline that sorts the Chapter to display them correctly in the UI
// and also for choosing the right addChapter Mode [ Root, Insert as Child, Insert before, insert after ]
//

// All the Data interfaces and Types for different Usages
export interface Chapter {
    id: number;
    title: string;
    parentId: number | null;
    position: number;
    thesisId: number;
}

export interface ChapterInput {
    title: string;
    position: number;
    parentId: number | null;
}

export interface ChapterUpdateInput {
    title?: string;
    parentId?: number | null;
    position?: number;
}

export type ChapterInsertMode =
    | "root"
    | "child"
    | "before"
    | "after";


// ---------------------------
// Compares one Chapter to the List of Chapters to read which Chapter Number is has and returns it as string
export function getChapterNumbers(
    chapter: Chapter,
    chapters: Chapter[],
): string {
    const parts: number[] = [];
    let current: Chapter | undefined = chapter;

    while (current) {
        const currentChapter: Chapter = current;

        // controls if the current Viewed Chapter has Chapter on the same level and sorts them after position
        const siblings = chapters
            .filter(c => c.parentId === currentChapter.parentId)
            .sort((a, b) => a.position - b.position);

        // checks which position the current Chapter is between its siblings
        const index = siblings.findIndex(
            c => c.id === currentChapter.id
        );

        // Inserts the index + 1 (because of index 0) into the first index Position of the Parts Array
        parts.unshift(index + 1);

        // checks if the current Chapter has a parent and sets it to the new Current Chapter
        current = currentChapter.parentId === null
            ? undefined
            : chapters.find(c => c.id === currentChapter.parentId);
    }

    // Joins the Numbers saved in parts and adds them together to a string and puts a dot between the numbers for UI purposes
    return parts.join(".");
}

// TODO check if necessary
export function getChapter(
    chapterId: number,
    chapters: Chapter[]
): Chapter {
    const chapter = chapters.find(
        chapter => chapter.id === chapterId
    );

    if (!chapter) {
        throw new Error("Kapitel wurde nicht gefunden");
    }

    return chapter;
}

// Determines whether a chapter should currently be visible in the UI.
// A chapter is only visible if all of its parent chapters are expanded.
export function isChapterVisible(
    chapter: Chapter,
    chapters: Chapter[],
    expandedChapters: Set<number>
): boolean {
    let parentId = chapter.parentId;

    // Searches through the Chapter List and looks if the parent can be found and goes through the complete Parent Hierachy
    while (parentId !== null) {
        if (!expandedChapters.has(parentId)) {
            return false;
        }

        //
        const parent = chapters.find(
            chapter => chapter.id === parentId
        );

        if (!parent) {
            break;
        }

        parentId = parent.parentId;
    }

    // Returns true if all Parent Chapters are expanded, so that the child should be shown
    return true;
}