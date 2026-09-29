import { Router } from "express";
import * as faqRepo from "../database/repos/faq-repo.js";

const router = Router();
router.get("/supervisor/:supervisorId", async (req, res) => {
    const supervisorId = Number(req.params.supervisorId);

    if (Number.isNaN(supervisorId)) {
        res.status(400).json({
            error: "Invalid supervisor ID"
        });
        return;
    }

    const faqs = await faqRepo.getFaqsBySupervisorId(supervisorId);

    res.json(faqs);
});
router.post("/supervisor/:supervisorId", async (req, res) => {
    const supervisorId = Number(req.params.supervisorId);

    if (Number.isNaN(supervisorId)) {
        res.status(400).json({
            error: "Invalid supervisor ID"
        });
        return;
    }

    const { question, answer } = req.body;

    if (!question || !answer) {
        res.status(400).json({
            error: "Question and answer are required"
        });
        return;
    }

    const faq = await faqRepo.createFaq(
        question,
        answer,
        supervisorId
    );

    res.status(201).json(faq);
});
export default router;