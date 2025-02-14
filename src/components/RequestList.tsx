import React from "react";
import { RequestModel } from "../typings/models";
import RequestItem from "./RequestItem";
import './RequestList.css';

interface Props {
    data: RequestModel[];
    isLoading: boolean;
    onChange: (data: RequestModel) => unknown;
}

const RequestList: React.FC<Props> = props => {
    const {data, isLoading, onChange} = props;

    return (<div aria-busy={isLoading} className="request-list">
        {data.map(item => (<RequestItem request={item} key={item.id} onChange={onChange} />))}
    </div>)
}

export default RequestList;