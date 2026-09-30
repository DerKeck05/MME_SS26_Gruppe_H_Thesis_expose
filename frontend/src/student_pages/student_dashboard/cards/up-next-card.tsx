import {Calendar}
    from "lucide-react";


// interfaces for passing the correct data
interface UpNextProps {
    upNextEvents: UpNextEvents[];
}

export interface UpNextEvents {
    title: string;
    date: string;
}


function UpNextCard({
    upNextEvents
}: UpNextProps) {

    return (

        <div className="up-next-card glass-card">

            <div className="up-next-header">

                <h2>
                    Als Nächstes
                </h2>

                {/* Calendar Icon from Lucide Icons */}
                <Calendar
                    size={24}
                    strokeWidth={2}
                />
            </div>


            <div className="up-next-list">

                {upNextEvents.length === 0 && (

                    <p className="up-next-empty">

                        Keine kommenden Termine.

                    </p>

                )}


                {upNextEvents.map(
                    (event) => (

                        <div
                            key={
                                event.title
                                +
                                event.date
                            }

                            className="up-next-event"
                        >

                            <div className="up-next-accent">
                            </div>


                            <div>

                                <p className="up-next-event-title">

                                    {event.title}

                                </p>


                                <p className="up-next-event-date">

                                    {event.date}

                                </p>

                            </div>

                        </div>

                    )
                )}

            </div>
        </div>
    );
}

export default UpNextCard;