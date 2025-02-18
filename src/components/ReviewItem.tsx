import React, { useState } from "react";
import { ReviewModel } from "../typings/models";
import Avatar from "./Avatar";
import Rating from "./Rating";
import { toast } from "react-toastify";
import apiService from "../services/api.service";
import useCurrentUser from "../hooks/useCurrentUser";
import ConfirmModal from "./ConfirmModal";
import "./ReviewItem.css";
import ReviewModal from "./ReviewModal";
import useAbortSignal from "../hooks/useAbortSignal";

interface Props {
    review: ReviewModel;
    onUpdate: (updatedReview: ReviewModel) => void;
    onDelete: (id: string) => void;
}

const ReviewItem: React.FC<Props> = (props) => {
    const { review, onUpdate, onDelete } = props;
    const { user } = useCurrentUser();
    const [isLoading, setIsLoading] = useState(false);
    const signal = useAbortSignal();
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    
    const isAuthor = user?.id === review.from.id;

    const handleEdit = async (updatedReview: { rating: number; comment: string }) => {
        setIsLoading(true);
        const response = await apiService.put(`/reviews/${review.id}`, updatedReview, {signal});
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return
        }
        onUpdate({ ...review, ...updatedReview });
        setIsEditing(false);
        toast.success("Review updated successfully!");
    };
    const handleDelete = async () => {
        setIsLoading(true);
        const response = await apiService.delete(`/reviews/${review.id}`, {signal});
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        onDelete(review.id);
        setConfirmDelete(false);
        toast.success("Review deleted successfully!");
    };


    return (
        <article className="review-item">
            <header className="review-item__header">
                <div className="review-item__user">
                    <Avatar user={review.from} />
                    <span>{review.from.username}</span>
                </div>
                <time>{new Date(review.createdAt).toLocaleString()}</time>
            </header>

            <Rating value={review.rating} readOnly />
            <blockquote>{review.comment || 'No comment'}</blockquote>

            {isAuthor && (
                <footer className="review-item__actions">
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={() => setConfirmDelete(true)} className="outline">Delete</button>
                </footer>
            )}

            {isEditing && (
                <ReviewModal
                    open
                    value={review}
                    onClose={() => setIsEditing(false)}
                    onSubmit={handleEdit}
                />
            )}

            {confirmDelete && (
                <ConfirmModal
                    message="Are you sure you want to delete this review?"
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={handleDelete}
                    open
                />
            )}
        </article>
    );
};

export default ReviewItem;