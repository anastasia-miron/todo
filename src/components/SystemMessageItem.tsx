import React from "react";
import { MessageModel } from "../typings/models";

interface Props {
    message: MessageModel;
}

const SystemMessageItem: React.FC<Props> = ({ message }) => {
    return (
        <div className="message-system">
            <span>{message.content}</span>
            <time>{message.timestamp}</time>
        </div>
    );
};

export default SystemMessageItem;
