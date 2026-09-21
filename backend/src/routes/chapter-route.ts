import {Router} from "express";
import * as chapterRepo from "../database/repos/chapter-repo.js";
import {createChapterSchema, updateChapterSchema} from "../utils/chapter-schema.js";

const router = Router();

router.get("/thesis/:id", async (req, res) => {
    const thesisId = Number(req.params.id);
    const chapters = await chapterRepo.getChaptersByThesisId(thesisId);

    console.log(`Router sent ${chapters.length} chapters`);

    res.json(chapters);
});

router.post("/thesis/:id", async (req, res) => {
    const thesisId = Number(req.params.id);

    const result = createChapterSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid chapter",
            details: result.error.issues
        });
        return;
    }

    const { title, parentId, position } = result.data;

    const chapter = await chapterRepo.createChapter({
        title,
        parentId: parentId ?? null,
        position,
        thesisId
    });

    console.log("Router created Chapter");

    res.status(201).json(chapter);
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const result = updateChapterSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid chapter",
            details: result.error.issues
        });
        return;
    }

    const { title, parentId, position } = result.data;

    const chapter = await chapterRepo.updateChapter(
        id,
        {
            ...(title !== undefined && { title }),
            ...(parentId !== undefined && { parentId }),
            ...(position !== undefined && { position })
        }
    );

    res.status(200).json(chapter);
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    await chapterRepo.deleteChapter(id);

    console.log("Router deleted Chapter");
    res.status(204).send();
});

export default router;