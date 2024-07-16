import { createContext, useState } from "react";

export interface ChatUser {
    name: string,
    status: 'online' | 'offline'
}

export interface ChatContextType {
    chatUsers: ChatUser[];
}

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([
        {
            name: "Dominik",
            status: 'offline',
        },
        {
            name: "Agnieszka",
            status: 'offline',
        },
        {
            name: "Michał",
            status: 'online',
        },
        {
            name: "Piotrek",
            status: 'offline',
        },
    ])
    return <ChatContext.Provider value={{chatUsers}}>{children}</ChatContext.Provider>
}

export default ChatProvider;