import {Link, useParams} from "react-router-dom";

import "../student_pages/student-dashboard-stylesheet.css";

function ProfSidebar() {
    const {id} = useParams();

    return (
        <aside
            className="
                flex
                w-62.5
                min-h-[calc(100vh-80px)]
                shrink-0
                flex-col
                items-start
                justify-start
                gap-(--spacing-small)
                bg-(--white)
                pt-(--spacing-small)
                pl-(--spacing-large)
                pr-(--spacing-small)
            "
        >
            <Link
                to={`/professor/thesis/${id}`}
                className="
                    flex
                    w-full
                    m-0
                    items-center
                    rounded-(--border-radius)
                    py-(--spacing-small)
                    text-left
                    text-[22px]
                    font-semibold
                    text-(--night-blue)
                    hover:bg-(--night-blue)
                    hover:text-(--white)
                    pl-2
                "
            >
                Homepage
            </Link>

            <Link
                to={`/professor/thesis/${id}/outline`}
                className="
                    flex
                    w-full
                    m-0
                    items-center
                    rounded-(--border-radius)
                    py-(--spacing-small)
                    text-left
                    text-[22px]
                    font-semibold
                    text-(--night-blue)
                    hover:bg-(--night-blue)
                    hover:text-(--white)
                    pl-2
                "
            >
                Kapitel
            </Link>

            <Link
                to={`/professor/thesis/${id}/calendar`}
                className="
                    flex
                    w-full
                    m-0
                    items-center
                    rounded-(--border-radius)
                    py-(--spacing-small)
                    text-left
                    text-[22px]
                    font-semibold
                    text-(--night-blue)
                    hover:bg-(--night-blue)
                    hover:text-(--white)
                    pl-2
                "
            >
                Kalender
            </Link>

            <Link
                to={`/professor/thesis/${id}/faq`}
                className="
                    flex
                    w-full
                    m-0
                    items-center
                    rounded-(--border-radius)
                    py-(--spacing-small)
                    text-left
                    text-[22px]
                    font-semibold
                    text-(--night-blue)
                    hover:bg-(--night-blue)
                    hover:text-(--white)
                    pl-2
                "
            >
                FAQ
            </Link>
        </aside>
    );
}

export default ProfSidebar;