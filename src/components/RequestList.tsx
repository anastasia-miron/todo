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
        {data.length === 0 && (<div className="requests-list__no-results">
            <img src="/no-results.svg" />
            <h3>Nu sunt cereri disponibile</h3>
        </div>)}
    </div>)
}

export default RequestList;