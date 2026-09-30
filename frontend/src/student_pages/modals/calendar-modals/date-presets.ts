import dayjs from "dayjs";

//
// Presets for the Datepicker for certain times and days
//

export const dateTimePresets = [
    {
        value: dayjs()
            .hour(9)
            .minute(0)
            .second(0)
            .format("YYYY-MM-DD HH:mm:ss"),
        label: "Heute 09:00"
    },
    {
        value: dayjs()
            .hour(12)
            .minute(0)
            .second(0)
            .format("YYYY-MM-DD HH:mm:ss"),
        label: "Heute 12:00"
    },
    {
        value: dayjs()
            .hour(18)
            .minute(0)
            .second(0)
            .format("YYYY-MM-DD HH:mm:ss"),
        label: "Heute 18:00"
    },
    {
        value: dayjs()
            .add(1, "day")
            .hour(9)
            .minute(0)
            .second(0)
            .format("YYYY-MM-DD HH:mm:ss"),
        label: "Morgen 09:00"
    }
];

export const datePresets = [
    {
        value: dayjs().format("YYYY-MM-DD"),
        label: "Heute"
    },
    {
        value: dayjs()
            .add(1, "day")
            .format("YYYY-MM-DD"),
        label: "Morgen"
    },
    {
        value: dayjs()
            .add(7, "day")
            .format("YYYY-MM-DD"),
        label: "Nächste Woche"
    }
];
