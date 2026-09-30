import {Router} from "express";

import {
    createFeedbackEntry,
    getFeedbackEntriesByChapterId,
    updateFeedbackEntry,
    deleteFeedbackEntry
} from "../database/repos/feedback-entry-repo.js";

const router = Router();


router.get("/chapter/:chapterId", async (req, res) => {
    const chapterId = Number(req.params.chapterId);

    if (Number.isNaN(chapterId)) {
        res.status(400).json({
            error: "Invalid chapter ID"
        });
        return;
    }

    const feedbackEntries =
        await getFeedbackEntriesByChapterId(chapterId);

    res.json(feedbackEntries);
});


router.post("/chapter/:chapterId", async (req, res) => {
    const chapterId = Number(req.params.chapterId);
    const {content} = req.body;

    if (Number.isNaN(chapterId)) {
        res.status(400).json({
            error: "Invalid chapter ID"
        });
        return;
    }

    if (
        typeof content !== "string" ||
        content.trim() === ""
    ) {
        res.status(400).json({
            error: "Feedback content is required"
        });
        return;
    }

    const feedback =
        await createFeedbackEntry(
            chapterId,
            content.trim()
        );

    res.status(201).json(feedback);
});


router.put("/:id", async (req, res) => {
    const feedbackId = Number(req.params.id);
    const {content} = req.body;

    if (Number.isNaN(feedbackId)) {
        res.status(400).json({
            error: "Invalid feedback ID"
        });
        return;
    }

    if (
        typeof content !== "string" ||
        content.trim() === ""
    ) {
        res.status(400).json({
            error: "Feedback content is required"
        });
        return;
    }

    const feedback =
        await updateFeedbackEntry(
            feedbackId,
            content.trim()
        );

    res.json(feedback);
});


router.delete("/:id", async (req, res) => {
    const feedbackId = Number(req.params.id);

    if (Number.isNaN(feedbackId)) {
        res.status(400).json({
            error: "Invalid feedback ID"
        });
        return;
    }

    await deleteFeedbackEntry(feedbackId);

    res.status(204).send();
});


export default router;