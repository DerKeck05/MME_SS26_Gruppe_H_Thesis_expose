import * as chapterRepo from "../database/repos/chapter-repo.js";

interface CreateChapterData {
    title: string;
    parentId: number | null;
    position: number;
}

interface UpdateChapterData {
    title?: string;
    parentId?: number | null;
    position?: number;
}

export async function getChaptersByThesisId(thesisId: number) {
    return chapterRepo.getChaptersByThesisId(thesisId);
}

export async function createChapter(
    thesisId: number,
    data: CreateChapterData
) {
    const chapters = await chapterRepo.getChaptersByThesisId(thesisId);

    const siblings = chapters.filter(
        chapter =>
            chapter.parentId === data.parentId
    );

    const position = Math.max(
        0,
        Math.min(data.position, siblings.length)
    );

    const siblingsToShift = siblings.filter(
        chapter =>
            chapter.position >= position
    );

    for (const sibling of siblingsToShift) {
        await chapterRepo.updateChapter(sibling.id, {
            position: sibling.position + 1
        });
    }

    return chapterRepo.createChapter({
        title: data.title,
        parentId: data.parentId,
        position,
        thesisId
    });
}

export async function updateChapter(
    chapterId: number,
    data: UpdateChapterData
) {
    const chapter = await chapterRepo.getChapterById(chapterId);

    if (!chapter) {
        throw new Error("Chapter not found");
    }

    // Prüfen, ob sich der Parent verändert.
    const parentChanged =
        data.parentId !== undefined &&
        data.parentId !== chapter.parentId;

    // ParentId wurde geändert
    if (parentChanged) {

        const parentId = data.parentId;

        // Prüfen, ob die parentId vorhanden oder null ist sonst Error
        if( parentId === undefined ) {
            throw new Error("Parent ID is required when changing parent");
        }

        const chapters = await chapterRepo.getChaptersByThesisId(
            chapter.thesisId
        );

        /*
         * Neue Position bestimmen.
         *
         * Wenn keine Position angegeben wurde,
         * kommt das Chapter ans Ende der neuen Ebene.
         */
        let newPosition = data.position;

        if (newPosition === undefined) {
            const newSiblings = chapters.filter(
                other =>
                    other.parentId === data.parentId &&
                    other.id !== chapter.id
            );

            newPosition = newSiblings.length;
        }

        /*
         * Alte Ebene aufräumen
         * Alle Chapters hinter dem verschobenen Chapter
         * rücken eine Position nach vorne.
         */
        const oldSiblings = chapters.filter(
            other =>
                other.parentId === chapter.parentId &&
                other.id !== chapter.id &&
                other.position > chapter.position
        );

        for (const sibling of oldSiblings) {
            await chapterRepo.updateChapter(sibling.id, {
                position: sibling.position - 1
            });
        }

        /*
         * Neue Ebene vorbereiten
         * Alle Chapters ab der neuen Position werden
         * eine Position nach hinten verschoben.
         */
        const newSiblings = chapters.filter(
            other =>
                other.parentId === data.parentId &&
                other.id !== chapter.id &&
                other.position >= newPosition!
        );

        for (const sibling of newSiblings) {
            await chapterRepo.updateChapter(sibling.id, {
                position: sibling.position + 1
            });
        }

        //Chapter in die neue Ebene verschieben.
        return chapterRepo.updateChapter(chapterId, {
            ...(data.title !== undefined && {
                title: data.title
            }),
            parentId: parentId,
            position: newPosition
        });
    }

    // Update ohne Positionsänderung
    if (
        data.position === undefined ||
        data.position === chapter.position
    ) {
        return chapterRepo.updateChapter(chapterId, data);
    }

    // Nur Positionsänderung
    const chapters = await chapterRepo.getChaptersByThesisId(
        chapter.thesisId
    );

    const siblings = chapters.filter(
        other =>
            other.parentId === chapter.parentId &&
            other.id !== chapter.id
    );

    //Chapter wird nach oben verschoben.
    if (data.position < chapter.position) {
        for (const sibling of siblings) {
            if (
                sibling.position >= data.position &&
                sibling.position < chapter.position
            ) {
                await chapterRepo.updateChapter(sibling.id, {
                    position: sibling.position + 1
                });
            }
        }
    }

    // Chapter wird nach unten verschoben.
    if (data.position > chapter.position) {
        for (const sibling of siblings) {
            if (
                sibling.position > chapter.position &&
                sibling.position <= data.position
            ) {
                await chapterRepo.updateChapter(sibling.id, {
                    position: sibling.position - 1
                });
            }
        }
    }

    return chapterRepo.updateChapter(chapterId, data);
}

export async function deleteChapter(chapterId: number) {
    const chapter = await chapterRepo.getChapterById(chapterId);

    if (!chapter) {
        throw new Error("Chapter not found");
    }

    const chapters = await chapterRepo.getChaptersByThesisId(
        chapter.thesisId
    );

    // Alle nachfolgenden Geschwister rücken eine Position nach vorne.
    const siblingsAfter = chapters.filter(
        other =>
            other.parentId === chapter.parentId &&
            other.position > chapter.position
    );

    for (const sibling of siblingsAfter) {
        await chapterRepo.updateChapter(sibling.id, {
            position: sibling.position - 1
        });
    }

    return chapterRepo.deleteChapter(chapterId);
}