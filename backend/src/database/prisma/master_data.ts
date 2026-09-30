// Names of thge universitys  
export const universityName =
    "Universität Regensburg";


// chairs we  have 
export const chairs = [
    "Data Engineering",
    "Information Science",
    "Internet Business und Digitale Soziale Medien",
    "Maschinelles Lernen",
    "Medieninformatik",
    "Mensch-Maschine-Interaktion",
    "Statistische Bioinformatik"
];


// Studys to choose for registration 
export const courses = [
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

//Describes the connection between Chair and courses 
export type ChairCourseMapping = {
    chairName: string;
    courseNames: string[];
};


// sort the chairs to the courses 
export const chairCourseMappings: ChairCourseMapping[] = [

    {
        chairName: "Medieninformatik",
        courseNames: [
            "Medieninformatik B.A.",
            "Media Informatics M.Sc."
        ]
    },

    {
        chairName: "Mensch-Maschine-Interaktion",
        courseNames: [
            "Medieninformatik B.A.",
            "Media Informatics M.Sc.",
            "Human-Centred AI M.Sc."
        ]
    },

    {
        chairName: "Information Science",
        courseNames: [
            "Informationswissenschaft B.A.",
            "Human-Centred AI M.Sc."
        ]
    },

    {
        chairName: "Internet Business und Digitale Soziale Medien",
        courseNames: [
            "Wirtschaftsinformatik B.Sc.",
            "Wirtschaftsinformatik M.Sc.",
            "Digital Business B.Sc.",
            "Digital Business M.Sc."
        ]
    },

    {
        chairName: "Data Engineering",
        courseNames: [
            "Informatik B.Sc.",
            "Computer Science M.Sc.",
            "Data Science B.Sc.",
            "Data Science M.Sc."
        ]
    },

    {
        chairName: "Maschinelles Lernen",
        courseNames: [
            "Informatik B.Sc.",
            "Computer Science M.Sc.",
            "Data Science B.Sc.",
            "Data Science M.Sc.",
            "Human-Centred AI M.Sc."
        ]
    }
];