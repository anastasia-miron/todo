import React, { useEffect } from "react";
import { X } from "lucide-react";
import { RequestUrgencyEnum } from "../typings/models";
import { RequestPayload } from "../typings/types";
import { useFormik } from "formik";
import { requestSchema } from "../schemas";
import './RequestFormModal.css';

interface Props {
    request?: RequestPayload;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: RequestPayload) => void;
}

const DEFAULT_VALUE: RequestPayload = {
    location: '',
    description: '',
    title: '',
    urgency: RequestUrgencyEnum.MEDIUM
}

const RequestFormModal: React.FC<Props> = (props) => {
    const { request, onClose, onSubmit, open } = props;

    const { values, handleChange, handleSubmit, setValues, dirty, isValid, isSubmitting } = useFormik({
        initialValues: DEFAULT_VALUE,
        validationSchema: requestSchema,
        onSubmit,
    });

    useEffect(() => {
        if (request) {
            setValues(request);
        }
    }, [request])

    if (!open) return null;

    return (
        <dialog open={open}>
            <form onSubmit={handleSubmit}>
                <article >
                    <header className="request-modal__header">
                        <button type="button" className="request-modal__close" onClick={onClose}>
                            <X size={20} />
                        </button>
                        <h2>Create a New Request</h2>
                    </header>

                    <input
                        name="title"
                        type="text"
                        placeholder="Title"
                        value={values.title}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={values.description}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="location"
                        type="text"
                        placeholder="Location"
                        value={values.location}
                        onChange={handleChange}
                        required
                    />
                    <select
                        name="urgency"
                        value={values.urgency}
                        onChange={handleChange}
                    >
                        <option value={RequestUrgencyEnum.LOW}>Low</option>
                        <option value={RequestUrgencyEnum.MEDIUM}>Medium</option>
                        <option value={RequestUrgencyEnum.HIGH}>High</option>
                    </select>
                    <footer>
                        <button type="submit" disabled={!dirty || !isValid} aria-busy={isSubmitting}>
                            Save
                        </button>
                    </footer>

                </article>
            </form>
        </dialog>
    );
};

export default RequestFormModal;
