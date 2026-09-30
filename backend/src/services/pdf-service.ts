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

// puts all chapter in correct order and maps them to PDFChapter
function buildChapterList(chapters: {
    id: number;
    title: string;
    parentId: number | null;
    position: number;
}[]): PdfChapter[] {
    const result: PdfChapter[] = [];

    // iterates recursive through the chapters and sorts them
    function traverseChapters(
        parentId: number | null,
        prefix: number[]
    ) {
        // sorts the chapters in position for every sibling
        const children = chapters
            .filter(chapter => chapter.parentId === parentId)
            .sort((a, b) => a.position - b.position);

        // Processes the siblings in the correct order
        children.forEach((chapter, index) => {
            // builds the chapter number
            const numberParts = [...prefix, index + 1];

            // adds the chapter to the List as a PDFChapter
            result.push({
                title: chapter.title,
                number: numberParts.join("."),
                level: numberParts.length - 1,
                parentId: chapter.parentId,
                position: chapter.position
            });

            traverseChapters(chapter.id, numberParts);
        });
    }

    traverseChapters(null, []);

    // Returns the list of PDFChapters with correct chapter number information
    return result;
}

// creates the pdf itself with pdfkit
export async function createOutlinePdf(thesisId: number) {
    // loads the PDFChapters
    const chapters = await chapterService.getChaptersByThesisId(thesisId);
    const pdfChapters = buildChapterList(chapters);

    // loads the thesis as well with additional information for the Header
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

    // builds the PDF Header
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

    // ----

    // Body with Headline
    doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .text("Gliederung");

    doc.moveDown();

    // iterates through chapters and writes them under each other with different font sizes and weights indents
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