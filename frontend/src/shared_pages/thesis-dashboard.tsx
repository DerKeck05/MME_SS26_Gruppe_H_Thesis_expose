import CalendarPreview
    from "../student_pages/student_dashboard/cards/calendar-preview.tsx";
import TimeCard
    from "../student_pages/student_dashboard/cards/time-card.tsx";
import UpNextCard, {
    type UpNextEvents
} from "../student_pages/student_dashboard/cards/up-next-card.tsx";

import {useEffect, useState} from "react";

import type {CalendarEvent}
    from "../student_pages/calendar_pages/calendar-component.tsx";

import {
    type CalendarEntry,
    getCalendarEntries
} from "../apis/calendar-api.ts";

import {useError} from "../globals/error-provider.tsx";