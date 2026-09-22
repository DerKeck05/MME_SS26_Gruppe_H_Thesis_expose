import {X} from "lucide-react";
import "../app_theme/modal-stylesheet.css";

function CloseModalButton({onClick}: {onClick: () => void}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="modal-close"
            aria-label="Modal schließen"
        >
            <X/>
        </button>
    );
}

export default CloseModalButton;