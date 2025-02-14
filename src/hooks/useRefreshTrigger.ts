import { useState } from "react"

const useRefreshTrigger = () => {
    const [trigger, setTrigger] = useState<number>(1);
    return {
        trigger,
        mutate: () => setTrigger(prev => prev+1)
    }
};

export default useRefreshTrigger;