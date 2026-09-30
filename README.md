# MME_SS26_Gruppe_H_Thesis_expose

## Installationsanweisung

Zum Starten der Anwendung einmal
> `docker compose up`

im Terminal im Hauptverzeichnis eingeben, um das Projekt zu starten.
Dadurch werden automatisch gleichzeitig die Datenbank, das Backend und das Frontend gestartet.

Im Terminal wird einem dann eine localhost-URL gegeben, die man dann einfach wie einen Link anklicken kann und dadurch lässt sich die Anwendung im Standard-Browser nutzen.
Alternativ kann man auch direkt im Browser Suchfeld 
>localhost:5173

eingeben. Das Frontend wird immer standardmäßig auf diesem Port laufen.
Dieses wird aber auch nur solange erreichbar sein, wie die Docker Container up sind, sobald diese nicht mehr online sind, wird auch der localhost nicht mehr erreichbar sein.

---
## Beschreibung der Features

#### LOGIN/REGSTRIERUNG PROFESSOR/STUDENT

Zu Beginn kann man sich einen Account anlegen, und dabei auswählen, ob man entweder Student ist oder Professor ist.  
Dann kann man Namen, E-Mail und Passwort festlegen, und dann sich noch zusatzinformationen wie Studiengang und Uni zuweisen, als Professor additional auch den Lehrstuhl.  
Dadurch wird automatisch der Account erstellt und man wird auf den Login Screen zurückgebracht, wo man sich dann einloggen kann und auf die richtige Page automatisch gebracht wird.  
Studenten, die noch keine Thesis von einem Professor zugewiesen bekommen haben, werden auf einen Wartescreen gesetzt, in dem sie ihre Account Infos bearbeiten können.  
Ansonsten werden jeweils professoren und Studenten an ihr Dashboard weitergeleitet.

#### GLIEDERUNG

Der Student kann sich im Tab **Gliederung** seine eigene Gliederung für seine Thesis erstellen. Diese funktioniert mit Unterpunkten und einrückungen. Die Nummerierung der Kapitel und Unterkapitel wird dabei automatisch vom System übernommen.  
Die Kapitel lassen sich auch bearbeiten und löschen und es lassen sich Feedback-Kommentare vom Betreuer zu jedem Kapitel anzeigen (siehe Feedback).  
Wenn man möchte, kann man außerdem die Gliederung sich als PDF exportieren.

#### KALENDER

Der Student kann sich im Tab **Kalender** neue Kalender Events erstellen, die entweder Start- und Enddatum haben, mit Uhrzeit oder die ganztägig sein können.  
Diese kann er auch bearbeiten und löschen, kann sich die Beschreibung durchlesen und sie werden auf der Startseite auch als "Als Nächstes" angezeigt.  
Außerdem wird auch der Abgabe Termin der Thesis angezeigt.

#### THESIS

Der Professor kann in seinem Dashboard Thesen erstellen und diesen einen Titel geben und sie dann einem Studenten zuweisen. Erst dann kann der Student auch sein Dashboard erreichen.

#### FEEDBACK

Der Professor kann die Gliederung des Studenten einsehen und sich anschauen und zu jedem Kapitel Kommentare hinterlassen. Diese werden dann dem Studenten auch angezeigtm damit er das Feedback erhält.

#### FAQ

Der Professor kann eine FAQ Seite anlegen, in dem er Richtlinien für das Schreiben einer Arbeit bei ihm reinschreiben kann.  
Diese Seite kann dann auch von den Studenten eingesehen werden in ihrem Dashboard.

---
## Guide wie die Features Testbar sind

Alle Features lassen sich einfach austesten, in dem man einfach immer den Anweisungen im UI folgt. Dabei ist das UI relativ selbsterklärend aufgebaut.
Einzig, dass man Kapitel in der Gliederung auch durch Doppelklick bearbeiten kann, ist nicht direkt intuitiv, ansonsten wurde darauf geachtet, dass das UI sehr intuitiv bedienbar ist.   
Außerdem gibt es hier ein aufgezeichnetes Showcase:

> URL zu Screencast: https://youtu.be/T0r4DKWTkRA

---
## Dokumentation Zuständigkeiten

#### JAN-PHILIPP KÜCK

- Studenten-Dashboard
- Kalender Feature
- Gliederungs-Feature
- PDF Export Feature
- Datenbank Struktur und Repos
- Projekt Struktur

#### Lucas Herrigel

- Login/SignIn Logik und UI
- Professor Dashboard
- FAQ-Feature
- Feedback-Feature
- Finales UI Design Theme

---
## Zusätzliche Projektinformationen

#### BENUTZTE PACKAGES

**Frontend:**
- Mantine
- Tailwindcss
- Lucide-React
- React (-dom, -router-dom)
- React-Big-Calendar
- Vite

**Backend:**
- Prisma
- BCrypt
- Cors
- Express
- PDFkit
- Zod
- Date-Fns-tz

**Ganzes Projekt**
- Prettier
- Docker 

#### Weiteres

Datenbank ist eine Postgres SQL Datenbank, die über Prisma verwaltet wird. Das ganze Projekt läuft in Docker Containern, die alle gleichzeitig mit Docker compose gestartet werden können.  
Das Backend nutzt node.js und Express.js, das Frontend React mit Vite.
