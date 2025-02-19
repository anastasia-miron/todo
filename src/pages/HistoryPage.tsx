import React, { useEffect, useState } from "react";
import apiService from "../services/api.service";
import RequestList from "../components/RequestList";
import { RequestModel, RequestStatusEnum } from "../typings/models";
import useAbortSignal from "../hooks/useAbortSignal";

const HistoryPage: React.FC = () => {
    const [requests, setRequests] = useState<RequestModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const signal = useAbortSignal();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const response = await apiService.get<RequestModel[]>(`/requests/history`, { signal });
            if (signal.aborted) return;
            setIsLoading(false);
            if (response.success) {
                const filteredRequests = response.data.filter(
                    request => request.status === RequestStatusEnum.DONE
                );
                setRequests(filteredRequests);
            }
        })();
    }, []);

    return (
        <div>
            <header role="group">
            <h2>Requests history</h2>
            </header>
            <RequestList data={requests} isLoading={isLoading} onChange={() => {}} />
        </div>
    )
}






export default HistoryPage