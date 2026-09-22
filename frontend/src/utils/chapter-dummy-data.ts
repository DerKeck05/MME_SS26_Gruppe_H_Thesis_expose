import type {Chapter} from "./outline-utils.ts";

export const dummyChapters: Chapter[] = [
    // Ebene 1
    {
        id: 1,
        title: "Einleitung",
        parentId: null,
        position: 0,
        thesisId: 1,
    },
    {
        id: 2,
        title: "Theoretische Grundlagen",
        parentId: null,
        position: 1,
        thesisId: 1,
    },
    {
        id: 3,
        title: "Methodik",
        parentId: null,
        position: 2,
        thesisId: 1,

    },
    {
        id: 4,
        title: "Implementierung",
        parentId: null,
        position: 3,
        thesisId: 1,

    },
    {
        id: 5,
        title: "Fazit",
        parentId: null,
        position: 4,
        thesisId: 1,

    },

    // Ebene 2 unter "Einleitung"
    {
        id: 6,
        title: "Problemstellung",
        parentId: 1,
        position: 0,
        thesisId: 1,

    },
    {
        id: 7,
        title: "Zielsetzung",
        parentId: 1,
        position: 1,
        thesisId: 1,

    },
    {
        id: 8,
        title: "Aufbau der Arbeit",
        parentId: 1,
        position: 2,
        thesisId: 1,

    },

    // Ebene 2 unter "Theoretische Grundlagen"
    {
        id: 9,
        title: "Webentwicklung",
        parentId: 2,
        position: 0,
        thesisId: 1,

    },
    {
        id: 10,
        title: "React",
        parentId: 2,
        position: 1,
        thesisId: 1,

    },
    {
        id: 11,
        title: "TypeScript",
        parentId: 2,
        position: 2,
        thesisId: 1,

    },

    // Ebene 2 unter "Methodik"
    {
        id: 12,
        title: "Anforderungsanalyse",
        parentId: 3,
        position: 0,
        thesisId: 1,

    },
    {
        id: 13,
        title: "Systementwurf",
        parentId: 3,
        position: 1,
        thesisId: 1,

    },

    // Ebene 3 unter "Webentwicklung"
    {
        id: 14,
        title: "Frontend",
        parentId: 9,
        position: 0,
        thesisId: 1,

    },
    {
        id: 15,
        title: "Backend",
        parentId: 9,
        position: 1,
        thesisId: 1,

    },

    // Ebene 3 unter "Frontend"
    {
        id: 16,
        title: "Komponenten",
        parentId: 14,
        position: 0,
        thesisId: 1,

    },
    {
        id: 17,
        title: "Routing",
        parentId: 14,
        position: 1,
        thesisId: 1,

    },

    // Ebene 4
    {
        id: 18,
        title: "Student Dashboard",
        parentId: 16,
        position: 0,
        thesisId: 1,

    },
    {
        id: 19,
        title: "Kalender",
        parentId: 16,
        position: 1,
        thesisId: 1,

    },
];