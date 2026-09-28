import PDFDocument from "pdfkit";
import * as chapterService from "./chapter-service.js";

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

    const doc = new PDFDocument({
        size: "A4",
        margin: 50
    });

    doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("THESIS EXPOSÉ");

    doc.moveDown();

    doc
        .font("Helvetica")
        .fontSize(12)
        .text("Titel: Meine Bachelorarbeit")
        .text("Name: Max Mustermann")
        .text("Supervisor: Prof. Dr. Beispiel");

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
            .font("Helvetica")
            .fontSize(12)
            .text(`${chapter.number} ${chapter.title}`);
    }

    return doc;
}