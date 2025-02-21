import React from "react";
import { MessageModel } from "../typings/models";
import './SystemMessageItem.css'
import DateTime from "./DateTime";

interface Props {
    message: MessageModel;
}

const SystemMessageItem: React.FC<Props> = ({ message }) => {
    return (
        <div className="message-system">
            <span>{message.content}</span>
            <DateTime value={message.timestamp}/>
        </div>
    );
};

export default SystemMessageItem;
