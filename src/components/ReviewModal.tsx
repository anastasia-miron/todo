import React from "react";
import { X } from "lucide-react";
import "./ReviewModal.css";
import Rating from "./Rating";
import { useFormik } from "formik";
import { ReviewPayload } from "../typings/types";


interface Props {
    value: ReviewPayload
    open: boolean;
    onClose: () => void;
    onSkip: () => void;
    onSubmit: (data: ReviewPayload) => unknown;
}
const ReviewModal: React.FC<Props> = (props) => {
    const { open, onClose, onSubmit, onSkip, value } = props;

    const { handleSubmit, values, setFieldValue, handleChange, isValid, dirty, isSubmitting } = useFormik({
        initialValues: value,
        onSubmit: async (data) => onSubmit(data)
    })

    if (!open) return null;

    return (
        <dialog open={open} className="review-modal">
            <form onSubmit={handleSubmit}>
                <article>
                    <header className="review-modal__header">
                        <button type="button" className="review-modal__close" onClick={onClose}>
                            <X size={20} />
                        </button>
                        <h2>Leave a Review</h2>
                    </header>

                    <div className="review-modal__content">
                        <div>
                            <label>Rating:</label>
                            <Rating
                                value={values.rating}
                                className="review-modal__stars"
                                onChange={(val) => setFieldValue('rating', val)}
                            />
                        </div>
                        <div>
                            <label >Feedback:</label>
                            <textarea
                                name="comment"
                                value={values.comment}
                                onChange={handleChange}
                                placeholder="Write your review here..."
                            />
                        </div>
                    </div>

                    <footer className="review-modal__actions">
                        <button onClick={onSkip} className="outline">Skip</button>
                        <button type="submit" disabled={!isValid || !dirty} aria-busy={isSubmitting}>
                            Done
                        </button>
                    </footer>
                </article>
            </form>
        </dialog>
    );
};

export default ReviewModal;

