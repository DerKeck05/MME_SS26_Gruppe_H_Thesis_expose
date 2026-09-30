import PDFDocument from "pdfkit";
import * as chapterService from "./chapter-service.js";
import {getThesisForPDF} from "../database/repos/chapter-repo.js";

type PdfChapter = {
    title: string;
    number: string;
    level: number;
    parentId: number | null;
    position: number;
};

function buildChapterList(chapters: {
    id: number;
    title: string;
    parentId: number | null;
    position: number;
}[]): PdfChapter[] {
    const result: PdfChapter[] = [];

    function visit(
        parentId: number | null,
        prefix: number[]
    ) {
        const children = chapters
            .filter(chapter => chapter.parentId === parentId)
            .sort((a, b) => a.position - b.position);

        children.forEach((chapter, index) => {
            const numberParts = [...prefix, index + 1];

            result.push({
                title: chapter.title,
                number: numberParts.join("."),
                level: numberParts.length - 1,
                parentId: chapter.parentId,
                position: chapter.position
            });

            visit(chapter.id, numberParts);
        });
    }

    visit(null, []);

    return result;
}

export async function createOutlinePdf(thesisId: number) {
    const chapters = await chapterService.getChaptersByThesisId(thesisId);
    const pdfChapters = buildChapterList(chapters);

    const thesis = await getThesisForPDF(thesisId);

    if(thesis === null) throw new Error("Konnte die Thesis nicht laden");

    const doc = new PDFDocument({
        size: "A4",
        margin: 50
    });

    doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .text(`${thesis.title}`);

    doc.moveDown();

    doc
        .font("Helvetica")
        .fontSize(14)
        .text(`Name: ${thesis.student.name}`, {lineGap: 4})
        .text(`Betreuer: ${thesis.supervisor.name}`, {lineGap: 4})
        .text("Universität Regensburg", {lineGap: 4});

    doc.moveDown();

    doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

    doc.moveDown();

    doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("Gliederung");

    doc.moveDown();

    for (const chapter of pdfChapters) {
        doc
            .font(chapter.level === 0 ? "Helvetica-Bold" : "Helvetica")
            .fontSize(chapter.level <= 1 ? 18 : 14)
            .text(
                `${chapter.number} ${chapter.title}`,
                {
                    indent: chapter.level * 20
                }
            );
    }

    return doc;
}