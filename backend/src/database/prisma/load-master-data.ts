import { prisma } from "../lib/prisma.js";

import {
    universityName,
    chairs,
    courses,
    chairCourseMappings
} from "./master_data.js";


/*
 This function makes sure that the university exists in the database.
 I use Prisma's upsert function here.
 Upsert means: if the university already exists, Prisma uses the existing entry
 it also means if the university does not exist yet, Prisma creates a new entry
 This is useful because the script can be executed multiple times
 without creating the same university again and again.
 The function returns the university because I need its ID later
 to connect chairs and courses to the correct university.
 */
async function loadUniversity() {

    const university =
        await prisma.university.upsert({
            /* The name has to be unique in the database,
              so Prisma can identify the correct university.
             */
            where: {
                name: universityName
            },

            /*
             I do not want to change anything if the university
             already exists. Because of that, the update object stays empty.
             */
            update: {},

            /*
             If the university cannot be found,
             Prisma creates a new university with this name.
             */
            create: {
                name: universityName
            }
        });


    /*
     This output is mainly useful for debugging
     and for checking the Docker startup.
     */
    console.log(
        "Universität:",
        university.name
    );


    /*
     I return the complete university object.
     Later I mainly use university.id,
     because chairs and courses need to know
     which university they belong to.
     */
    return university;
}


/*
 This function creates all the chairs that are defined
 inside the chairs array from master_data.ts.
 The function receives the university ID.
 The type ": number" means that universityId
 has to be a number.
 I use a for...of loop to go through every chair
 one after another.
 For every chair I use upsert again,
 so the chair is not created twice.
 */
async function loadChairs(
    universityId: number
) {

    /*
     chairName contains one value from the chairs array
     during every loop iteration.
    */
    for (const chairName of chairs) {

        await prisma.chair.upsert({

            /*
             A chair is identified by two values:
             its name
             the university it belongs to
             This is necessary because theoretically
             different universities could have chairs
             with the same name.
             */
            where: {
                name_universityId: {
                    name: chairName,
                    universityId: universityId
                }
            },

            /*
             If the chair already exists,
             I do not want to change anything.
             */
            update: {},

            /*
             If the chair does not exist yet,
             it gets created here.
             The universityId connects the chair
             to the correct university.
             */
            create: {
                name: chairName,
                universityId: universityId
            }
        });
    }


    /*
     After the loop has finished,
     the number of loaded chairs is printed.
     helpful for Debug
     */
    console.log(
        chairs.length,
        "Lehrstühle geladen."
    );
}


/*
 This function works almost the same way as loadChairs.
 It goes through every course from the courses array
 and makes sure that the course exists in the database.
 Every course is connected to the university
 by using the universityId.
 */
async function loadCourses(
    universityId: number
) {

    /*
     courseName contains one course name
     during every loop iteration.
     */
    for (const courseName of courses) {

        await prisma.course.upsert({
            /*
             Prisma searches for a course
             with the same name at the same university.
             */
            where: {
                name_universityId: {
                    name: courseName,
                    universityId: universityId
                }
            },
            /*
             Existing courses are not changed.
             */
            update: {},
            /*
             If the course does not exist,
             it gets created and connected
             to the university.
             */
            create: {
                name: courseName,
                universityId: universityId
            }
        });
    }


    /*
     Shows how many courses were processed.
     */
    console.log(
        courses.length,
        "Studiengänge geladen."
    );
}


/*
 This function creates the connection between chairs and courses.
 The actual mapping is stored in master_data.ts.
 I keep the mapping in a separate file because it is data
 and not the actual database logic.
 */
async function connectChairsAndCourses(
    universityId: number
) {

    /*
     chairCourseMappings is an array of objects.
     During every loop iteration,
     mapping contains one of these objects.
     */
    for (const mapping of chairCourseMappings) {


        /*
         First I need the real chair object from the database.
         The mapping only contains the chair name.
         But for the database connection I need the chair ID.
         */
        const chair =
            await prisma.chair.findUnique({

                where: {
                    name_universityId: {
                        name: mapping.chairName,
                        universityId: universityId
                    }
                }
            });


        /*
         If the chair cannot be found, there is no reason to continue with this mapping.
         The script prints a message and continues with the next chair.
         continue means: stop the current loop iteration and continue with the next one.
         */
        if (!chair) {

            console.log(
                "Lehrstuhl nicht gefunden:",
                mapping.chairName
            );

            continue;
        }


        /*
         Now I search for all courses
         that are listed inside mapping.courseNames 
         Prisma then returns the matching course objects
         from the database.
         */
        const matchingCourses =
            await prisma.course.findMany({

                where: {

                    /*
                     Only courses from the current university
                     should be used.
                     */
                    universityId: universityId,

                    /*
                      "in" means
                     the course name has to be contained
                     inside the courseNames array.
                     */
                    name: {
                        in: mapping.courseNames
                    }
                }
            });


        /*
         Now I update the chair
        and connect the matching courses to it.
         */
        await prisma.chair.update({

            /*
             The chair is updated by using its database ID.
             */
            where: {
                id: chair.id
            },

            /*
             data contains all values
             that should be changed.
             */
            data: {

                /*
                 courses is the relation
                 between chairs and courses.
                 */
                courses: {

                    /*
                     I use set instead of "connect".
                     connect would only add more relations.
                     set replaces the current relations
                     with exactly the courses from the mapping
                     This means that after every execution
                     the database contains exactly the relations
                     that are defined in master_data.ts
                     */
                    set: matchingCourses.map(

                        /*
                          matchingCourses contains complete course objects.
                          For the relation Prisma only needs the ID.
                         */
                        course => ({
                            id: course.id
                        })
                    )
                }
            }
        });


        /*
         Prints the result of the current mapping
         */
        console.log(
            mapping.chairName,
            "->",
            matchingCourses.length,
            "Studiengänge"
        );
    }
}


/*
 This function controls the order
 in which the master data is loaded.
 The order is important:
 1. university
 2. chairs
 3. courses
 4. connections between chairs and courses
 The university has to exist first,
 because chairs and courses need its ID.
 Chairs and courses have to exist
 before they can be connected.
 we done thios decision because we were afraid of people Who write the same university diffent 
 */
async function main() {

    console.log(
        "Stammdaten werden geladen..."
    );


    /*
     First the university is loaded.
     The returned object is stored in the variable university.
     */
    const university =
        await loadUniversity();


    /*
     After that all chairs are loaded.
     I pass the university ID
     so every chair belongs to the correct university.
     */
    await loadChairs(
        university.id
    );


    /*
     Then all courses are loaded.
     */
    await loadCourses(
        university.id
    );


    /*
     Finally the existing chairs and courses
     are connected with each other.
     */
    await connectChairsAndCourses(
        university.id
    );


    console.log(
        "Stammdaten erfolgreich geladen."
    );
}

main()

    /*
    If an error happens anywhere inside main(),
    the promise ends inside this catch block.
    The error is printed and the process is stopped with error code 1.
     */
    .catch((error) => {

        console.error(
            "Fehler beim Laden der Stammdaten:"
        );

        console.error(error);

        /*
         Exit code 1 means that the program
         was stopped because of an error
         This is also useful for Docker,
         because Docker can recognize
         that the startup was not successful.
         */
        process.exit(1);
    })

    /*
     finally is executed whether the code
     was successful or failed.
     The Prisma connection is closed here
     so the program can finish cleanly.
     */
    .finally(async () => {

        await prisma.$disconnect();

    });