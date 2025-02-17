import React, { useState } from "react";
import { RequestModel, RequestStatusEnum, UserTypeEnum } from "../typings/models";
import './RequestItem.css';
import apiService from "../services/api.service";
import useAbortSignal from "../hooks/useAbortSignal";
import { toast } from "react-toastify";
import RequestFormModal from "./RequestFormModal";
import { RequestPayload } from "../typings/types";
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
    const [openModal, setOpenModal] = useState<boolean>(false);
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
                <div className="request-item__owner" onClick={() => handleOpenProfile(request.beneficiary!.username)}>
                    <Avatar user={request.beneficiary} />
                    <span>{request.beneficiary.username}</span>
                </div>
                <EyeIcon onClick={handleView} className="request-item__view" />
            </header>
            {request.title && <h3 className="request-item__title">
                {request.title}
            </h3>}
            {request.description && <p className="request-item__description">{request.description}</p>}

            <footer className="request-item__actions grid">
                <StatusBadge status={request.status} className="request-item__status" /> 
                {!isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                    <button onClick={() => setConfirmAccept(true)}>Accept</button>
                )}
                {isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                    <button onClick={() => setConfirmCancel(true)}>Cancel</button>
                )}
                {!isBeneficiary && request.status === RequestStatusEnum.IN_PROGRESS && (
                    <button onClick={() => setConfirmReject(true)} className="outline">Reject</button>
                )}
            </footer>
            {confirmAccept && <ConfirmModal message="Are you sure?" onClose={() => setConfirmAccept(false)} onConfirm={handleAccept} open />}
            {confirmReject && <ConfirmModal message="Are you sure?" onClose={() => setConfirmReject(false)} onConfirm={handleReject} open />}
            {confirmCancel && <ConfirmModal message="Are you sure?" onClose={() => setConfirmCancel(false)} onConfirm={handleCancel} open />}
        </article>
    );
};


export default RequestItem; 
