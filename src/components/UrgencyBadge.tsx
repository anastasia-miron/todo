import React from "react";
import { RequestUrgencyEnum } from "../typings/models";
import "./UrgencyBadge.css";
import clsx from "clsx";

interface Props {
    urgency: RequestUrgencyEnum; 
}

const textMap: Record<RequestUrgencyEnum, string> = {
    [RequestUrgencyEnum.HIGH]: 'Ridicată',
    [RequestUrgencyEnum.MEDIUM]: 'Medie',
    [RequestUrgencyEnum.LOW]: 'Scăzută',

}
const UrgencyBadge: React.FC<Props> = (props) => {
     const { urgency } = props;
     return <span className={clsx('urgency-badge', `urgency-${urgency.toLowerCase()}`)}>{textMap[urgency]}</span>;
};

export default UrgencyBadge;
