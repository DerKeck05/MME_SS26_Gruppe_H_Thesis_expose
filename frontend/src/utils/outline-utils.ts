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

export function getChapterNumbers(
    chapter: Chapter,
    chapters: Chapter[],
): string {
    const parts: number[] = [];
    let current: Chapter | undefined = chapter;

    while (current) {
        const siblings = chapters
            .filter(c => c.parentId === current.parentId)
            .sort((a, b) => a.position - b.position);

        const index = siblings.findIndex(c => c.id === current.id);

        parts.unshift(index + 1);

        current = current.parentId === null
            ? undefined
            : chapters.find(c => c.id === current!.parentId);
    }

    return parts.join(".");
}

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

export function isChapterVisible(
    chapter: Chapter,
    chapters: Chapter[],
    expandedChapters: Set<number>
): boolean {
    let parentId = chapter.parentId;

    while (parentId !== null) {
        if (!expandedChapters.has(parentId)) {
            return false;
        }

        const parent = chapters.find(
            chapter => chapter.id === parentId
        );

        if (!parent) {
            break;
        }

        parentId = parent.parentId;
    }

    return true;
}
