import {createSupervisor} from "../repos/supervisor-repo.js";
import {createThesis} from "../repos/thesis-repo.js";

async function main() {
    console.log("Dummy data script started");

    try {
        console.log("Creating supervisor...");

        const supervisor = await createSupervisor(
            "Prof. Dr. Max Mustermann",
            "max.mustermann@uni-regensburg.de",
            "dummy-password",
            "Lehrstuhl für Medieninformatik"
        );

        console.log("Supervisor created:");
        console.log(supervisor);

        console.log("Creating thesis...");

        const thesis = await createThesis(
            1,
            supervisor.id,
            "Entwicklung eines Thesis-Exposé-Systems",
            "Dummy Thesis für die Entwicklung",
            new Date("2026-09-01"),
            new Date("2026-12-31")
        );

        console.log("Thesis created:");
        console.log(thesis);

    } catch (error) {
        console.error("ERROR WHILE CREATING DUMMY DATA:");
        console.error(error);
        throw error;
    }
}

void main();