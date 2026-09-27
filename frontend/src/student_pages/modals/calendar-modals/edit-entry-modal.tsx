import {useState} from "react";
import {type CalendarEntry} from "../../../apis/calendar-api.ts";
import CloseModalButton from "../../../globals/close-modal-button.tsx";
import {MAX_ENTRY_TITLE_LENGTH} from "../../calendar_pages/calendar-page.tsx";
import {DatePickerInput, DateTimePicker} from "@mantine/dates";
import "dayjs/locale/de";
import dayjs from "dayjs";
import {datePresets, dateTimePresets} from "./date-presets.ts";

interface EditEntryModalProps {
    entry: CalendarEntry;
    onCancel: () => void;
    onSubmit: (entry: {
        title: string;
        description: string | null;
        startDate: string;
        endDate: string;
        allDay: boolean;
    }) => Promise<void>;
}

function EditEntryModal({
                            onCancel,
                            onSubmit,
                            entry
                        }: EditEntryModalProps) {

    const [entryTitle, setEntryTitle] = useState(entry.title);
    const [entryDescription, setEntryDescription] = useState(entry.description);

    const [allDay, setAllDay] = useState(entry.allDay);

    const [startDate, setStartDate] = useState<string | null>(
        entry.allDay
            ? null
            : dayjs(entry.startDate).format("YYYY-MM-DD HH:mm:ss")
    );

    const [endDate, setEndDate] = useState<string | null>(
        entry.allDay
            ? null
            : dayjs(entry.endDate).format("YYYY-MM-DD HH:mm:ss")
    );

    const [date, setDate] = useState<string | null>(
        entry.allDay
            ? dayjs(entry.startDate).format("YYYY-MM-DD")
            : null
    );

    const isFormValid =
        entryTitle.trim() !== "" &&
        entryTitle.trim().length <= MAX_ENTRY_TITLE_LENGTH &&
        (
            allDay
                ? date !== null
                : startDate !== null &&
                endDate !== null &&
                new Date(endDate) > new Date(startDate)
        );

    function handleAllDayChange(enabled: boolean) {
        setAllDay(enabled);

        if (enabled) {
            // Normal -> Ganztägig
            if (startDate) {
                setDate(startDate.split(" ")[0]);
            } else if (!date) {
                setDate(dayjs().format("YYYY-MM-DD"));
            }

            return;
        }

        // Ganztägig -> Normal
        if (date) {
            const start = dayjs(date)
                .hour(9)
                .minute(0)
                .second(0);

            const end = start.add(1, "hour");

            setStartDate(start.format("YYYY-MM-DD HH:mm:ss"));
            setEndDate(end.format("YYYY-MM-DD HH:mm:ss"));
        }
    }

    async function submitEdit() {
        if (!isFormValid) {
            return;
        }

        if (allDay) {
            if (!date) {
                return;
            }

            const start = new Date(`${date}T00:00:00Z`);
            const end = new Date(`${date}T00:00:00Z`);

            end.setUTCDate(end.getUTCDate() + 1);

            await onSubmit({
                title: entryTitle,
                description: entryDescription,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                allDay: true
            });

            return;
        }

        if (!startDate || !endDate) {
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            return;
        }

        await onSubmit({
            title: entryTitle,
            description: entryDescription,
            startDate,
            endDate,
            allDay: false
        });
    }

    return (
        <div
            className="modal-backdrop"
            onClick={onCancel}
        >
            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Ereignis bearbeiten</h3>

                    <CloseModalButton onClick={onCancel}/>
                </div>

                <div className="modal-body" id="calendar-modal">

                    <input
                        type="text"
                        placeholder="Neues Ereignis"
                        maxLength={MAX_ENTRY_TITLE_LENGTH}
                        value={entryTitle}
                        onChange={(e) => setEntryTitle(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Beschreibung"
                        maxLength={500}
                        value={entryDescription ?? ""}
                        onChange={(e) => setEntryDescription(e.target.value)}
                    />

                    <div className="flex min-h-10.5 flex-row items-center gap-(--spacing-small)">
                        <input
                            type="checkbox"
                            id="allDay"
                            checked={allDay}
                            onChange={(e) => handleAllDayChange(e.target.checked)}
                            className="m-0 h-5 w-5 min-h-5 cursor-pointer accent-(--tertiary)"
                        />

                        <label className="cursor-default text-[18px] font-semibold text-(--dark-blue)">
                            Ganztägig
                        </label>
                    </div>

                    {allDay ? (
                        <DatePickerInput
                            label="Datum"
                            placeholder="Datum auswählen"
                            locale="de"
                            value={date}
                            onChange={setDate}
                            clearable
                            valueFormat="DD.MM.YYYY"
                            firstDayOfWeek={1}
                            withWeekNumbers
                            hideOutsideDates
                            withNativeLevelSelect
                            minDate={dayjs().format("YYYY-MM-DD")}
                            presets={datePresets}
                            popoverProps={{
                                zIndex: 1100
                            }}
                        />
                    ) : (
                        <div className="date-row">

                            <DateTimePicker
                                label="Start"
                                placeholder="Datum und Uhrzeit auswählen"
                                locale="de"
                                value={startDate}
                                onChange={setStartDate}
                                clearable
                                valueFormat="DD.MM.YYYY HH:mm"
                                firstDayOfWeek={1}
                                withWeekNumbers
                                hideOutsideDates
                                withNativeLevelSelect
                                minDate={dayjs().format("YYYY-MM-DD")}
                                presets={dateTimePresets}
                                timePickerProps={{
                                    format: "24h",
                                    withDropdown: true,
                                    minutesStep: 5
                                }}
                                popoverProps={{
                                    zIndex: 1100
                                }}
                            />

                            <DateTimePicker
                                label="Ende"
                                placeholder="Datum und Uhrzeit auswählen"
                                locale="de"
                                value={endDate}
                                onChange={setEndDate}
                                clearable
                                valueFormat="DD.MM.YYYY HH:mm"
                                firstDayOfWeek={1}
                                withWeekNumbers
                                hideOutsideDates
                                withNativeLevelSelect
                                minDate={
                                    startDate
                                        ? startDate.split(" ")[0]
                                        : dayjs().format("YYYY-MM-DD")
                                }
                                presets={dateTimePresets}
                                timePickerProps={{
                                    format: "24h",
                                    withDropdown: true,
                                    minutesStep: 5
                                }}
                                popoverProps={{
                                    zIndex: 1100
                                }}
                            />

                        </div>
                    )}

                </div>

                <div className="spacer"/>

                <button
                    className="squared-button modal-submit-button"
                    type="button"
                    disabled={!isFormValid}
                    onClick={() => void submitEdit()}
                >
                    Ereignis speichern
                </button>
            </div>
        </div>
    );
}

export default EditEntryModal;