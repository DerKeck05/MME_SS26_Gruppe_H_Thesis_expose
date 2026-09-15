import { Router } from "express";
import * as calendarRepo from "../database/repos/calender-repo.js";
import {createCalendarEntrySchema, updateCalendarEntrySchema} from "../utils/calendar-schema.js";

const router = Router();

router.get("/thesis/:id", async (req, res) => {
    const thesisId = Number(req.params.id);
    const events = await calendarRepo.getCalendarEntriesByThesisId(thesisId);

    res.json(events);
});

router.get("/:id", async (req, res) => {
    const entryId = Number(req.params.id);
    const event = await calendarRepo.getCalendarEntryById(entryId);

    res.json(event);
});

router.post("/thesis/:id", async (req, res) => {
    const thesisId = Number(req.params.id);

    const result = createCalendarEntrySchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid calendar entry",
            details: result.error.issues
        });
        return;
    }

    const { title, description, startDate, endDate } = result.data;


    const event = await calendarRepo.createCalendarEntry(
        title,
        startDate,
        endDate,
        thesisId,
        description
    );

    res.status(201).json(event);
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const result = updateCalendarEntrySchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid calendar entry",
            details: result.error.issues
        });
        return;
    }

    const event = await calendarRepo.updateCalendarEntry(
        id,
        result.data
    );

    res.json(event);
});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const result = await calendarRepo.deleteCalendarEntry(id);

    res.status(204).send();
});

export default router;
