import express from "express";
import { getAllUniversities } from "../database/repos/university-repo.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const universities = await getAllUniversities();
    res.json(universities);
});

export default router;
