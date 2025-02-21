import React from "react";
import { MessageModel } from "../typings/models";
import Avatar from "./Avatar";
import useCurrentUser from "../hooks/useCurrentUser";
import "./UserMessageItem.css"
import DateTime from "./DateTime";

interface Props {
    message: MessageModel;
}

const UserMessageItem: React.FC<Props> = ({ message }) => {
    const { user } = useCurrentUser();
    const messageUser = message.user!;
    const isCurrentUser = user?.id === messageUser.id;
  
    return (
        <div className={`message-item ${isCurrentUser ? "message-item--right" : "message-item--left"}`}>
            {!isCurrentUser && <Avatar user={messageUser} className="message-avatar" />}
            <div className="message-box">
                <span className="message-content">{message.content}</span>
                <DateTime value={message.timestamp} className="message-time" />
            </div>
            {isCurrentUser && <Avatar user={messageUser} className="message-avatar" />}
        </div>
    );
};

export default UserMessageItem;