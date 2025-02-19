import { useLayoutEffect, useState } from "react";
import { RequestModel, RequestStatusEnum, UserTypeEnum } from "../typings/models";
import useAbortSignal from "../hooks/useAbortSignal";
import { useNavigate, useParams } from "react-router";
import apiService from "../services/api.service";
import Avatar from "../components/Avatar";
import useCurrentUser from "../hooks/useCurrentUser";
import ConfirmModal from "../components/ConfirmModal";
import RequestFormModal from "../components/RequestFormModal";
import { RequestPayload, ReviewPayload } from "../typings/types";
import { toast } from "react-toastify";
import UrgencyBadge from "../components/UrgencyBadge";
import StatusBadge from "../components/StatusBadge";
import ReviewModal from "../components/ReviewModal";
import './RequestPage.css'

const DEFAULT_REVIEW: ReviewPayload = { 
    rating: 0,
    comment: ''
}

const RequestPage: React.FC = () => {
    const { id } = useParams();
    const [request, setRequest] = useState<RequestModel | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const signal = useAbortSignal();
    const navigate = useNavigate();
    const { user } = useCurrentUser();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openReview, setOpenReview] = useState<boolean>(false);
    const [confirmAccept, setConfirmAccept] = useState<boolean>(false);
    const [confirmReject, setConfirmReject] = useState<boolean>(false);
    const [confirmCancel, setConfirmCancel] = useState<boolean>(false);
    const [confirmComplete, setConfirmComplete] = useState<boolean>(false);

    useLayoutEffect(() => {
        (async () => {
            setIsLoading(true);
            const response = await apiService.get<RequestModel>(`/requests/${id}`, { signal });
            if (signal.aborted) return;
            setIsLoading(false);
            if (response.success) {
                setRequest(response.data);
            }
        })()
    }, []);

    if (isLoading) {
        return (<article aria-busy="true" />)
    }

    if (!request) {
        return (<article>Server Error</article>)
    }

  

    const handleAccept = async () => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/accept`, {}, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        setConfirmAccept(false);
        setRequest({
            ...request,
            status: RequestStatusEnum.IN_PROGRESS
        });
    }


    const handleComplete = async (data: ReviewPayload) => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/complete`, data, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return
        }

        setRequest({
            ...request,
            status: RequestStatusEnum.DONE
        });
        setConfirmComplete(false);
    };

    const handleSkipReview = async() => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/complete`, {}, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return
        }
        setConfirmComplete(false);
    }

    const handleReject = async () => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/reject`, {}, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        setConfirmReject(false);
        setRequest({
            ...request,
            status: RequestStatusEnum.OPEN
        });
    }
    const handleCancel = async () => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/cancel`, {}, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        setConfirmCancel(false);
        setRequest({
            ...request,
            status: RequestStatusEnum.CANCELED
        });
    }

    const handleReview = async (data: ReviewPayload) => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/review`, data, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        setOpenReview(false);
    }

    const handleSave = async (data: RequestPayload) => {
        setIsLoading(true);
        const response = await apiService.put(`/requests/${request.id}`, data, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
    
        setOpenModal(false);
    }

    const handleOpenProfile = (userName: string) => {
        if (user?.username === userName) {
            navigate('/app/profile');
            return;
        }
        navigate(`/app/user/${userName}`);
    }

    const isBeneficiary = user?.type === UserTypeEnum.BENEFICIARY;

    return (
        <div>
            <header>
                <h2 >{request.title}</h2>
            </header>
            <article className="request-page">
                <header className="request-page__header">
                    <div className="request-page__owner" onClick={() => handleOpenProfile(request.beneficiary!.username)}>
                        <Avatar user={request.beneficiary} />
                        <span>{request.beneficiary.username}</span>
                    </div>
                </header>
                {request.description && <blockquote className="request-page__description">{request.description}</blockquote>}
                <ul className="request-page__details">
                    <li><b>Location:</b> {request.location}</li>
                    <li><b>Urgency:</b> <UrgencyBadge urgency={request.urgency} /></li>
                    <li><b>Status:</b> <StatusBadge status={request.status} /></li>
                    {request.volunteer && <li>
                        <b>Volunteer:</b>
                        <div className="request-page__volunteer" onClick={() => handleOpenProfile(request.volunteer!.username)}>
                            <Avatar user={request.volunteer} />
                            <span>{request.volunteer.username}</span>
                        </div>
                    </li>}
                </ul>
                <footer className="request-page__actions">
                    <time>{new Date(request.created_at).toLocaleString()}</time>
                    {isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                        <button onClick={() => setOpenModal(true)}>Edit</button>
                    )}
                    {!isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                        <button onClick={() => setConfirmAccept(true)}>Accept</button>
                    )}
                    {isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                        <button onClick={() => setConfirmCancel(true)} className="outline danger-btn">Cancel</button>
                    )}
                    {!isBeneficiary && request.status === RequestStatusEnum.IN_PROGRESS && (
                        <button onClick={() => setConfirmComplete(true)}>Complete</button>
                    )}
                    {request.status === RequestStatusEnum.IN_PROGRESS && (
                        <button onClick={() => setConfirmReject(true)} className="outline danger-btn">Reject</button>
                    )}
                    {request.status === RequestStatusEnum.DONE && (
                        <button onClick={() => setOpenReview(true)}>Review</button>
                    )}
                </footer>
                {openModal && <RequestFormModal onClose={() => setOpenModal(false)} onSubmit={handleSave} open request={request} />}
                {openReview && <ReviewModal open value={DEFAULT_REVIEW} onClose={() => setOpenReview(false)} onSubmit={handleReview} />}
                {confirmAccept && <ConfirmModal message="Are you sure?" onClose={() => setConfirmAccept(false)} onConfirm={handleAccept} open />}
                {confirmReject && <ConfirmModal message="Are you sure?" onClose={() => setConfirmReject(false)} onConfirm={handleReject} open />}
                {confirmCancel && <ConfirmModal message="Are you sure?" onClose={() => setConfirmCancel(false)} onConfirm={handleCancel} open />}
                {confirmComplete && <ReviewModal open value={DEFAULT_REVIEW} onClose={() => setConfirmComplete(false)} onSkip={handleSkipReview} onSubmit={handleComplete} />}
                

            </article>
        </div>
    );
}

export default RequestPage;