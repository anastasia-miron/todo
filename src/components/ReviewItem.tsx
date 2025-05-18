import React from "react";
import { ReviewModel } from "../typings/models";
import Avatar from "./Avatar";
import Rating from "./Rating";
import useCurrentUser from "../hooks/useCurrentUser";
import "./ReviewItem.css";
import { useNavigate } from "react-router";

interface Props {
    review: ReviewModel;
}

const ReviewItem: React.FC<Props> = (props) => {
    const { review } = props;
    const { user } = useCurrentUser();
    const navigate = useNavigate();

    const handleOpenProfile = (id: string) => {
        if (user?.id === id) {
            navigate('/app/profile');
            return;
        }
        navigate(`/app/user/${id}`);
    }

    return (
        <article className="review-item">
        <header className="review-item__header">
            <div className="review-item__user" onClick={() => handleOpenProfile(review.from.id)}>
                <Avatar user={review.from} />
                <span>{review.from.username}</span>
            </div>
            <Rating value={review.rating} readOnly />
        </header>
        <blockquote>{review.comment || 'Fără comentarii'}</blockquote>

        <footer className="review-item__actions">
            <time className="review-item__date">{new Date(review.createdAt).toLocaleString()}</time>
        </footer>
    </article>
    );
};

export default ReviewItem;