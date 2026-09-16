import {prisma} from "../lib/prisma.js";

export async function createSupervisor(name: string, email: string, passwordHash: string, chair: string) {
    return prisma.supervisor.create({
        data: {
            name,
            email,
            passwordHash,
            chair
        }
    });
}

export async function getSupervisorById(supervisorId: number) {
    return prisma.supervisor.findUnique({
        where: { id: supervisorId }
    });
}

export async function getSupervisorByEmail(email: string) {
    return prisma.supervisor.findUnique({
        where: { email }
    });
}

export async function updateSupervisor(supervisorId: number, name?: string, email?: string, passwordHash?: string, chair?: string) {
    return prisma.supervisor.update({
        where: { id: supervisorId },
        data: {
            name,
            email,
            passwordHash,
            chair
        }
    });
}

export async function deleteSupervisor(supervisorId: number) {
    return prisma.supervisor.delete({
        where: { id: supervisorId }
    });
}