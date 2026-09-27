import {X} from "lucide-react";

type ErrorMessageProps = {
    message: string;
    onClose: () => void;
};

function ErrorMessage({message, onClose}: ErrorMessageProps) {
    return (
        <div
            className="
                fixed
                right-6
                bottom-6
                z-9999

                w-[min(380px,calc(100vw-48px))]
                overflow-hidden

                rounded-(--border-radius)
                border
                border-[#f0b4b4]

                bg-white
                text-(--dark-blue)

                shadow-[0_8px_24px_rgba(0,0,0,0.15)]
            "
        >
            <div
                className="
                    flex
                    items-start
                    gap-4
                    px-4
                    py-3.5
                "
            >
                <p
                    className="
                        m-0
                        min-w-0
                        flex-1

                        text-sm
                        font-medium
                        leading-normal

                        wrap-break-word
                    "
                >
                    {message}
                </p>

                <button
                    className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center

                        rounded-md
                        border-0
                        bg-transparent
                        p-0

                        text-(--dark-blue)

                        cursor-pointer

                        transition-colors
                        duration-150

                        hover:bg-[#f3f3f3]
                    "
                    type="button"
                    onClick={onClose}
                    aria-label="Fehlermeldung schließen"
                >
                    <X size={18}/>
                </button>
            </div>

            <div
                className="
                    h-0.75
                    w-full

                    origin-left
                    bg-[#d9534f]

                    animate-error-timer
                "
            />
        </div>
    );
}

export default ErrorMessage;