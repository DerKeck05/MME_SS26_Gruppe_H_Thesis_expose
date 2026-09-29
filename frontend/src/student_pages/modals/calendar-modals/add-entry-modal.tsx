import {useState} from "react";
import CloseModalButton from "../../../globals/close-modal-button.tsx";
import {MAX_ENTRY_TITLE_LENGTH} from "../../calendar_pages/calendar-page.tsx";
import {DatePickerInput, DateTimePicker} from "@mantine/dates";
import "dayjs/locale/de";
import dayjs from "dayjs";
import {datePresets, dateTimePresets} from "./date-presets.ts";

interface AddEntry {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    allDay: boolean;
}

interface AddEntryModalProps {
    onClose: () => void;
    onSubmit: (entry: AddEntry) => Promise<void>;
}

function AddEntryModal({
                           onClose,
                           onSubmit
                       }: AddEntryModalProps) {

    const [entryTitle, setEntryTitle] = useState("");
    const [entryDescription, setEntryDescription] = useState("");
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);
    const [allDay, setAllDay] = useState(false);

    const isFormValid =
        entryTitle.trim() !== "" &&
        entryTitle.trim().length <= MAX_ENTRY_TITLE_LENGTH &&
        (
            allDay
                ? date !== "" && date !== null
                : startDate !== "" && startDate !== null &&
                endDate !== "" && endDate !== null &&
                new Date(endDate) > new Date(startDate)
        );

    function handleAllDayChange(enabled: boolean) {
        setAllDay(enabled);

        setDate(null);
        setStartDate(null);
        setEndDate(null);
    }

    async function submitEntry() {
        if (!entryTitle.trim()) {
            console.log("Titel fehlt");
            return;
        }

        if (allDay) {
            if (!date) {
                console.error("Datum fehlt");
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
            console.error("Start- oder Enddatum fehlt");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end <= start) {
            console.log("Ende muss später als der Start liegen");
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
            onClick={onClose}
        >
            <div
                className="modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Ereignis hinzufügen</h3>

                    <CloseModalButton onClick={onClose}/>
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
                        value={entryDescription}
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
                    ) : (<div className="date-row">
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

                            minDate={startDate
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

                        {/*<label>
                            Ende:
                            <input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </label>*/}
                    </div>)}

                </div>

                <div className="spacer"/>

                <button
                    className="squared-button modal-submit-button"
                    type="button"
                    disabled={!isFormValid}
                    onClick={() => void submitEntry()}
                >
                    Ereignis erstellen
                </button>
            </div>
        </div>
    );
}

export default AddEntryModal;