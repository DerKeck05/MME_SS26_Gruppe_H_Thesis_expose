import { prisma } from "./lib/prisma";

async function main() {
    // Example: Fetch all records from a table
    // Replace 'user' with your actual model name
    const allSupervisors = await prisma.supervisor.findMany();
    console.log("All supervisors:", JSON.stringify(allSupervisors, null, 2));
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });