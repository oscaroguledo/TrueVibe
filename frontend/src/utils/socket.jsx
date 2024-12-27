import { useEffect, useRef, useState } from "react";
import io from "socket.io-client"; // Import socket.io-client for WebSocket connection

const ConnectSocket =({sockerUrl})=>{
    const [messages, setMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState({ icon: 'fa-user', text: 'Profiles' });
    const [name, setName] = useState(null);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const onceRef = useRef(false);

    useEffect(() => {
        setMessages([]);
        socket?.emit("join", currentRoom.text);
        }, [currentRoom.text,socket]);
  
    useEffect(() => {
        if (onceRef.current) {
            return;
        }
    
        onceRef.current = true;
    
        const socket = io(sockerUrl);
        setSocket(socket);
    
        socket.on("connect", () => {
            console.log("Connected to socket server");
            setName(`anon-${socket.id}`);
            setConnected(true);
            console.log("joining room", currentRoom.text);
    
            socket.emit("join", currentRoom.text);
        });
    
        socket.on("message", (msg) => {
            console.log("Message received", msg);
            msg.date = new Date(msg.date);
            setMessages((messages) => [msg,...messages]);
        });
    
        socket.on("messages", (msgs) => {
            console.log("Messages received", msgs);
            let messages = msgs.messages.map((msg) => {
            msg.date = new Date(msg.date);
            return msg;
            });
            setMessages(messages);
        });
        }, []);

      return {socket:socket,messages:messages}
}
export default ConnectSocket