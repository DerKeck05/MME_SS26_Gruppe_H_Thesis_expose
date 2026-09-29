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
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).json({
            error: "Invalid FAQ ID"
        });
        return;
    }

    const { question, answer } = req.body;

    const faq = await faqRepo.updateFaq(
        id,
        question,
        answer
    );

    res.status(200).json(faq);
});
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        res.status(400).json({
            error: "Invalid FAQ ID"
        });
        return;
    }

    await faqRepo.deleteFaq(id);

    res.status(204).send();
});
export default router;