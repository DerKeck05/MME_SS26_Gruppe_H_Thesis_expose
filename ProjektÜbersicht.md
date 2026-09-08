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

Fürs Backend nutzen wir Express 

---
# Datenbank

Wir nutzen Prisma für die Datenbank, da kann man die Tabellen und abfragen nen bisschen schneller und einfacher definieren (findest du in der schema.prisma Datei). Der Datenbank-Link ist in der .env Datei definiert. Die Datenbank selber ist über postgres in pgadmin bei mir gehosted.

**Wichtig**: die .env Dateien nicht auf Github pushen, die werden aber auch automatisch von der .gitignore ignoriert.

Die Datenbank Tabellen sind schon mal alle erstellt. 

Konzept ist Folgendes:
> - in schema.prisma sind die Tabellen definiert (heißen models)  
> - Prisma wandelt das automatisch in SQL um und erstellt die Datenbank Tabellen  
> - Die Tabellen kann man sich außerdem mit samt den Daten die enthalten sind mit `npx prisma studio` anschauen  
> - Wenn man was an der DB ändern, muss man danach immer eine Migration erstellen (da müsste ich selber nochmal googeln, wie das geht)  

Außerdem nutzen wir jetzt bcrypt für das Passwort hashing, also es werden nicht direkt die Passwörter in die SQL Tabelle geschrieben, sondern nur ihre Hashes und die werden dann von dem package abgeglichen, Code dafür ist in der password.ts.

---
# Frontend

---

# Docker

> Verpackt Code in Container die auf allen Systemen gleich laufen damit es da keine Probleme gibt

## 2 Hauptkonzepte:

**IMAGES**
- Vorlage in denen alles drinne steht was gebaut wird also
  - Tech-Stack
  - Runtimes
  - Tools & Instruktionen für den Run
⇒ ist basically das Rezept

**CONTAINERS**
- Instanz von einem Image, die auf dem Host läuft
- Container sind isoliert, haben eigene IP, eigenen Speicher, eigenen Prozessbaum
⇒ das fertige Gericht
⇒ man nutzt mehrere Container, um die großen Teile voneinander zu trennen, also einen für Frontend, Backend und DB


## Setup

**Dockerfile**
- definiert wie das Image gebaut wird
- Darin steht das Rezept um den Code und den Server zu bauen und zu starten

**docker-compose.yml**
- definiert wie die Container gebaut werden
- Darin steht das Rezept wie die Container gebaut werden und wie sie miteinander kommunizieren
- Dabei muss man auch Volumes definieren, die helfen, dass die Container untereinander kommunizieren können und die DB nicht gelöscht wird

**.dockerignore**
- ebenfalls notwendig, funktioniert genau wie die gitignore
---
# Notizen

- Wenn Supervisor Account gelöscht → alle Studenten einschränken und Arbeiten blockieren/Nicht bearbeitbar machen
- Generell einen View-Only Modus für die Arbeiten einrichten
- Modi einrichten bei der Studi-View, in der man nichts machen kann, außer den Account zu bearbeiten, bis der Prof ihn sich zugewiesen hat