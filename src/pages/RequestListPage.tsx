import React, { useEffect, useState } from "react";
import apiService from "../services/api.service";
import RequestList from "../components/RequestList";
import { RequestModel, UserTypeEnum } from "../typings/models";
import RequestFormModal from "../components/RequestFormModal";
import { RequestPayload } from "../typings/types";
import useAbortSignal from "../hooks/useAbortSignal";
import useCurrentUser from "../hooks/useCurrentUser";
import useRefreshTrigger from "../hooks/useRefreshTrigger";
import { toast } from "react-toastify";
import './RequestListPage.css';

const RequestListPage: React.FC = () => {
    const { user } = useCurrentUser()
    const [tab, setTab] = useState<'list' | 'my'>('list');
    const { trigger, mutate } = useRefreshTrigger();
    const [list, setList] = useState<RequestModel[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const signal = useAbortSignal()

    useEffect(() => {
        // Request to API
        (async () => {
            setIsLoading(true);
            const response = await apiService.get<RequestModel[]>(`/requests`, { signal });
            if (signal.aborted) return;
            setIsLoading(false);
            if (response.success) {
                console.log('check rows data',response.data)
                setList(response.data);
            }
        })()
    }, [tab, trigger])

    const handleSave = async (data: RequestPayload) => {
        console.log('check the data which i get')
        const response = await apiService.post('/requests', data, { signal });
        if (signal.aborted) return;
        if (!response.success) {
            toast.error(response.message);
            return;
        }
        setOpenModal(false);
        mutate();
    }

    const handleChanges = (request: RequestModel) => {
        setList(prev => {
            return prev.map(item => item.id === request.id ? request : item);
        });
        mutate();
    };

    const filteredList = list.filter(request => {
        if (user?.type === UserTypeEnum.BENEFICIARY) {
            return request.beneficiary.id === user.id;
        }

        if (user?.type === UserTypeEnum.VOLUNTEER) {
            if (tab === "list") return !request.volunteer;
            if (tab === "my") return request.volunteer?.id === user.id;
        }

        return false;
    });

    if (!user) {
        return null;
    }

    return (
        <div>
            <header role="group">
                {user?.type === UserTypeEnum.VOLUNTEER ? <><button
                    onClick={() => setTab('list')}
                    aria-current={tab === 'list'}
                >
                    Requests
                </button>
                    <button
                        onClick={() => setTab('my')}
                        aria-current={tab === 'my'}
                    >
                        My Requests
                    </button></> :
                    <h2>My Requests</h2>}
            </header>
            <RequestList data={filteredList} isLoading={isLoading} onChange={handleChanges} />
            {user?.type === UserTypeEnum.BENEFICIARY && (
                <footer className="request-list__actions" data-tooltip={user?.isVerified ? null : "You must be verified to add a request!"}>
                    <button
                        onClick={() => setOpenModal(true)}
                        disabled={!user?.isVerified}>
                        Add Request
                    </button>
                </footer>
            )}
            {openModal && <RequestFormModal onClose={() => setOpenModal(false)} onSubmit={handleSave} open />}
        </div>
    );
}

export default RequestListPage


