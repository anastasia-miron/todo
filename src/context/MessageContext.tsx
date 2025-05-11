import React, { createContext, useContext, useState, ReactNode } from "react";
import { MessageRecievedPayload } from "../typings/types";

interface MessageContextValue {
  messages: MessageRecievedPayload[];
  setMessages: React.Dispatch<React.SetStateAction<MessageRecievedPayload[]>>;
}

const MessagesContext = createContext<MessageContextValue>({
  messages: [],
  setMessages: () => {},
});

export function MessagesProvider({
  children,
  initialMessages,
}: {
  children: ReactNode;
  initialMessages: MessageRecievedPayload[];
}) {
  const [messages, setMessages] =
    useState<MessageRecievedPayload[]>(initialMessages);

  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}
