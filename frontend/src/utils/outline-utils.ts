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

export function getChapterNumbers(
    chapter: Chapter,
    chapters: Chapter[],
): string {
    // initialisiert leeres Array und speichert das übergebene Chapter in eine current Variable
    const parts: number[] = [];
    let current: Chapter | undefined = chapter;

    // solange current tatsächlich ein chapter und nicht undefined ist
    while (current) {

        // zieht alle Chapter aus der Liste, die auf der gleichen Ebene liegen wie das current Chapter
        // und sortiert sie nach Position
        const siblings = chapters
            .filter(c => c.parentId === current!.parentId)
            .sort((a, b) => a.position - b.position);

        // bestimmt die Position des current Chapters innerhalb der siblings
        const index = siblings.findIndex(c => c.id === current!.id);

        // Kapitelnummer wird vorne in die Liste eingefügt
        parts.unshift(index + 1);

        // Dann zum Parent wechseln und die Schleife neu durchlaufen oder es gibt keinen Parent mehr,
        // dann wird die Schleife beendet
        current = current.parentId === null
            ? undefined
            : chapters.find(c => c.id === current!.parentId);
    }

    // Zuletzt die Kapitelnummern mit Punkten zu einem String zusammen setzen:
    // [2,1,3] → 2.1.3
    return parts.join(".");
}

export function getChapterPositionAndParent(
    chapterNumber: string,
    chapters: Chapter[]
): Chapter | undefined {
    // String wird in die einzelnen Zahlen gesplitted
    const positions = chapterNumber
        .split(".")
        .map(number => Number(number) - 1);

    // parentId und current werden gespeichert, nur wird hier auf der obersten Ebene angefangen,
    // deswegen parentId mit null initialisieren
    let parentId: number | null = null;
    let current: Chapter | undefined;

    // Alle Ebenen des Kapitels werden einmal durchlaufen
    for (const position of positions) {
        // Chapter aus gleicher Ebene suchen und dann sortieren, damit ArrayIndex der Position entspricht
        const siblings = chapters
            .filter(chapter => chapter.parentId === parentId)
            .sort((a, b) => a.position - b.position);

        // Chapter an akteller position rausziehen
        current = siblings[position];

        // schauen, dass das Chapter auch existiert sonst undefined zurückgeben
        if (!current) {
            return undefined;
        }

        parentId = current.id;
    }

    return current;
}

export function getParentIdAndPosition(
    chapterNumber: string,
    chapters: Chapter[]
): { parentId: number | null; position: number } | undefined {
    const positions = chapterNumber
        .split(".")
        .map(number => Number(number) - 1);

    const position = positions.pop();

    if (position === undefined) {
        return undefined;
    }

    let parentId: number | null = null;

    for (const parentPosition of positions) {
        const siblings = chapters
            .filter(chapter => chapter.parentId === parentId)
            .sort((a, b) => a.position - b.position);

        const parent = siblings[parentPosition];

        if (!parent) {
            return undefined;
        }

        parentId = parent.id;
    }

    return {
        parentId,
        position,
    };
}

export function getChapter(chapterId: number, chapters: Chapter[]): Chapter {
    const chapter = chapters.find((c) => c.id === chapterId);

    if(!chapter) {
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
