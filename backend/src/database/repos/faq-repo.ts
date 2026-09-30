import { prisma } from "../lib/prisma.js";

export async function createFaq(
    question: string,
    answer: string,
    supervisorId: number
) {
    return prisma.faq.create({
        data: {
            question,
            answer,
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

export async function updateFaq(
    faqId: number,
    question?: string,
    answer?: string
) {
    const data: {
        question?: string;
        answer?: string;
    } = {};

    if (question !== undefined) {
        data.question = question;
    }

    if (answer !== undefined) {
        data.answer = answer;
    }

    return prisma.faq.update({
        where: { id: faqId },
        data
    });
}

export async function deleteFaq( faqId: number){
    return prisma.faq.delete({
        where: { id: faqId}
    });
}