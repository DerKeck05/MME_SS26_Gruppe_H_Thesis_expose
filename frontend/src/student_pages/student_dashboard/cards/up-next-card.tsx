import {Calendar} from "lucide-react";

interface UpNextProps {
    upNextEvents: UpNextEvents[];
}

export interface UpNextEvents {
    title: string;
    date: string;
}

function UpNextCard({upNextEvents}: UpNextProps) {
    return (
        <div
            className="flex flex-col bg-(--white) border-2 border-(--night-blue) text-(--night-blue) p-4 rounded-(--border-radius)"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold">
                    Als Nächstes
                </h2>

                <Calendar
                    size={26}
                    strokeWidth={2}
                />
            </div>

            {/* Events */}
            <div className="flex flex-col gap-4">
                {upNextEvents.map((event) => (
                    <div
                        key={`${event.title}-${event.date}`}
                        className="flex items-center gap-3 border-2 border-(--night-blue) p-1 rounded-(--border-radius)"
                    >
                        {/* Akzent links */}
                        <div className="w-1 h-12 rounded-full bg-(--night-blue) shrink-0 ml-2 mt-1 mb-1"/>

                        {/* Event-Inhalt */}
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold text-base">
                                {event.title}
                            </p>

                            <p className="text-sm font-medium opacity-80">
                                {event.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UpNextCard;