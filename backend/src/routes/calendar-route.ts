import {Router} from "express";
import * as calendarRepo from "../database/repos/calender-repo.js";
import {createCalendarEntrySchema, updateCalendarEntrySchema} from "../utils/calendar-schema.js";

const router = Router();

router.get("/thesis/:id", async (req, res) => {
    try {
        const thesisId = Number(req.params.id);
        const events = await calendarRepo.getCalendarEntriesByThesisId(thesisId);

        console.log("Router sent Entries");
        res.json(events);
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: "Kalendereinträge konnten nicht geladen werden."
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const entryId = Number(req.params.id);
        const event = await calendarRepo.getCalendarEntryById(entryId);

        console.log("Router sent Entry");
        res.json(event);
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: "Kalendereintrag konnte nicht geladen werden."
        });
    }
});

router.post("/thesis/:id", async (req, res) => {
    try {
        const thesisId = Number(req.params.id);

        const result = createCalendarEntrySchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                error: "Invalid calendar entry",
                details: result.error.issues
            });
            return;
        }

        const {title, description, startDate, endDate} = result.data;


        const event = await calendarRepo.createCalendarEntry(
            title,
            startDate,
            endDate,
            thesisId,
            description
        );

        console.log("Router created Entry");
        res.status(201).json(event);
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: "Kalendereintrag konnte nicht erstellt werden."
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
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

        console.log("Router updated Entry");
        res.json(event);
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: "Kalendereintrag konnte nicht aktualisiert werden."
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await calendarRepo.deleteCalendarEntry(id);

        console.log("Router deleted Entry");
        res.status(204).send();
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: "Kalendereintrag konnte nicht gelöscht werden."
        });
    }
});

export default router;
