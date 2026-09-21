import "./outline-stylesheet.css";
import OutlineComponent from "./outline-component.tsx";
import {Plus} from "lucide-react";

function OutlinePage () {
    return (
        <div className="outline-page flex bg-(--white) rounded-(--border-radius) flex-col m-(--spacing-medium) p-(--spacing-medium)">
            <div className="outline-page-header flex justify-end">
                <button className="w-20 h-10 rounded-(--border-radius)">
                    <Plus />
                </button>
            </div>

            <OutlineComponent />
        </div>
    );
}

export default OutlinePage;