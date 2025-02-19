import React, { useState } from "react";
import { RequestModel, RequestStatusEnum, UserTypeEnum } from "../typings/models";
import './RequestItem.css';
import apiService from "../services/api.service";
import useAbortSignal from "../hooks/useAbortSignal";
import { toast } from "react-toastify";
import useCurrentUser from "../hooks/useCurrentUser";
import Avatar from "./Avatar";
import { useNavigate } from "react-router";
import ConfirmModal from "./ConfirmModal";
import { EyeIcon } from "lucide-react";
import StatusBadge from "./StatusBadge";



interface RequestItemProps {
    request: RequestModel;
    onChange: (data: RequestModel) => unknown;
}

const RequestItem: React.FC<RequestItemProps> = (props) => {
    const { request, onChange } = props;
    const signal = useAbortSignal();
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmAccept, setConfirmAccept] = useState<boolean>(false);
    const [confirmReject, setConfirmReject] = useState<boolean>(false);
    const [confirmCancel, setConfirmCancel] = useState<boolean>(false);
    // const [openModal, setOpenModal] = useState<boolean>(false);

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
        onChange({
            ...request,
            status: RequestStatusEnum.IN_PROGRESS
        });
        navigate(`/app/requests/${request.id}`)
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
        onChange({
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
        onChange({
            ...request,
            status: RequestStatusEnum.CANCELED
        });
    }


    const handleOpenProfile = (userName: string) => {
        if (user?.username === userName) {
            navigate('/app/profile');
            return;
        }
        navigate(`/app/user/${userName}`);
    }

    const handleView = () => {
        navigate(`/app/requests/${request.id}`);
    }

    const isBeneficiary = user?.type === UserTypeEnum.BENEFICIARY;

    return (
        <article className="request-item">
            <header className="request-item__header">
                <h3 className="request-item__title">
                    {request.title}
                </h3>
                <EyeIcon onClick={handleView} className="request-item__view" />
            </header>
            {request.description && <blockquote className="request-item__description">{request.description}</blockquote>}
            <div className="request-item__actors">
                <div className="request-item__actor">
                    <strong>Beneficiary:</strong>
                    <div className="request-item__owner" onClick={() => handleOpenProfile(request.beneficiary.username)}>
                        <Avatar user={request.beneficiary} />
                        <span>{request.beneficiary.username}</span>
                    </div>
                </div>

                {request.volunteer && <div className="request-item__actor">
                    <strong>Volunteer:</strong>
                    <div className="request-item__volunteer" onClick={() => handleOpenProfile(request.volunteer!.username)}>
                        <Avatar user={request.volunteer} />
                        <span>{request.volunteer.username}</span>
                    </div>
                </div>}
            </div>




            <footer className="request-item__actions grid">
                
                <StatusBadge status={request.status} className="request-item__status" />
                {!isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                    <button onClick={() => setConfirmAccept(true)}>Accept</button>
                )}
                {isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                    <button onClick={() => setConfirmCancel(true)} className="outline danger-btn">Cancel</button>
                )}
                {request.status === RequestStatusEnum.IN_PROGRESS && (
                    <button onClick={() => setConfirmReject(true)} className="outline danger-btn">Reject</button>
                )}
            </footer>
            {confirmAccept && <ConfirmModal message="Are you sure?" onClose={() => setConfirmAccept(false)} onConfirm={handleAccept} open />}
            {confirmReject && <ConfirmModal message="Are you sure?" onClose={() => setConfirmReject(false)} onConfirm={handleReject} open />}
            {confirmCancel && <ConfirmModal message="Are you sure?" onClose={() => setConfirmCancel(false)} onConfirm={handleCancel} open />}
        </article>
    );
};


export default RequestItem; 
