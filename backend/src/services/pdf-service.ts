import PDFDocument from "pdfkit";

export function createOutlinePdf() {

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
        .text(`Name: Max Mustermann`)
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

    doc
        .font("Helvetica")
        .fontSize(12)
        .text("1 Einleitung")
        .text("1.1 Problemstellung")
        .text("1.2 Zielsetzung")
        .text("2 Grundlagen")
        .text("2.1 Theoretische Grundlagen")
        .text("2.2 Forschungsstand")
        .text("3 Methodik");

    return doc;
}

