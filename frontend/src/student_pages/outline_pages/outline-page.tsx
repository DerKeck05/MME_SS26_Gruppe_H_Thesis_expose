import OutlineComponent from "./outline-component.tsx";
import {Plus} from "lucide-react";
import {useState} from "react";
import AddChapterModal from "./modals/add-chapter-modal.tsx";

function OutlinePage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div
            className="outline-page flex bg-(--white) rounded-(--border-radius) flex-col m-(--spacing-medium) p-(--spacing-medium)">
            <div className="outline-page-header flex justify-end">
                <button className="w-20 h-10 rounded-(--border-radius)" onClick={() => {
                    setShowModal(true);
                }}>
                    <Plus/>
                </button>
            </div>

            <OutlineComponent/>

            {showModal && <AddChapterModal onSubmit={() => {
                setShowModal(false)
            }} onCancel={() => {
                setShowModal(false)
            }}/>}
        </div>
    );
}

export default OutlinePage;