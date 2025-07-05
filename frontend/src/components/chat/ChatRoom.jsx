import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";

const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL);

const getRoomId = (user1, user2) => {
  return [user1, user2].sort().join("_");
};

const ChatRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUserId, chatWithUserId, chatWithUserName, currentUserRole } =
    location.state || {};
  const roomId = getRoomId(currentUserId, chatWithUserId);
  const messagesEndRef = useRef();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (performance.navigation.type !== 1) {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (!currentUserId || !chatWithUserId) {
      toast.error("Invalid chat session");
      navigate(-1);
    }
  }, [currentUserId, chatWithUserId]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    const handleReceiveMessage = ({ sender, message }) => {
      if (sender !== currentUserId) {
        setMessages((prev) => [...prev, { sender, message }]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [roomId, currentUserId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = { sender: currentUserId, message };
    socket.emit("privateMessage", { roomId, ...msgData });
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen w-screen flex flex-col bg-white relative overflow-hidden">
      {/* Header - Fixed */}
      <div className="bg-indigo-600 text-white text-lg font-semibold text-center py-4 fixed top-15 w-full z-10 shadow-md">
        {currentUserRole === "owner"
          ? `Chat with Renter: ${chatWithUserName}`
          : `Chat with Owner: ${chatWithUserName}`}
      </div>

      {/* Chat Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-24 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm shadow-md my-1 ${
                msg.sender === currentUserId
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom */}
      <div className="fixed bottom-0 w-full bg-white p-3 border-t flex gap-2 z-10">
        <input
          type="text"
          className="flex-1 p-2 border rounded focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
