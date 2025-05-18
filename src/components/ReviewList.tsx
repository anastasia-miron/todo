import React from "react";
import { ReviewModel } from "../typings/models";
import ReviewItem from "./ReviewItem";
import './ReviewList.css';


interface Props {
    reviews: ReviewModel[];
}

const ReviewList: React.FC<Props> = (props) => {
    const { reviews } = props;
    return (
        <div className="review-list">
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                    />
                ))
            ) : (
                <div className="review-list__no-results">
                    <img src="/no-results.svg" alt="No reviews" />
                    <h3>Nu sunt recenzii diponibile</h3>
                </div>
            )}
        </div>
    );
};

export default ReviewList;
