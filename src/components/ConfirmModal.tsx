import React from "react";
import { X } from "lucide-react";
import "./ConfirmModal.css";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmModal: React.FC<Props> = (props) => {
    const { open, onClose, onConfirm, message } = props;
    if (!open) return null;

    return (
        <dialog open={open} className="confirm-modal">
            <article>
                <header className="confirm-modal__header">
                    <button type="button" className="confirm-modal__close" onClick={onClose}>
                        <X size={20} />
                    </button>
                    <h2>Confirmare</h2>
                </header>
                <p>{message}</p>
                <footer>
                <button onClick={onClose} className="outline">Nu</button>
                <button onClick={onConfirm}>Da</button>
                   
                </footer>
            </article>
        </dialog>
    );
};

export default ConfirmModal;
