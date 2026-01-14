import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { 
  Send, 
  ArrowLeft, 
  User, 
  Paperclip, 
  Smile,
  MoreVertical 
} from "lucide-react";

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
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef();

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
        setMessages((prev) => [...prev, { sender, message, timestamp: new Date() }]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [roomId, currentUserId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = { 
      sender: currentUserId, 
      message,
      timestamp: new Date()
    };
    socket.emit("privateMessage", { roomId, ...msgData });
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set typing indicator
    setIsTyping(true);
    
    // Emit typing event to server (you need to implement this on backend)
    // socket.emit("typing", { roomId, userId: currentUserId });
    
    // Clear typing indicator after 1 second of no typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const MessageBubble = ({ msg, isOwn }) => (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className="flex max-w-[80%]">
        {!isOwn && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1">
            {chatWithUserName?.charAt(0) || "U"}
          </div>
        )}
        <div>
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isOwn
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-md"
                : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <p
              className={`text-xs mt-1 ${
                isOwn ? "text-blue-100" : "text-gray-400"
              }`}
            >
              {formatTime(msg.timestamp)}
            </p>
          </div>
          {!isOwn && (
            <p className="text-xs text-gray-500 mt-1 ml-1">
              {chatWithUserName}
            </p>
          )}
        </div>
        {isOwn && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold ml-2 mt-1">
            {localStorage.getItem("username")?.charAt(0) || "Y"}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Header - Fixed with glass effect */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-gray-200 py-4 fixed top-0 w-full z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                  {chatWithUserName?.charAt(0) || "U"}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{chatWithUserName}</h2>
                <p className="text-sm text-gray-500">
                  {isTyping ? (
                    <span className="text-blue-500 flex items-center">
                      <span className="flex space-x-1">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse delay-150">●</span>
                        <span className="animate-pulse delay-300">●</span>
                      </span>
                      <span className="ml-2">Typing...</span>
                    </span>
                  ) : (
                    "Online"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block px-3 py-1.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium shadow-sm">
              <span className="text-gray-500">You: </span>
              {localStorage.getItem("username")}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 pt-24 pb-28">
        <div className="max-w-4xl mx-auto">
          {/* Date Separator */}
          <div className="flex justify-center my-6">
            <div className="px-4 py-1.5 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-xs text-gray-500 font-medium shadow-sm">
              Today
            </div>
          </div>

          {/* Messages */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 max-w-md">
                Send your first message to {chatWithUserName}. Your messages will appear here.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble
                key={index}
                msg={msg}
                isOwn={msg.sender === currentUserId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 py-3 px-4 z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full p-3 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-200"
                value={message}
                onChange={handleTyping}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message here..."
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`p-3 rounded-full transition-all duration-200 shadow-sm ${
                message.trim()
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 active:scale-95"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
            >
              <Send className={`w-5 h-5 ${message.trim() ? "text-white" : "text-gray-400"}`} />
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Press Enter to send • Your messages are end-to-end encrypted
          </p>
        </div>
      </div>

      {/* Floating User Info Card */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 max-w-4xl w-full px-4">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chatting as:</p>
              <p className="font-medium text-gray-800">
                {currentUserRole === "owner" ? "Property Owner" : "Renter"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Room ID:</p>
              <p className="font-mono text-xs text-gray-500">{roomId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;