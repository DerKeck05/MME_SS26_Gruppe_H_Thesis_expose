-- Ein Professor darf mehrere FAQ-Einträge besitzen
DROP INDEX IF EXISTS "Faq_supervisorId_key";

-- Neue Felder zunächst ohne NOT NULL hinzufügen
ALTER TABLE "Faq"
ADD COLUMN "question" TEXT,
ADD COLUMN "answer" TEXT;

-- Falls jemand schon alte FAQ-Daten hat:
-- content wird als Antwort übernommen
UPDATE "Faq"
SET
    "question" = 'Bestehender FAQ-Eintrag',
    "answer" = "content";

-- Danach Pflichtfelder daraus machen
ALTER TABLE "Faq"
ALTER COLUMN "question" SET NOT NULL,
ALTER COLUMN "answer" SET NOT NULL;

-- Altes Feld entfernen
ALTER TABLE "Faq"
DROP COLUMN "content";