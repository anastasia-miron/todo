import React from "react";
import { ReviewModel } from "../typings/models";
import ReviewItem from "./ReviewItem";
import './ReviewList.css';


interface Props {
    reviews: ReviewModel[];
    onUpdate: (updatedReview: ReviewModel) => void;
    onDelete: (id: string) => void;
}

const ReviewList: React.FC<Props> = (props) => {
    const { reviews, onUpdate, onDelete } = props;
    return (
        <div className="review-list">
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                ))
            ) : (
                <div className="review-list__no-results">
                    <img src="/no-results.svg" alt="No reviews" />
                    <h3>No reviews yet</h3>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
