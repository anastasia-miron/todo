import clsx from "clsx";
import React, { useMemo } from "react";
import { StarIcon } from "lucide-react";
import './Rating.css';

interface Props {
    maxValue?: number;
    value: number;
    onChange?: (val: number) => unknown;
    readOnly?: boolean;
    className?: string;
}

const Rating: React.FC<Props> = (props) => {
    const {value, onChange = () => {}, className, maxValue = 5, readOnly} = props;
    const values = useMemo(() => Array(maxValue).fill(null).map((_, idx) => idx + 1), [maxValue]);

    const handleChange = (val: number) => {
        if(readOnly) return false;
        onChange(val === value ? 0 : val);
    }

    return (<div className={clsx(className, 'rating-input')}>
        {values.map(star => <div key={star} className="rating-input__star" onClick={() => handleChange(star)}>
            <StarIcon className={clsx('rating-input__star', star <= value ? 'rating-input__star--on' : 'rating-input__star--off')}/>  
        </div>)}
    </div>)
}

export default Rating;