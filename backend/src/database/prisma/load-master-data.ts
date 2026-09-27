import {prisma} from "../lib/prisma.js";


async function main() {

    console.log("Stammdaten werden geladen...");


    /*
     * Universität
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
     * Lehrstühle / Professuren
     */
    const chairs = [

        "Algorithmen und Komplexitätstheorie",
        "Algorithmische Bioinformatik",
        "Bildverarbeitung",
        "Computational Human-Centered AI",
        "Computational Immunology",
        "Computational Statistics",
        "Data Engineering",
        "Datensicherheit und Kryptographie",
        "Information Science",
        "Internet Business und Digitale Soziale Medien",
        "Künstliche Intelligenz in der IT-Sicherheit",
        "Maschinelles Lernen",
        "Maschinelles Lernen insb. Uncertainty Quantification",
        "Medieninformatik",
        "Mensch-Maschine-Interaktion",
        "Nachvollziehbare Künstliche Intelligenz in der Betrieblichen Wertschöpfung",
        "Programmierung und Software Engineering",
        "Prozessbasierte Informationssysteme",
        "Statistische Bioinformatik",
        "Technische Informatik",
        "Theoretische Informatik",
        "Wirtschaftsinformatik 1",
        "Wirtschaftsinformatik 2",
        "Wirtschaftsinformatik 3",
        "Wirtschaftsinformatik 4"
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
     */
    const courses = [

        "Allgemeine und Vergleichende Medienwissenschaft M.A.",

        "Computational Science M.Sc.",

        "Computer Science M.Sc.",

        "Data Science B.Sc.",

        "Data Science M.Sc.",

        "Digital Business B.Sc.",

        "Digital Business M.Sc.",

        "Digital Humanities M.A.",

        "Digital Law LL.B.",

        "Human-Centred AI M.Sc.",

        "Informatik B.Sc.",

        "Informationswissenschaft B.A.",

        "Legal Tech LL.M.",

        "Media Informatics M.Sc.",

        "Medieninformatik B.A.",

        "Medienwissenschaft B.A.",

        "Wirtschaftsinformatik B.Sc.",

        "Wirtschaftsinformatik M.Sc."
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
     * Zuordnung:
     * Lehrstuhl -> Studiengänge
     *
     * Diese Liste können wir später
     * Stück für Stück erweitern.
     */
    const chairCourseMappings: Record<string, string[]> = {

        "Medieninformatik": [
            "Medieninformatik B.A.",
            "Media Informatics M.Sc."
        ],


        "Mensch-Maschine-Interaktion": [
            "Medieninformatik B.A.",
            "Media Informatics M.Sc.",
            "Human-Centred AI M.Sc."
        ],


        "Information Science": [
            "Informationswissenschaft B.A.",
            "Human-Centred AI M.Sc."
        ],


        "Computational Human-Centered AI": [
            "Human-Centred AI M.Sc."
        ],


        "Maschinelles Lernen insb. Uncertainty Quantification": [
            "Informatik B.Sc.",
            "Computer Science M.Sc.",
            "Data Science B.Sc.",
            "Data Science M.Sc.",
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ],


        "Wirtschaftsinformatik 1": [
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ],


        "Wirtschaftsinformatik 2": [
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ],


        "Wirtschaftsinformatik 3": [
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ],


        "Wirtschaftsinformatik 4": [
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ],


        "Internet Business und Digitale Soziale Medien": [
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ],


        "Prozessbasierte Informationssysteme": [
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ],


        "Algorithmen und Komplexitätstheorie": [
            "Informatik B.Sc.",
            "Computer Science M.Sc."
        ],


        "Data Engineering": [
            "Informatik B.Sc.",
            "Computer Science M.Sc.",
            "Data Science B.Sc.",
            "Data Science M.Sc."
        ],


        "Datensicherheit und Kryptographie": [
            "Informatik B.Sc.",
            "Computer Science M.Sc."
        ],


        "Programmierung und Software Engineering": [
            "Informatik B.Sc.",
            "Computer Science M.Sc."
        ],


        "Technische Informatik": [
            "Informatik B.Sc.",
            "Computer Science M.Sc."
        ],


        "Theoretische Informatik": [
            "Informatik B.Sc.",
            "Computer Science M.Sc."
        ],


        "Maschinelles Lernen": [
            "Informatik B.Sc.",
            "Computer Science M.Sc.",
            "Data Science B.Sc.",
            "Data Science M.Sc.",
            "Human-Centred AI M.Sc."
        ],


        "Computational Statistics": [
            "Data Science B.Sc.",
            "Data Science M.Sc."
        ]
    };


    /*
     * Verbindungen speichern
     */
    for (
        const [chairName, courseNames]
        of Object.entries(chairCourseMappings)
    ) {

        const chair = await prisma.chair.findUnique({

            where: {
                name_universityId: {
                    name: chairName,
                    universityId: university.id
                }
            }
        });


        if (!chair) {

            console.log(
                "Lehrstuhl nicht gefunden:",
                chairName
            );

            continue;
        }


        const matchingCourses =
            await prisma.course.findMany({

                where: {
                    universityId: university.id,

                    name: {
                        in: courseNames
                    }
                }
            });


        await prisma.chair.update({

            where: {
                id: chair.id
            },

            data: {

                courses: {

                    /*
                     * set statt connect:
                     *
                     * Dadurch entspricht die DB nach
                     * jedem Lauf exakt dieser Liste.
                     */
                    set: matchingCourses.map(
                        (course) => ({
                            id: course.id
                        })
                    )
                }
            }
        });


        console.log(
            chairName,
            "->",
            matchingCourses.length,
            "Studiengänge"
        );
    }


    /*
     * Kontrolle
     */
    const savedChairs =
        await prisma.chair.findMany({

            where: {
                universityId: university.id
            },

            include: {
                courses: {
                    orderBy: {
                        name: "asc"
                    }
                }
            },

            orderBy: {
                name: "asc"
            }
        });


    console.log("");
    console.log("Zuordnungen:");
    console.log("");


    for (const chair of savedChairs) {

        if (chair.courses.length == 0) {
            continue;
        }


        console.log(
            chair.name
        );


        for (const course of chair.courses) {

            console.log(
                "   ->",
                course.name
            );
        }
    }


    console.log("");
    console.log(
        "Stammdaten erfolgreich geladen."
    );
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