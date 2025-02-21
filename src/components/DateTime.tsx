import React from "react";
import {DateTime as Luxon } from 'luxon';

const getFormat = (props: {timeOnly: boolean, dateOnly: boolean}) => {
    if(props.timeOnly) return "HH:mm:ss";
    if(props.dateOnly) return "YYYY-MM-DD"
    return "yyyy-MM-dd HH:mm:ss"
}

interface Props {
    value: string;
    dateOnly?: boolean;
    timeOnly?: boolean;
    className?: string;
}

const DateTime: React.FC<Props> = (props) => {
    const {value, dateOnly = false, timeOnly = false, className} = props;
    const dateString = Luxon.fromISO(value).toFormat(getFormat({dateOnly, timeOnly}));
    return <span className={className}>{dateString}</span>
};

export default DateTime;