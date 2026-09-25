import {createSupervisor, getSupervisorById} from "../repos/supervisor-repo.js";
import {createThesis, getThesisById} from "../repos/thesis-repo.js";
import {hashPassword} from "../../utils/password.js";

async function main() {
    try {
        const supervisor = await getSupervisorById(1);
        const thesis = await getThesisById(1);

        console.log(supervisor);
        console.log(thesis);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

void main();