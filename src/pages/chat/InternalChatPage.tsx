import React, { useState, useEffect, useRef } from "react";
import {
  SendIcon,
  PhoneIcon,
  PaperclipIcon,
  SmileIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  MousePointer2Icon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  ChevronDownIcon,
  BellIcon,
  Settings2Icon,
  PlusIcon,
  MicIcon,
  InfoIcon,
} from "lucide-react";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import { useNavigate } from "react-router-dom";
import {
  getMediaImage,
  getMimeType,
  parseCustomDateString,
} from "../../services/utils";
import chatImg from "../../assets/chat.png";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Sidebar.css";
import ConversationItem from "./ConversationItem";
import { DateDivider, MessageItem } from "./MessageItem";
import { DocumentItem, FileModal, FileTypeIcon } from "./FileComponents";

interface Message {
  id: number;
  sender: { fullName: string };
  content: string;
  document?: string;
  createdDate: string;
  isOwner: boolean;
  status?: "sending" | "sent" | "delivered" | "read";
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: {
    sender: { fullName: string };
    content: string;
    document?: string;
    createdDate: string;
  };
  avatar: string;
  online?: boolean;
  unread?: number;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    name: "Đức Trọng",
    lastMessage: {
      sender: { fullName: "Đức Trọng" },
      content: "Chào bạn, hôm nay thế nào?",
      document:
        '[{"name":"key_information_10042025153341.txt","url":"1744299234144/key_information_10042025153341.txt"}]',
      createdDate: "20/09/2023 10:30:00",
    },
    avatar: "https://via.placeholder.com/40",
    online: true,
    unread: 3,
  },
  {
    id: 2,
    name: "Minh Châu",
    lastMessage: {
      sender: { fullName: "Minh Châu" },
      content: "Gửi bạn file kế hoạch nhé!",
      document:
        '[{"name":"project_plan_roadmap.pdf","url":"1744299234144/project_plan_roadmap.pdf"}]',
      createdDate: "15/11/2023 08:15:00",
    },
    avatar: "https://via.placeholder.com/40",
    online: true,
  },
  {
    id: 3,
    name: "Trần Phong",
    lastMessage: {
      sender: { fullName: "Trần Phong" },
      content: "File báo cáo tài chính đây.",
      document:
        '[{"name":"financial_report_Q1.xlsx","url":"1744299234144/financial_report_Q1.xlsx"}]',
      createdDate: "02/01/2024 14:45:00",
    },
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 4,
    name: "Thu Hằng",
    lastMessage: {
      sender: { fullName: "Thu Hằng" },
      content: "Ảnh team hôm trước nè 😄",
      document:
        '[{"name":"team_photo.jpg","url":"1744299234144/team_photo.jpg"}]',
      createdDate: "08/03/2024 17:22:00",
    },
    avatar: "https://via.placeholder.com/40",
    online: true,
    unread: 1,
  },
  {
    id: 5,
    name: "Lê Tùng",
    lastMessage: {
      sender: { fullName: "Lê Tùng" },
      content: "Đây là video giới thiệu sản phẩm",
      document:
        '[{"name":"intro_video.mp4","url":"1744299234144/intro_video.mp4"}]',
      createdDate: "28/02/2024 09:10:00",
    },
    avatar: "https://via.placeholder.com/40",
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: { fullName: "Đức Trọng" },
    content: "Chào bạn, hôm nay thế nào?",
    document:
      '[{"name":"key_information_10042025153341.txt","url":"1744299234144/key_information_10042025153341.txt"}]',
    createdDate: "20/09/2023 10:30:00",
    isOwner: false,
    status: "read",
  },
  {
    id: 2,
    sender: { fullName: "Bạn" },
    content: "Ổn áp nhé, bạn sao rồi?",
    createdDate: "20/09/2023 10:31:12",
    isOwner: true,
    status: "read",
  },
  {
    id: 3,
    sender: { fullName: "Minh Châu" },
    content: "Gửi bạn file kế hoạch nhé!",
    // document:
    //   '[{"name":"project_plan_roadmap.pdf","url":"1744299234144/project_plan_roadmap.pdf"}]',
    createdDate: "15/11/2023 08:15:00",
    isOwner: false,
    status: "read",
  },
  {
    id: 4,
    sender: { fullName: "Bạn" },
    content: "Cảm ơn nhé!",
    createdDate: "15/11/2023 08:17:22",
    isOwner: true,
    status: "read",
  },
  {
    id: 5,
    sender: { fullName: "Trần Phong" },
    content: "File báo cáo tài chính đây.",
    // document:
    //   '[{"name":"financial_report_Q1.xlsx","url":"1744299234144/financial_report_Q1.xlsx"}]',
    createdDate: "02/01/2024 14:45:00",
    isOwner: false,
    status: "read",
  },
  {
    id: 6,
    sender: { fullName: "Thu Hằng" },
    content: "Ảnh team hôm trước nè 😄",
    // document:
    //   '[{"name":"team_photo.jpg","url":"1744299234144/team_photo.jpg"}]',
    createdDate: "08/03/2024 17:22:00",
    isOwner: false,
    status: "delivered",
  },
  {
    id: 7,
    sender: { fullName: "Lê Tùng" },
    content: "Đây là video giới thiệu sản phẩm",
    // document:
    //   '[{"name":"intro_video.mp4","url":"1744299234144/intro_video.mp4"}]',
    createdDate: "28/02/2024 09:10:00",
    isOwner: false,
    status: "sent",
  },
];

const InternalChatPage = () => {
  const navigate = useNavigate();
  const { tenantInfo } = useGlobalContext();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchConversations, setSearchConversations] = useState<string>("");
  const [searchMessages, setSearchMessages] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);
  const [isSearchMessagesOpen, setIsSearchMessagesOpen] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [viewedMessages, setViewedMessages] = useState<number[]>([]);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    messageRefs.current = [];
    setViewedMessages([]);

    const options = {
      root: messagesContainerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const messageId = Number(
            entry.target.getAttribute("data-message-id")
          );
          if (messageId && !viewedMessages.includes(messageId)) {
            setViewedMessages((prev) => [...prev, messageId]);
          }
        }
      });
    }, options);

    messageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [selectedConversation, viewedMessages]);

  const filteredConversations = mockConversations.filter((conversation) => {
    const matchesSearch = conversation.name
      .toLowerCase()
      .includes(searchConversations.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "unread")
      return matchesSearch && (conversation.unread || 0) > 0;
    if (activeTab === "online") return matchesSearch && conversation.online;
    return matchesSearch;
  });

  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchMessages.toLowerCase())
  );

  const conversationMessages = messages.filter(
    (message) =>
      message.sender.fullName === selectedConversation?.name || message.isOwner
  );

  const attachedFiles = messages
    .filter((message) => message.document)
    .flatMap((message) => JSON.parse(message.document || "[]"));

  const mediaFiles = attachedFiles.filter((file: any) => {
    const mimeType = getMimeType(file.name);
    return mimeType.startsWith("image/") || mimeType.startsWith("video/");
  });

  const otherFiles = attachedFiles.filter((file: any) => {
    const mimeType = getMimeType(file.name);
    return !mimeType.startsWith("image/") && !mimeType.startsWith("video/");
  });

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      const newMsg = {
        id: messages.length + 1,
        sender: { fullName: "Bạn" },
        content: newMessage,
        createdDate: new Date().toLocaleString("vi-VN"),
        isOwner: true,
        status: "sending" as const,
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    setIsInfoPanelOpen(false);
    setIsSearchMessagesOpen(false);
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  };

  const scrollToMessage = (messageId: number) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    const messageElement = messageRefs.current[messageIndex];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("bg-blue-500/20");
      setTimeout(() => {
        messageElement.classList.remove("bg-blue-500/20");
      }, 2000);
    }
    setIsSearchMessagesOpen(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      setShowScrollTop(scrollTop < scrollHeight - clientHeight - 300);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 overflow-hidden">
      <AnimatePresence>
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: isSidebarOpen ? 0 : -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed inset-y-0 left-0 w-100 bg-gray-800/70 backdrop-blur-md border-r border-gray-700/50 flex flex-col z-20 lg:static ${
            isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
            <div
              className="flex items-center space-x-3 cursor-pointer rounded-xl p-3 hover:bg-gray-700/50 transition-all duration-200"
              onClick={() => navigate("/")}
            >
              <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden">
                {tenantInfo?.logoPath ? (
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={getMediaImage(tenantInfo.logoPath)}
                    className="w-full h-full object-cover rounded-lg shadow-md border border-gray-600/30"
                    alt="Logo"
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md"
                  >
                    <MousePointer2Icon size={18} className="text-white" />
                  </motion.div>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  {tenantInfo?.name || "Chat App"}
                </h1>
                <p className="text-xs text-gray-400">Trò chuyện nội bộ</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
              >
                <BellIcon size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
              >
                <Settings2Icon size={18} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white lg:hidden"
              >
                <XIcon size={18} />
              </motion.button>
            </div>
          </div>

          {/* Search and filter */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <SearchIcon
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchConversations}
                onChange={(e) => setSearchConversations(e.target.value)}
                placeholder="Tìm kiếm cuộc trò chuyện..."
                className="w-full pl-10 p-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("all")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                }`}
              >
                Tất cả
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("unread")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "unread"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                }`}
              >
                Chưa đọc
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("online")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "online"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-600/50"
                }`}
              >
                Online
              </motion.button>
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto px-4 space-y-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  selected={selectedConversation?.id === conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                />
              ))
            ) : (
              <p className="p-4 text-gray-400 text-center">
                Không tìm thấy cuộc trò chuyện
              </p>
            )}
          </div>

          {/* New conversation button */}
          <div className="p-4 border-t border-gray-700/50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all"
            >
              <PlusIcon size={18} />
              <span>Cuộc trò chuyện mới</span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-1">
        <div className="flex-1 flex flex-col relative">
          {!isSidebarOpen && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-4 lg:hidden text-gray-400 hover:text-white"
            >
              <MenuIcon size={24} />
            </motion.button>
          )}

          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-600"
                    />
                    {selectedConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {selectedConversation.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {selectedConversation.online
                        ? "Đang hoạt động"
                        : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                  >
                    <PhoneIcon size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsInfoPanelOpen(true);
                      setIsSearchMessagesOpen(true);
                    }}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                  >
                    <SearchIcon size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                  >
                    <InfoIcon size={20} />
                  </motion.button>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 p-4 overflow-y-auto bg-gray-900/50 backdrop-blur-md"
              >
                {conversationMessages.length > 0 ? (
                  conversationMessages.map((message, index) => (
                    <div key={message.id}>
                      {(index === 0 ||
                        parseCustomDateString(
                          conversationMessages[index - 1].createdDate
                        ).toDateString() !==
                          parseCustomDateString(
                            message.createdDate
                          ).toDateString()) && (
                        <DateDivider date={message.createdDate} />
                      )}
                      <MessageItem
                        openModal={setSelectedFile}
                        message={message}
                        avatar={selectedConversation.avatar}
                        // isVisible={viewedMessages.includes(message.id)}
                        isVisible={true}
                        ref={(el: HTMLDivElement) =>
                          (messageRefs.current[index] = el)
                        }
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center mt-10">
                    Chưa có tin nhắn nào
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>

              <AnimatePresence>
                {showScrollTop && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToBottom}
                    className="absolute bottom-20 right-4 p-3 bg-blue-500/70 backdrop-blur-md rounded-full text-white shadow-lg"
                  >
                    <ChevronDownIcon size={20} />
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="p-4 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                  >
                    <PaperclipIcon size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                  >
                    <SmileIcon size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                  >
                    <MicIcon size={20} />
                  </motion.button>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 p-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all"
                    rows={inputFocused || newMessage.length > 50 ? 3 : 1}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSendMessage}
                    className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    <SendIcon size={20} />
                  </motion.button>
                </div>

                <AnimatePresence>
                  {attachmentMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-24 left-4 bg-gray-800/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-700/50"
                    >
                      <div className="grid grid-cols-3 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-all"
                        >
                          <ImageIcon size={24} className="text-blue-400" />
                          <span className="text-xs text-gray-300 mt-1">
                            Ảnh
                          </span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-all"
                        >
                          <VideoIcon size={24} className="text-purple-400" />
                          <span className="text-xs text-gray-300 mt-1">
                            Video
                          </span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-all"
                        >
                          <FileIcon size={24} className="text-gray-400" />
                          <span className="text-xs text-gray-300 mt-1">
                            Tệp
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-2 bg-gray-900/50 backdrop-blur-md">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={chatImg}
                className="w-full object-contain max-w-lg"
              />
              <p className="text-gray-400 text-center text-lg">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isInfoPanelOpen && selectedConversation && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-100 bg-gray-800/70 backdrop-blur-md border-l border-gray-700/50 flex flex-col lg:w-1/4"
            >
              <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white">
                  Thông tin hội thoại
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsInfoPanelOpen(false);
                    setIsSearchMessagesOpen(false);
                  }}
                  className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                >
                  <XIcon size={20} />
                </motion.button>
              </div>

              {isSearchMessagesOpen ? (
                <div className="flex-1 p-4 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Tìm kiếm tin nhắn
                  </h3>
                  <div className="relative mb-4">
                    <SearchIcon
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={searchMessages}
                      onChange={(e) => setSearchMessages(e.target.value)}
                      placeholder="Tìm kiếm tin nhắn..."
                      className="w-full pl-10 p-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => scrollToMessage(message.id)}
                        className="p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer mb-2 border border-gray-600/30 transition-all"
                      >
                        <p className="text-sm text-gray-200 truncate">
                          {message.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {message.createdDate}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm text-center">
                      Không tìm thấy tin nhắn
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <img
                        src={selectedConversation.avatar}
                        alt={selectedConversation.name}
                        className="w-16 h-16 rounded-full mb-2 border border-gray-600"
                      />
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-white">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {selectedConversation.online
                        ? "Đang hoạt động"
                        : "Offline"}
                    </p>
                  </div>

                  {/* Media tab */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                      <ImageIcon size={16} className="mr-1 text-blue-400" />
                      Ảnh/Video
                    </h3>
                    {mediaFiles.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {mediaFiles.map((file: any, idx: number) => (
                          <DocumentItem
                            key={idx}
                            file={file}
                            openModal={setSelectedFile}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center">
                        Không có ảnh hoặc video
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                      <FileIcon size={16} className="mr-1 text-gray-400" />
                      Tệp
                    </h3>
                    {otherFiles.length > 0 ? (
                      <div className="space-y-2">
                        {otherFiles.map((file: any, idx: number) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedFile(file)}
                            className="flex items-center space-x-2 bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg hover:bg-gray-600/70 cursor-pointer border border-gray-600/30 transition-all"
                          >
                            <FileTypeIcon mimeType={getMimeType(file.name)} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-200 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDistanceToNow(
                                  parseCustomDateString(
                                    messages.find((msg) =>
                                      msg.document?.includes(file.name)
                                    )?.createdDate || ""
                                  ),
                                  {
                                    addSuffix: true,
                                    locale: vi,
                                  }
                                )}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center">
                        Không có tệp
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <FileModal
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InternalChatPage;
