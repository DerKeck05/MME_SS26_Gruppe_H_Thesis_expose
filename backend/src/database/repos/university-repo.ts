import { prisma } from "../lib/prisma.js";

export async function getAllUniversities() {
    return prisma.university.findMany({
        orderBy: {
            name: "asc"
        }
    });
}

export async function getCoursesByUniversityId(universityId: number) {
    return prisma.course.findMany({
        where: {
            universityId: universityId
        },
        orderBy: {
            name: "asc"
        }
    });
}