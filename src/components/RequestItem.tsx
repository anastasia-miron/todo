import React, { useState } from "react";
import { RequestModel, RequestStatusEnum, UserTypeEnum } from "../typings/models";
import './RequestItem.css';
import apiService from "../services/api.service";
import useAbortSignal from "../hooks/useAbortSignal";
import { toast } from "react-toastify";
import RequestFormModal from "./RequestFormModal";
import { RequestPayload } from "../typings/types";
import useCurrentUser from "../hooks/useCurrentUser";


interface RequestItemProps {
    request: RequestModel;
    onChange: (data: RequestModel) => unknown;
}

const RequestItem: React.FC<RequestItemProps> = (props) => {
    const { request, onChange } = props;
    const signal = useAbortSignal();
    const { user } = useCurrentUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleAccept = async () => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/accept`, {}, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        onChange({
            ...request,
            status: RequestStatusEnum.IN_PROGRESS
        });
        setOpenModal(false);
    
     }


    const handleComplete = async () => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/complete`, {}, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return
        }
        onChange({
            ...request,
            status: RequestStatusEnum.DONE
        });
    };

    const handleReject = async () => {
        setIsLoading(true);
        const response = await apiService.post(`/requests/${request.id}/reject`, {}, { signal });
        if (signal.aborted) return;
        setIsLoading(false);
        if (!response.success) {
            toast.error(response.message);
            return;
        }
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
        onChange({
            ...request,
            status: RequestStatusEnum.CANCELED
        });
    
    }
    const handleReview = async () => {
      // Show review Modal
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
        onChange({
            ...request,
            ...data
        });
        setOpenModal(false);
    }

    const isBeneficiary = user?.type === UserTypeEnum.BENEFICIARY

    return (
        <article className="request-item">
            <header className="request-item__owner">
                <img src={request.beneficiary_profile_img} alt="Beneficiary" width="32" height="32" className="request-item__owner-avatar" />
                <span>{request.beneficiary_name}</span>
            </header>
            {request.title && <h3>{request.title}</h3>}
            {request.description && <p className="request-item__description">{request.description}</p>}
            <ul className="request-item__details">
                <li><b>Location</b>: {request.location}</li>
                <li><b>Urgency</b>: {request.urgency.toUpperCase()}</li>
                <li><b>Status</b>: {request.status.toUpperCase()}</li>
            </ul>
            <footer className="request-item__actions grid">
                {isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                    <button onClick={() => setOpenModal(true)}>Edit</button>
                )}
                {!isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                    <button onClick={handleAccept}>Accept</button>
                )}
                {isBeneficiary && request.status === RequestStatusEnum.OPEN && (
                    <button onClick={handleCancel}>Cancel</button>
                )}
                {!isBeneficiary && request.status === RequestStatusEnum.IN_PROGRESS && (
                    <button onClick={handleComplete}>Complete</button>
                )}
                {!isBeneficiary && request.status === RequestStatusEnum.IN_PROGRESS && (
                    <button onClick={handleReject} className="outline">Reject</button>
                )}
                {request.status === RequestStatusEnum.DONE && (
                    <button onClick={handleReview}>Review</button>
                )}




            </footer>
            {openModal && <RequestFormModal onClose={() => setOpenModal(false)} onSubmit={handleSave} open request={request} />}
        </article>
    );
};


export default RequestItem; 
