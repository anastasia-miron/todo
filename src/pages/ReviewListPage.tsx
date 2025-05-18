import React, { useLayoutEffect, useMemo, useState } from "react";
import apiService from "../services/api.service";
import ReviewList from "../components/ReviewList";
import { ReviewModel } from "../typings/models";
import useAbortSignal from "../hooks/useAbortSignal";
import useRefreshTrigger from "../hooks/useRefreshTrigger";
import { toast } from "react-toastify";
import useCurrentUser from "../hooks/useCurrentUser";

const ReviewListPage: React.FC = () => {
    const { trigger } = useRefreshTrigger();
    const { user } = useCurrentUser();
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [tab, setTab] = useState<'for_me' | 'by_me'>('for_me');
    const [isLoading, setIsLoading] = useState(false);
    const signal = useAbortSignal();

    useLayoutEffect(() => {
        (async () => {
            setIsLoading(true);
            const response = await apiService.get<ReviewModel[]>("/reviews", { signal });
            if (signal.aborted) return;
            setIsLoading(false);
            if (response.success) {
                setReviews(response.data);
            } else {
                toast.error("Încărcarea recenziilor a eșuat.");
            }
        })();
    }, [trigger]);

    const list = useMemo(() => {
        return reviews.filter(review => {
            return (review.to.id === user!.id && tab === 'for_me') || (review.from.id === user!.id && tab === 'by_me')
        })
    }, [tab, reviews]);

    if (isLoading) {
        return (<article aria-busy="true"></article>)
    }

    return (
        <div className="review-list-page">
            <h1>Recenzii</h1>
            <header role="group">
                <button
                    onClick={() => setTab('for_me')}
                    aria-current={tab === 'for_me'}
                >
                    Pentru mine
                </button>
                <button
                    onClick={() => setTab('by_me')}
                    aria-current={tab === 'by_me'}
                >
                    De la mine
                </button>
            </header>
            <ReviewList reviews={list} />
        </div>
    );
};

export default ReviewListPage;
