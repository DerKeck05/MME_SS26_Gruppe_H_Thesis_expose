# Generelles

Fast alle Dateien, die da sind, sind durch irgendwelche Commands generiert worden, wir müssen nicht verstehen, was die genau machen oder aussagen.
Am besten einfach in Ruhe lassen, solang nicht irgendwas im Code meckert wegen irgendwelchen Einstellungen, da sind meistens dann die package.json oder tscondig.json schuld.

**Wichtig**: Die node_modules nicht auf Github pushen. (Sind aber auch durch die gitignore geschützt)

# Backend

Wir nutzen jetzt Prisma für die Datenbank, da kann man die Tabellen und abfragen nen bisschen schneller und einfacher definieren (findest du in der schema.prisma Datei). Die Datenbank ist in der .env Datei definiert.

**Wichtig**: die .env Dateien nicht auf Github pushen, die werden aber auch automatisch von der .gitignore ignoriert.

Die Datenbank Tabellen sind schon mal alle erstellt, die Datenbank selber aber noch nicht also das Docker-Ding. 



# Frontend