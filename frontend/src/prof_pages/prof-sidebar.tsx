import {
    Link,
    useParams
} from "react-router-dom";

import "../student_pages/student-dashboard-stylesheet.css";

function ProfSidebar() {

    /*
    The thesis ID is needed
    to create the links
    for the professor sidebar.
    */
    const { id } =
        useParams();


    /*
    If no thesis ID exists,
    the sidebar cannot create
    valid thesis links.
    */
    if (
        id == null
    ) {

        return null;
    }


    /*
    Every sidebar link uses
    the same design.
    The class string is stored once
    so it does not have to be repeated
    for every link.
    */
    const linkClass =
        `
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
        `;


    return (

        /*
        The sidebar contains links
        to the different thesis pages.
        */
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
                to={
                    `/professor/thesis/${id}`
                }
                className={
                    linkClass
                }
            >
                Homepage
            </Link>

            <Link
                to={
                    `/professor/thesis/${id}/outline`
                }
                className={
                    linkClass
                }
            >
                Kapitel
            </Link>

            <Link
                to={
                    `/professor/thesis/${id}/calendar`
                }
                className={
                    linkClass
                }
            >
                Kalender
            </Link>
            <Link
                to={
                    `/professor/thesis/${id}/faq`
                }
                className={
                    linkClass
                }
            >
                FAQ
            </Link>
        </aside>
    );
}

export default ProfSidebar;