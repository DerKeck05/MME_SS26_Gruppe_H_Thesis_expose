import {
    ChevronDown,
    ChevronUp,
    MoreVertical
} from "lucide-react";

import type {UIChapter} from "./outline-component.tsx";


interface OutlineItemProps {

    chapter: UIChapter;

    isProfessor: boolean;

    isExpanded: boolean;

    isMenuOpen: boolean;

    onToggle: () => void;

    onCommentClick: () => void;

    onEdit: () => void;

    onDelete: () => void;

    onMenuToggle: () => void;

    onMenuClose: () => void;

    onAddChild: () => void;

    onAddBefore: () => void;

    onAddAfter: () => void;
}

// Single Chapter Item for UI
function OutlineItem({
    chapter,
    isProfessor,
    isExpanded,
    isMenuOpen,
    onToggle,
    onCommentClick,
    onEdit,
    onDelete,
    onMenuToggle,
    onMenuClose,
    onAddChild,
    onAddBefore,
    onAddAfter
}: OutlineItemProps) {

    return (

        <div
            className="
                outline-item
                grid
                grid-cols-[auto_1fr_auto]
                items-center
                gap-4
                p-(--spacing-small)
                bg-night-blue
                text-(--white)
                rounded-(--border-radius)
                select-none
            "
            // Indent depening on level of chapter
            style={{
                marginLeft: `${chapter.level * 32}px`
            }}
        >
            {/* Displays the Number and title of the chapter */}
            <p className="font-semibold text-xl">
                {chapter.number}
            </p>


            <p className="font-medium text-lg text-left">
                {chapter.title}
            </p>

            {/* Different Buttons for Comments, Shrink Children feature and chapter menu */}
            <div className="flex items-center justify-end gap-2">
                {/* Only gets shown if the chapter has a comment */}
                {chapter.hasComment && (
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        onClick={onCommentClick}
                    >
                        <MessageSquareText/>
                    </button>
                )}

                {/* Only gets shown if the chapter has children */}
                {chapter.isParent && (

                    <button
                        type="button"
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                        "
                        onClick={onToggle}
                    >

                        {isExpanded && (
                            <ChevronUp/>
                        )}

                        {!isExpanded && (
                            <ChevronDown/>
                        )}

                    </button>

                )}

                {/* Opens up menu to insert new chapters, open the edit modal or delete the item;
                    Opening and closing is controlled in parent functions so only one modal at a time can be shown
                 */}
                <div className="relative">

                    <button
                        type="button"
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                        "
                        onClick={(event) => {

                            event.stopPropagation();

                            onMenuToggle();

                        }}
                    >

                        <MoreVertical/>

                    </button>

                    {isMenuOpen && (<>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={onMenuClose}
                        />

                        {/* Actual Modal that gets shown with the different Options */}
                        <div
                            className="
                                absolute
                                right-0
                                top-full
                                z-50
                                mt-2
                                min-w-52
                                rounded-(--border-radius)
                                bg-(--white)
                                text-(--dark-blue)
                                shadow-lg
                                overflow-hidden
                            "
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                    onMenuClose();
                                    onAddChild();
                                }}
                            >
                                Unterkapitel hinzufügen
                            </button>

                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                    onMenuClose();
                                    onAddBefore();
                                }}
                            >
                                Kapitel davor einfügen
                            </button>

                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                    onMenuClose();
                                    onAddAfter();
                                }}
                            >
                                Kapitel danach einfügen
                            </button>

                    {isMenuOpen && (

                        <>

                            <div
                                className="
                                    fixed
                                    inset-0
                                    z-40
                                "
                                onClick={onMenuClose}
                            />


                            <div
                                className="
                                    absolute
                                    right-0
                                    top-full
                                    z-50
                                    mt-2
                                    min-w-52
                                    rounded-(--border-radius)
                                    bg-(--white)
                                    text-(--dark-blue)
                                    shadow-lg
                                    overflow-hidden
                                "
                                onClick={(event) => {

                                    event.stopPropagation();

                                }}
                            >


                                {isProfessor && (

                                    <button
                                        type="button"
                                        className="
                                            w-full
                                            text-left
                                            px-4
                                            py-2
                                            hover:bg-gray-100
                                        "
                                        onClick={() => {

                                            onMenuClose();

                                            onCommentClick();

                                        }}
                                    >

                                        Kommentare anzeigen

                                    </button>

                                )}


                                {!isProfessor && (

                                    <>

                                        <button
                                            type="button"
                                            className="
                                                w-full
                                                text-left
                                                px-4
                                                py-2
                                                hover:bg-gray-100
                                            "
                                            onClick={() => {

                                                onMenuClose();

                                                onAddChild();

                                            }}
                                        >

                                            Unterkapitel hinzufügen

                                        </button>


                                        <button
                                            type="button"
                                            className="
                                                w-full
                                                text-left
                                                px-4
                                                py-2
                                                hover:bg-gray-100
                                            "
                                            onClick={() => {

                                                onMenuClose();

                                                onAddBefore();

                                            }}
                                        >

                                            Kapitel davor einfügen

                                        </button>


                                        <button
                                            type="button"
                                            className="
                                                w-full
                                                text-left
                                                px-4
                                                py-2
                                                hover:bg-gray-100
                                            "
                                            onClick={() => {

                                                onMenuClose();

                                                onAddAfter();

                                            }}
                                        >

                                            Kapitel danach einfügen

                                        </button>


                                        <div className="h-px bg-gray-200"/>


                                        <button
                                            type="button"
                                            className="
                                                w-full
                                                text-left
                                                px-4
                                                py-2
                                                hover:bg-gray-100
                                            "
                                            onClick={() => {

                                                onMenuClose();

                                                onEdit();

                                            }}
                                        >

                                            Kapitel bearbeiten

                                        </button>


                                        <button
                                            type="button"
                                            className="
                                                w-full
                                                text-left
                                                px-4
                                                py-2
                                                hover:bg-gray-100
                                            "
                                            onClick={() => {

                                                onMenuClose();

                                                onDelete();

                                            }}
                                        >

                                            Kapitel löschen

                                        </button>


                                        <div className="h-px bg-gray-200"/>


                                        <button
                                            type="button"
                                            className="
                                                w-full
                                                text-left
                                                px-4
                                                py-2
                                                hover:bg-gray-100
                                            "
                                            onClick={() => {

                                                onMenuClose();

                                                onCommentClick();

                                            }}
                                        >

                                            Kommentare anzeigen

                                        </button>

                                    </>

                                )}

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>
    );
}


export default OutlineItem;