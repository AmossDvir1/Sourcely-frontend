import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

// Define the shape of a message for type safety
export interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

// Define the props our hook will accept
interface UseChatSocketProps {
  sessionId: string;
  isReady: boolean; // Only connect when indexing is ready
}
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useChatSocket = ({ sessionId, isReady }: UseChatSocketProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Only establish connection if the session is ready and we haven't connected yet.
    if (isReady && sessionId && !socketRef.current) {
      // --- DYNAMIC URL LOGIC ---
      // Socket.IO needs a standard HTTP/HTTPS URL for the initial handshake.
      const socket = io(baseURL, {
        path: "/ws/socket.io/", // Standard path for Socket.IO
        transports: ["websocket"],
        query: {
          sessionId: sessionId,
        },
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket.IO connected successfully");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket.IO disconnected");
        setIsConnected(false);
      });

      // The event name 'message' is the default for standard WebSockets
      socket.on("message", (data: string) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.sender === "bot") {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...lastMessage,
              text: lastMessage.text + data,
            };
            return updatedMessages;
          } else {
            return [...prev, { id: Date.now(), text: data, sender: "bot" }];
          }
        });
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [isReady, sessionId]);

  const sendMessage = (text: string) => {
    if (text.trim() && socketRef.current?.connected) {
      const userMessage: Message = { id: Date.now(), text, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      socketRef.current.emit("message", text);
    }
  };

  return { messages, isConnected, sendMessage };
};
