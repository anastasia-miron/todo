import React, { FormEvent, useEffect, useLayoutEffect, useState } from "react";
import apiService from "../services/api.service";
import useCurrentUser from "../hooks/useCurrentUser";
import { RequestModel, MessageModel } from "../typings/models";
import useAbortSignal from "../hooks/useAbortSignal";
import { useParams } from "react-router";
import UserMessageItem from "./UserMessageItem";
import SystemMessageItem from "./SystemMessageItem";
import { SendHorizontalIcon } from "lucide-react";
import "./RequestMessage.css";
import { useEventSource } from "../hooks/useEvenetSource";


interface Props {
  request: RequestModel;
}
const RequestMessage: React.FC<Props> = (props) => {
  const { request } = props;
  const { id } = useParams();
  const { user } = useCurrentUser();
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const signal = useAbortSignal();
  useEventSource(
    `/sse/${id!}`,
    "message",
    (ev) => {
      try {
        const payload = JSON.parse(ev.data) as { message: MessageModel };
        addMessage(payload.message);
      } catch (e) {
        console.error(e);
      }
    }
  );
  

  const addMessage = (msg: MessageModel) => {
    setMessages((prev) => {
      const isAdded = prev.some((m) => m.id === msg.id);
      return isAdded ? prev : [...prev, msg];
    });
  };

  useLayoutEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await apiService.get<MessageModel[]>(
        `/requests/${id}/messages`,
        { signal }
      );
      if (signal.aborted) return;
      setIsLoading(false);
      if (response.success) {
        setMessages(response.data);
      }
    })();
  }, [id]);

  const handleSendMessages = async (ev: FormEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    const response = await apiService.post<MessageModel>(
      `/requests/${id}/messages`,
      { content },
      { signal }
    );
    if (signal.aborted) return;
    if (response.success) {
      addMessage(response.data);
      setContent("");
    }
  };

  const canSendMessage =
    user!.id === request.beneficiary_id || user!.id === request.volunteer_id;

  return (
    <article>
      <header className="messages-header">Activity</header>
      <div className="messages-list" aria-busy={isLoading}>
        {messages.map((message) =>
          message.isSystem ? (
            <SystemMessageItem key={message.id} message={message} />
          ) : (
            <UserMessageItem key={message.id} message={message} />
          )
        )}
      </div>
      {canSendMessage && (
        <div className="message-input">
          <form
            onSubmit={handleSendMessages}
            className="message-input__container"
            role="group"
          >
            <input
              type="text"
              required
              value={content}
              onChange={(ev) => setContent(ev.target.value)}
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="outline contrast message-input__button"
              disabled={content.length === 0}
            >
              <SendHorizontalIcon />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default RequestMessage;
