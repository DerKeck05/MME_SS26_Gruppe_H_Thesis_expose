import {Router} from "express";
import {getThesisById} from "../database/repos/thesis-repo.js";


const router = Router();

router.get("/:thesisId", async (req, res) => {
    const thesisId = Number(req.params.thesisId);

    if (Number.isNaN(thesisId)) {
        res.status(400).json({
            error: "Ungültige Thesis-ID"
        });
        return;
    }

    try {
        const thesis = await getThesisById(thesisId);

        if (!thesis) {
            res.status(404).json({
                error: "Thesis nicht gefunden"
            });
            return;
        }

        res.status(200).json(thesis);
    } catch (error) {
        console.error("Thesis konnte nicht geladen werden:", error);

        res.status(500).json({
            error: "Thesis konnte nicht geladen werden"
        });
    }
});

export default router;