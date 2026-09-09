import {prisma} from "../lib/prisma.js";

export async function createFaq(content: string, supervisorId: number) {
    return prisma.faq.create({
        data: {
            content,
            supervisorId
        }
    });
}

export async function getFaqById(faqId: number) {
    return prisma.faq.findUnique({
        where: { id: faqId }
    });
}

export async function getFaqsBySupervisorId(supervisorId: number) {
    return prisma.faq.findMany({
        where: { supervisorId }
    });
}

export async function updateFaq(faqId: number, content?: string) {
    return prisma.faq.update({
        where: { id: faqId },
        data: {
            content
        }
    });
}
