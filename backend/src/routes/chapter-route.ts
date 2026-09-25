import { Router } from "express";
import * as chapterService from "../services/chapter-service.js";
import {
    createChapterSchema,
    updateChapterSchema
} from "../utils/chapter-schema.js";

const router = Router();

router.get("/thesis/:thesisId", async (req, res) => {
    const thesisId = Number(req.params.thesisId);

    if (Number.isNaN(thesisId)) {
        res.status(400).json({
            error: "Invalid thesis ID"
        });
        return;
    }

    const chapters = await chapterService.getChaptersByThesisId(thesisId);

    console.log(`Router sent ${chapters.length} chapters`);

    res.json(chapters);
});

router.post("/thesis/:thesisId", async (req, res) => {
    const thesisId = Number(req.params.thesisId);

    if (Number.isNaN(thesisId)) {
        res.status(400).json({
            error: "Invalid thesis ID"
        });
        return;
    }

    const result = createChapterSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid chapter",
            details: result.error.issues
        });
        return;
    }

    const { title, parentId, position } = result.data;

    const chapter = await chapterService.createChapter(
        thesisId,
        {
            title,
            parentId: parentId ?? null,
            position
        }
    );

    console.log("Router created Chapter");

    res.status(201).json(chapter);
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).json({
            error: "Invalid chapter ID"
        });
        return;
    }

    const result = updateChapterSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid chapter",
            details: result.error.issues
        });
        return;
    }

    const { title, parentId, position } = result.data;

    const chapter = await chapterService.updateChapter(
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

    if (Number.isNaN(id)) {
        res.status(400).json({
            error: "Invalid chapter ID"
        });
        return;
    }

    await chapterService.deleteChapter(id);

    console.log("Router deleted Chapter");

    res.status(204).send();
});

export default router;