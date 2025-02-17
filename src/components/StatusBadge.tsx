import React from "react";
import { RequestStatusEnum } from "../typings/models";
import "./StatusBadge.css";
import clsx from "clsx";

interface Props {
    status: RequestStatusEnum;
    className?: string;
}

const textMap: Record<RequestStatusEnum, string> = {
    [RequestStatusEnum.CANCELED]: 'Canceled',
    [RequestStatusEnum.DONE]: 'Done',
    [RequestStatusEnum.IN_PROGRESS]: 'In progress',
    [RequestStatusEnum.OPEN]: 'Open',

}
const StatusBadge: React.FC<Props> = (props) => {
    const { status, className } = props;
    return <span className={clsx('status-badge', `status-${status.toLowerCase()}`, className)}>{textMap[status]}</span>;
};

export default StatusBadge;
