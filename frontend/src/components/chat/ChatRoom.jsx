import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";

// ✅ Backend URL
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

  // 🚫 Redirect if data is missing
  useEffect(() => {
    if (!currentUserId || !chatWithUserId) {
      toast.error("Invalid chat session");
      navigate(-1);
    }
  }, [currentUserId, chatWithUserId]);

  //  Join room & receive messages
  useEffect(() => {
    socket.emit("joinRoom", roomId);
    // console.log(`🟢 Joined Room: ${roomId}`);

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

    // Only push message once to sender's side
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-2xl mx-auto my-6 border rounded-lg shadow-md h-[500px] flex flex-col bg-white">
      <div className="bg-indigo-600 text-white p-4 text-lg font-semibold rounded-t-lg text-center">
        {currentUserRole === "owner"
          ? `Chat with Renter: ${chatWithUserName}`
          : `Chat with Owner: ${chatWithUserName}`}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] text-sm shadow-md ${
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

      {/* Message Input */}
      <div className="p-3 border-t flex gap-2">
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
