import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  id: string;
  coach: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  userId: string; // 添加用戶ID字段
}

interface MessageContextType {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (messageId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children, userId }: { children: ReactNode; userId: string }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(`messages_${userId}`);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [];
  });

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };

    setMessages(prevMessages => {
      const newMessages = [newMessage, ...prevMessages];
      localStorage.setItem(`messages_${userId}`, JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const markAsRead = (messageId: string) => {
    setMessages(prevMessages => {
      const newMessages = prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      );
      localStorage.setItem(`messages_${userId}`, JSON.stringify(newMessages));
      return newMessages;
    });
  };

  return (
    <MessageContext.Provider value={{ messages, addMessage, markAsRead }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
} 