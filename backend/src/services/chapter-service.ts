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
    // Get all chapters of the thesis
    const chapters = await chapterRepo.getChaptersByThesisId(thesisId);

    // Find all chapters with the same parent
    const siblings = chapters.filter(
        chapter =>
            chapter.parentId === data.parentId
    );

    // Make sure the new position is within the valid range
    const position = Math.max(
        0,
        Math.min(data.position, siblings.length)
    );

    // Find all siblings that need to be moved one position back
    const siblingsToShift = siblings.filter(
        chapter =>
            chapter.position >= position
    );

    // Shift the affected siblings to make room for the new chapter
    for (const sibling of siblingsToShift) {
        await chapterRepo.updateChapter(sibling.id, {
            position: sibling.position + 1
        });
    }

    // Create the new chapter at the calculated position
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
    // Get the chapter that should be updated
    const chapter = await chapterRepo.getChapterById(chapterId);

    // Stop if the chapter does not exist
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    // Check if the parent of the chapter has changed
    const parentChanged =
        data.parentId !== undefined &&
        data.parentId !== chapter.parentId;

    // Handle the chapter if its parent has changed
    if (parentChanged) {

        const parentId = data.parentId;

        // Make sure the new parent ID is defined
        if (parentId === undefined) {
            throw new Error("Parent ID is required when changing parent");
        }

        // Get all chapters of the thesis
        const chapters = await chapterRepo.getChaptersByThesisId(
            chapter.thesisId
        );


        // Determine the new position, if no position is provided, the chapter is added at the end of the new level.
        let newPosition = data.position;

        if (newPosition === undefined) {
            const newSiblings = chapters.filter(
                other =>
                    other.parentId === data.parentId &&
                    other.id !== chapter.id
            );

            newPosition = newSiblings.length;
        }

        // Clean up the old level, All chapters after the moved chapter move one position forward in the list.
        const oldSiblings = chapters.filter(
            other =>
                other.parentId === chapter.parentId &&
                other.id !== chapter.id &&
                other.position > chapter.position
        );

        // Move the affected siblings one position forward
        for (const sibling of oldSiblings) {
            await chapterRepo.updateChapter(sibling.id, {
                position: sibling.position - 1
            });
        }

        // Prepare the new level.All chapters from the new position onward are moved one position back to make room.
        const newSiblings = chapters.filter(
            other =>
                other.parentId === data.parentId &&
                other.id !== chapter.id &&
                other.position >= newPosition!
        );

        // Shift the affected siblings to make room for the chapter
        for (const sibling of newSiblings) {
            await chapterRepo.updateChapter(sibling.id, {
                position: sibling.position + 1
            });
        }

        // Move the chapter to the new level and position
        return chapterRepo.updateChapter(chapterId, {
            ...(data.title !== undefined && {
                title: data.title
            }),
            parentId: parentId,
            position: newPosition
        });
    }

    // Update the chapter without changing its position
    if (
        data.position === undefined ||
        data.position === chapter.position
    ) {
        return chapterRepo.updateChapter(chapterId, data);
    }

    // Get all chapters of the thesis
    const chapters = await chapterRepo.getChaptersByThesisId(
        chapter.thesisId
    );

    // Find all siblings of the chapter
    const siblings = chapters.filter(
        other =>
            other.parentId === chapter.parentId &&
            other.id !== chapter.id
    );

    // Move the chapter up in the list
    if (data.position < chapter.position) {
        for (const sibling of siblings) {
            if (
                sibling.position >= data.position &&
                sibling.position < chapter.position
            ) {
                // Move affected siblings one position down
                await chapterRepo.updateChapter(sibling.id, {
                    position: sibling.position + 1
                });
            }
        }
    }

    // Move the chapter down in the list
    if (data.position > chapter.position) {
        for (const sibling of siblings) {
            if (
                sibling.position > chapter.position &&
                sibling.position <= data.position
            ) {
                // Move affected siblings one position up
                await chapterRepo.updateChapter(sibling.id, {
                    position: sibling.position - 1
                });
            }
        }
    }

    // Update the chapter with the new data
    return chapterRepo.updateChapter(chapterId, data);
}

export async function deleteChapter(chapterId: number) {
    // Get the chapter that should be deleted
    const chapter = await chapterRepo.getChapterById(chapterId);

    // Stop if the chapter does not exist
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    // Get all chapters of the thesis
    const chapters = await chapterRepo.getChaptersByThesisId(
        chapter.thesisId
    );

    // Find all siblings that come after the deleted chapter
    const siblingsAfter = chapters.filter(
        other =>
            other.parentId === chapter.parentId &&
            other.position > chapter.position
    );

    // Move the following siblings one position forward
    for (const sibling of siblingsAfter) {
        await chapterRepo.updateChapter(sibling.id, {
            position: sibling.position - 1
        });
    }

    // Delete the chapter
    return chapterRepo.deleteChapter(chapterId);
}
