# Anforderungen

> Ein Tool, das Studierende und Betreuer während der ersten Phase einer Abschlussarbeit zusammenbringt.
- Interaktiver Editor für Gliederungen: Ein Tool zum Erstellen von hierarchischen Kapitalstrukturen mit Status-Tracking.
- Interaktiver Editor von Zeitplänen: Ein Tool zum Erstellen von Zeitplänen. Übersichtliche visuelle Darstellung.
- Feedback-Pins: Betreuer können Kommentare direkt an spezifische Gliederungspunkte „pinnen“ (ähnlich wie in Figma/Word).
- Betreuer Dashboard: Betreuer haben Überblick über ihre Studierende, können neue Abschlussarbeiten anlegen und Studierende
hinzufügen.
- Zentrale FAQ-Knowledge-Base: Ein vom Betreuer verwalteter Bereich für Richtlinien.
- Mögliche Erweiterungen: Export der gesamten Gliederung und Feedback-Historie als strukturiertes JSON oder PDF.

---
# Generelles

Fast alle Dateien, die da sind, sind durch irgendwelche Commands generiert worden, wir müssen nicht verstehen, was die genau machen oder aussagen.
Am besten einfach in Ruhe lassen, solang nicht irgendwas im Code meckert wegen irgendwelchen Einstellungen, da sind meistens dann die package.json oder tscondig.json schuld.

**Wichtig**: Die node_modules nicht auf Github pushen. (Sind aber auch durch die gitignore geschützt)

---
# Backend

Wir nutzen jetzt Prisma für die Datenbank, da kann man die Tabellen und abfragen nen bisschen schneller und einfacher definieren (findest du in der schema.prisma Datei). Die Datenbank ist in der .env Datei definiert.

**Wichtig**: die .env Dateien nicht auf Github pushen, die werden aber auch automatisch von der .gitignore ignoriert.

Die Datenbank Tabellen sind schon mal alle erstellt, die Datenbank selber aber noch nicht also das Docker-Ding. 

Außerdem nutzen wir jetzt bcrypt für das Passwort hashing, also es werden nicht direkt die Passwörter in die SQL Tabelle geschrieben, sondern nur ihre Hashes und die werden dann von dem package abgeglichen, Code dafür ist in der password.ts.

---
# Frontend

---
# Notizen

- Wenn Supervisor Account gelöscht → alle Studenten einschränken und Arbeiten blockieren/Nicht bearbeitbar machen
- Generell einen View-Only Modus für die Arbeiten einrichten
- Modi einrichten bei der Studi-View, in der man nichts machen kann, außer den Account zu bearbeiten, bis der Prof ihn sich zugewiesen hat