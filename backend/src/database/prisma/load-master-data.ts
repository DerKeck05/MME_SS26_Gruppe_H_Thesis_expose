import {prisma} from "../lib/prisma.js";


async function main() {

    console.log("Stammdaten werden geladen...");


    /*
     * Universität Regensburg
     */
    const university = await prisma.university.upsert({
        where: {
            name: "Universität Regensburg"
        },

        update: {},

        create: {
            name: "Universität Regensburg"
        }
    });


    console.log(
        "Universität:",
        university.name
    );


    /*
     * Alte Entwicklungsnamen auf die
     * offiziellen Bezeichnungen bringen
     */

    const oldMedieninformatik =
        await prisma.course.findFirst({
            where: {
                universityId: university.id,
                name: "Medieninformatik"
            }
        });


    const newMedieninformatik =
        await prisma.course.findFirst({
            where: {
                universityId: university.id,
                name: "Medieninformatik B.A."
            }
        });


    if (
        oldMedieninformatik &&
        !newMedieninformatik
    ) {

        await prisma.course.update({
            where: {
                id: oldMedieninformatik.id
            },

            data: {
                name: "Medieninformatik B.A."
            }
        });
    }


    const oldMedienwissenschaft =
        await prisma.course.findFirst({
            where: {
                universityId: university.id,
                name: "Medienwissenschaft"
            }
        });


    const newMedienwissenschaft =
        await prisma.course.findFirst({
            where: {
                universityId: university.id,
                name: "Medienwissenschaft B.A."
            }
        });


    if (
        oldMedienwissenschaft &&
        !newMedienwissenschaft
    ) {

        await prisma.course.update({
            where: {
                id: oldMedienwissenschaft.id
            },

            data: {
                name: "Medienwissenschaft B.A."
            }
        });
    }


    /*
     * Lehrstühle / Professuren
     *
     * Quelle:
     * Universität Regensburg
     * Fakultät für Informatik und Data Science
     */

    const chairs = [

        "Algorithmen und Komplexitätstheorie",

        "Data Engineering",

        "Datensicherheit und Kryptographie",

        "Programmierung und Software Engineering",

        "Technische Informatik",

        "Theoretische Informatik",

        "Computational Statistics",

        "Maschinelles Lernen",

        "Information Science",

        "Computational Human-Centered AI",

        "Medieninformatik",

        "Mensch-Maschine-Interaktion",

        "Algorithmische Bioinformatik",

        "Bildverarbeitung",

        "Computational Immunology",

        "Statistische Bioinformatik",

        "Wirtschaftsinformatik 1",

        "Wirtschaftsinformatik 2",

        "Wirtschaftsinformatik 3",

        "Wirtschaftsinformatik 4",

        "Prozessbasierte Informationssysteme",

        "Internet Business und Digitale Soziale Medien",

        "Künstliche Intelligenz in der IT-Sicherheit",

        "Maschinelles Lernen insb. Uncertainty Quantification",

        "Nachvollziehbare Künstliche Intelligenz in der Betrieblichen Wertschöpfung"
    ];


    for (const chairName of chairs) {

        await prisma.chair.upsert({

            where: {
                name_universityId: {
                    name: chairName,
                    universityId: university.id
                }
            },

            update: {},

            create: {
                name: chairName,
                universityId: university.id
            }
        });
    }


    /*
     * Studiengänge
     *
     * Zunächst die informatiknahen Studiengänge
     * der Universität Regensburg.
     */

    const courses = [

        "Informatik B.Sc.",

        "Computer Science M.Sc.",

        "Data Science B.Sc.",

        "Data Science M.Sc.",

        "Informationswissenschaft B.A.",

        "Medieninformatik B.A.",

        "Media Informatics M.Sc.",

        "Digital Humanities M.A.",

        "Human-Centred AI M.Sc.",

        "Wirtschaftsinformatik B.Sc.",

        "Wirtschaftsinformatik M.Sc.",

        "Digital Business B.Sc.",

        "Digital Business M.Sc.",

        "Digital Law LL.B.",

        "Legal Tech LL.M.",

        "Computational Science M.Sc.",

        /*
         * Zusätzlich Medienwissenschaft,
         * weil sie bereits in unserem
         * bisherigen Testbestand enthalten war.
         */

        "Medienwissenschaft B.A.",

        "Allgemeine und Vergleichende Medienwissenschaft M.A."
    ];


    for (const courseName of courses) {

        await prisma.course.upsert({

            where: {
                name_universityId: {
                    name: courseName,
                    universityId: university.id
                }
            },

            update: {},

            create: {
                name: courseName,
                universityId: university.id
            }
        });
    }


    /*
     * Kontrolle
     */

    const savedChairs =
        await prisma.chair.findMany({
            where: {
                universityId: university.id
            },

            orderBy: {
                name: "asc"
            }
        });


    const savedCourses =
        await prisma.course.findMany({
            where: {
                universityId: university.id
            },

            orderBy: {
                name: "asc"
            }
        });


    console.log("");
    console.log(
        "Lehrstühle / Professuren:",
        savedChairs.length
    );

    console.log(
        "Studiengänge:",
        savedCourses.length
    );

    console.log("");
    console.log("Stammdaten erfolgreich geladen.");
}


main()
    .catch((error) => {

        console.error(
            "Fehler beim Laden der Stammdaten:"
        );

        console.error(error);

        process.exit(1);
    })

    .finally(async () => {

        await prisma.$disconnect();

    });