import { useState, useEffect, useRef } from "react";
import io from "socket.io-client"; // Import socket.io-client for WebSocket connection

const useSocket = ({ room, websocketurl }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState(null);
  const onceRef = useRef(false);

  // Function to setup the socket and listen to events
  const setupSocket = () => {
    if (onceRef.current) return;

    onceRef.current = true;

    const socket = io(websocketurl || "ws://localhost:8080");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected to socket server");
      setName(`anon-${socket.id}`);
      setConnected(true);
      console.log("Joining room", room);
      socket.emit("join", room);
    });

    socket.on("message", (msg) => {
      console.log("Message received", msg);
      msg.date = new Date(msg.date);
      setMessages((prevMessages) => [msg, ...prevMessages]);
    });

    socket.on("messages", (msgs) => {
      console.log("Messages received", msgs);
      const updatedMessages = msgs.messages.map((msg) => {
        msg.date = new Date(msg.date);
        return msg;
      });
      setMessages(updatedMessages);
    });

    return socket;
  };

  useEffect(() => {
    const socketInstance = setupSocket();

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [room, websocketurl]);

  const sendMessage = (message) => {
    console.log("Sending message:", message);
    socket?.emit("message", { text: message, room });
  };

  return { messages, sendMessage, socket };
};

export default useSocket;
