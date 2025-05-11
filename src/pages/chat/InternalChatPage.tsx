import React, { useState, useEffect, useRef } from "react";
import {
  SendIcon,
  PhoneIcon,
  PaperclipIcon,
  SmileIcon,
  SearchIcon,
  MenuIcon,
  XIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  ChevronDownIcon,
  InfoIcon,
  UserIcon,
  HandshakeIcon,
  BotIcon,
  UsersIcon,
} from "lucide-react";
import {
  convertDateByFields,
  decryptData,
  encryptAES,
  formatDistanceToNowVN,
  generateIdNumber,
  getCurrentDate,
  getMediaImage,
  getMimeType,
  isOnline,
  parseCustomDateString,
  truncateString,
  truncateToDDMMYYYY,
} from "../../services/utils";
import chatImg from "../../assets/chat.png";
import { formatDistanceToNow, set } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Sidebar.css";
import { DateDivider, MessageItem } from "./message/MessageItem";
import { DocumentItem, FileModal, FileTypeIcon } from "./FileComponents";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import UnauthorizedDialog from "../auth/UnauthorizedDialog";
import InputSessionKey from "../auth/InputSessionKey";
import NotReadyDialog from "../auth/NotReadyDialog";
import useApi from "../../hooks/useApi";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import RequestKey from "../auth/RequestKey";
import useModal from "../../hooks/useModal";
import VerifyFaceId from "../faceId/VerifyFaceId";
import CreateChatRoom from "./CreateChatRoom";
import {
  CHAT_HISTORY_ROLE,
  CHAT_ROOM_KIND_MAP,
  SOCKET_CMD,
} from "../../services/constant";
import { GridViewLoading } from "../../components/page/GridView";
import {
  CONVER_DATE_FIELDS,
  DECRYPT_FIELDS,
  GEMINI_BOT_CONFIG,
} from "../../components/config/PageConfig";
import ChatSideBar from "./ChatSideBar";

const InternalChatPage = () => {
  const { isSystemNotReady, sessionKey, setToast, profile, message } =
    useGlobalContext();
  const [isFaceIdVerified, setIsFaceIdVerified] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchConversations, setSearchConversations] = useState<string>("");
  const [searchMessages, setSearchMessages] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [panelState, setPanelState] = useState<"info" | "search" | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(true);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [messages, setMessages] = useState<any>([]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<any[]>([]);

  const {
    isModalVisible: verifyFaceIdVisible,
    showModal: showVerifyFaceIdForm,
    hideModal: hideVerifyFaceIdForm,
    formConfig: verifyFaceIdFormConfig,
  } = useModal();

  const {
    isModalVisible: requestKeyFormVisible,
    showModal: showRequestKeyForm,
    hideModal: hideRequestKeyForm,
    formConfig: requestKeyFormConfig,
  } = useModal();

  const {
    isModalVisible: createRoomFormVisible,
    showModal: showCreateRoomForm,
    hideModal: hideCreateRoomForm,
    formConfig: createRoomFormConfig,
  } = useModal();

  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();

  const [conversations, setConversations] = useState<any>([]);
  const { chatRoom, auth, loading } = useApi();
  const { chatMessage: chatMessageNoLoading, chatRoom: chatRoomListNoLoading } =
    useApi();
  const { chatHistory: chatHistoryListNoLoading, loading: hiddenLoading } =
    useApi();
  const {
    chatHistory: chatHistorySendMsg,
    chatMessage: sendMessage,
    loading: loadingSendMessage,
  } = useApi();
  const { chatRoom: chatRoomList, loading: loadingChatRoomList } = useApi();
  const {
    chatHistory: chatHistoryList,
    chatRoom: chatRoomMessageList,
    chatMessage: messageList,
    loading: loadingMessageList,
  } = useApi();

  const onCreateRoomButtonClick = () => {
    showCreateRoomForm({
      hideModal: hideCreateRoomForm,
      onButtonClick: () => {
        hideCreateRoomForm();
      },
    });
  };

  const handleRequestKey = () => {
    showRequestKeyForm(
      configModalForm({
        label: "Gửi yêu cầu khóa",
        fetchApi: auth.requestKey,
        setToast,
        hideModal: hideRequestKeyForm,
        initForm: {
          password: "",
        },
      })
    );
  };

  const handleVerifyFaceId = async () => {
    showVerifyFaceIdForm({
      hideModal: hideVerifyFaceIdForm,
      onButtonClick: async () => {
        hideVerifyFaceIdForm();
        setIsFaceIdVerified(true);
      },
    });
  };

  const fetchChatRooms = async (apiList: any) => {
    if (!sessionKey) {
      return;
    }
    const res = await apiList({ isPaged: 0 });
    if (res.result) {
      const data = res?.data?.content || [];
      setConversations([
        GEMINI_BOT_CONFIG,
        ...data?.map((item: any) => {
          const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.CHAT_ROOM);
          return convertDateByFields(obj, CONVER_DATE_FIELDS.CHAT_ROOM);
        }),
      ]);
    } else {
      setConversations([]);
    }
  };

  const fetchChatHistoryListNoLoading = async () => {
    const res = await chatHistoryListNoLoading.list({
      isPaged: 0,
    });
    if (res.result) {
      const data = res?.data?.content || [];
      const decryptedData = data?.map((item: any) => {
        const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.CHAT_HISTORY);
        return convertDateByFields(obj, CONVER_DATE_FIELDS.CHAT_HISTORY);
      });
      setMessages(decryptedData.reverse());
    } else {
      setMessages([]);
    }
  };

  const fetchMessagesByChatRoom = async (conversation: any) => {
    if (!sessionKey || !conversation) {
      setMessages([]);
      return;
    }
    if (conversation.kind === GEMINI_BOT_CONFIG.kind) {
      const res = await chatHistoryList.list({
        isPaged: 0,
      });
      if (res.result) {
        const data = res?.data?.content || [];
        const decryptedData = data?.map((item: any) => {
          const obj = decryptData(
            sessionKey,
            item,
            DECRYPT_FIELDS.CHAT_HISTORY
          );
          return convertDateByFields(obj, CONVER_DATE_FIELDS.CHAT_HISTORY);
        });
        setMessages(decryptedData.reverse());
      } else {
        setMessages([]);
      }
      return;
    }
    const res = await messageList.list({
      chatRoomId: conversation.id,
      isPaged: 0,
    });
    if (res.result) {
      const data = res?.data?.content || [];
      const decryptedData = data?.map((item: any) => {
        const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.MESSAGE);
        return convertDateByFields(obj, CONVER_DATE_FIELDS.MESSAGE);
      });
      setMessages(decryptedData.reverse());
    } else {
      setMessages([]);
    }
    if (conversation?.totalUnreadMessages > 0) {
      await fetchChatRooms(chatRoomListNoLoading.list);
    }
  };

  const fetchMessageNoLoading = async (conversation: any) => {
    if (!conversation) return;
    const res = await chatMessageNoLoading.list({
      chatRoomId: conversation.id,
      isPaged: 0,
    });
    if (res.result) {
      const data = res?.data?.content || [];
      const decryptedData = data?.map((item: any) => {
        const obj = decryptData(sessionKey, item, DECRYPT_FIELDS.MESSAGE);
        return convertDateByFields(obj, CONVER_DATE_FIELDS.MESSAGE);
      });
      setMessages(decryptedData.reverse());
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!profile.isFaceIdRegistered) {
      setIsFaceIdVerified(true);
    } else {
      setIsFaceIdVerified(false);
    }
  }, []);

  useEffect(() => {
    if (!isFaceIdVerified) {
      handleVerifyFaceId();
    } else {
      hideVerifyFaceIdForm();
    }
  }, [isFaceIdVerified]);

  useEffect(() => {
    const handleProcessSocket = async () => {
      if (SOCKET_CMD.CMD_CHAT_ROOM_CREATED === message?.cmd) {
        await fetchChatRooms(chatRoomListNoLoading.list);
      }
      if (SOCKET_CMD.CMD_CHAT_ROOM_DELETED === message?.cmd) {
        const chatRoomId = message?.data?.chatRoomId;
        if (selectedConversation?.id === chatRoomId) {
          setSelectedConversation(null);
        }
        await fetchChatRooms(chatRoomListNoLoading.list);
      }
      if (
        [SOCKET_CMD.CMD_NEW_MESSAGE, SOCKET_CMD.CMD_MESSAGE_UPDATED].includes(
          message?.cmd
        )
      ) {
        const messageId = message?.data?.messageId;
        const chatRoomId = message?.data?.chatRoomId;
        if (messageId && chatRoomId === selectedConversation?.id) {
          await fetchMessageNoLoading(selectedConversation);
          scrollToBottom();
        }
        await fetchChatRooms(chatRoomListNoLoading.list);
      }
    };
    handleProcessSocket();
  }, [message]);

  useEffect(() => {
    fetchChatRooms(chatRoomList.list);
    fetchMessagesByChatRoom(selectedConversation);
  }, [sessionKey]);

  const filteredConversations = conversations
    ? conversations.filter((conversation: any) => {
        const matchesSearch = conversation.name
          .toLowerCase()
          .includes(searchConversations.toLowerCase());
        if (activeTab === "all") {
          return matchesSearch;
        }
        if (activeTab === "unread") {
          return matchesSearch && (conversation.totalUnreadMessages || 0) > 0;
        }
        return matchesSearch;
      })
    : [];

  const filteredMessages = messages.filter(
    (message: any) =>
      searchMessages.trim() &&
      ((message?.content &&
        message.content.toLowerCase().includes(searchMessages.toLowerCase())) ||
        (message?.message &&
          message.message.toLowerCase().includes(searchMessages.toLowerCase())))
  );
  const attachedFiles = messages
    .filter((message: any) => message.document)
    .flatMap((message: any) => JSON.parse(message.document || "[]"));

  const mediaFiles = attachedFiles.filter((file: any) => {
    const mimeType = getMimeType(file.name);
    return mimeType.startsWith("image/") || mimeType.startsWith("video/");
  });

  const otherFiles = attachedFiles.filter((file: any) => {
    const mimeType = getMimeType(file.name);
    return !mimeType.startsWith("image/") && !mimeType.startsWith("video/");
  });

  const handleSendMessage = async () => {
    setNewMessage("");
    if (newMessage.trim() && selectedConversation?.id) {
      if (selectedConversation?.kind === GEMINI_BOT_CONFIG.kind) {
        const msgObj = {
          id: generateIdNumber(),
          role: CHAT_HISTORY_ROLE.USER,
          message: newMessage,
          createdDate: getCurrentDate(),
        };
        setMessages((prev: any) => [...prev, msgObj]);
        setTimeout(async () => {
          scrollToBottom();
        }, 800);
        const res = await chatHistorySendMsg.create({
          message: encryptAES(newMessage, sessionKey),
        });
        if (!res.result) {
          return;
        }
        await fetchChatHistoryListNoLoading();
      } else {
        await sendMessage.create({
          chatRoomId: selectedConversation?.id,
          content: encryptAES(newMessage, sessionKey),
          document: null,
          parentId: null,
        });
      }
    }
  };

  const onRefreshButtonClick = async () => {
    await fetchChatRooms(chatRoomList.list);
  };

  const handleSelectConversation = async (conversationId: any) => {
    if (conversationId === GEMINI_BOT_CONFIG.id) {
      setSelectedConversation(GEMINI_BOT_CONFIG);
    } else {
      const res = await chatRoomMessageList.get(conversationId);
      if (!res.result) {
        return;
      }
      const obj = decryptData(sessionKey, res.data, DECRYPT_FIELDS.CHAT_ROOM);
      setSelectedConversation(
        convertDateByFields(obj, CONVER_DATE_FIELDS.CHAT_ROOM)
      );
    }

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    setPanelState(null);
  };

  useEffect(() => {
    if (!loadingMessageList || !hiddenLoading) {
      scrollToBottom();
    }
  }, [loadingMessageList, hiddenLoading]);

  const scrollToMessage = (messageId: any) => {
    const messageIndex = messages.findIndex((msg: any) => msg.id == messageId);
    const messageElement = messageRefs.current[messageIndex];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("bg-blue-500/20");
      setTimeout(() => {
        messageElement.classList.remove("bg-blue-500/20");
      }, 1000);
    }
    if (panelState === "search") {
      setPanelState(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      setShowScrollTop(scrollTop < scrollHeight - clientHeight - 200);
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
    fetchMessagesByChatRoom(selectedConversation);
    setNewMessage("");
  }, [selectedConversation]);

  useEffect(() => {
    setSearchMessages("");
  }, [panelState]);

  const onDeleteMessageButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: "Thu hồi tin nhắn",
        message: "Bạn có chắc muốn thu hồi tin nhắn này",
        deleteApi: () => chatMessageNoLoading.del(id),
        refreshData: () => {},
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  return (
    <>
      <UnauthorizedDialog />
      <LoadingDialog isVisible={loading} />
      <VerifyFaceId
        isVisible={verifyFaceIdVisible}
        formConfig={verifyFaceIdFormConfig}
      />
      <RequestKey
        isVisible={requestKeyFormVisible}
        formConfig={requestKeyFormConfig}
      />
      <CreateChatRoom
        isVisible={createRoomFormVisible}
        formConfig={createRoomFormConfig}
      />
      <ConfirmationDialog
        isVisible={deleteDialogVisible}
        formConfig={deleteDialogConfig}
      />
      <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200 overflow-hidden">
        <ChatSideBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleRequestKey={handleRequestKey}
          searchConversations={searchConversations}
          setSearchConversations={setSearchConversations}
          onRefreshButtonClick={onRefreshButtonClick}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loadingChatRoomList={loadingChatRoomList}
          filteredConversations={filteredConversations}
          selectedConversation={selectedConversation}
          handleSelectConversation={handleSelectConversation}
          onCreateRoomButtonClick={onCreateRoomButtonClick}
        />

        {isSystemNotReady ? (
          <NotReadyDialog
            color="goldenrod"
            message="Vui lòng liên hệ với quản trị viên để kích hoạt hệ thống"
            title="Hệ thống chưa sẵn sàng"
          />
        ) : !sessionKey && !isSystemNotReady ? (
          <InputSessionKey />
        ) : (
          <>
            <div className="flex flex-1">
              <div className="flex-1 flex flex-col relative">
                {!isSidebarOpen && (
                  <motion.button
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
                          {selectedConversation.kind ===
                          GEMINI_BOT_CONFIG.kind ? (
                            <div className="w-10 h-10 rounded-full bg-blue-900 border border-gray-600 shadow-md flex items-center justify-center">
                              <GEMINI_BOT_CONFIG.icon className="text-gray-300" />
                            </div>
                          ) : (
                            <>
                              {selectedConversation.avatar ? (
                                <img
                                  src={getMediaImage(
                                    selectedConversation.avatar
                                  )}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-600"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center">
                                  {CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value ===
                                  selectedConversation.kind ? (
                                    <UserIcon className="text-gray-300" />
                                  ) : (
                                    <UsersIcon className="text-gray-300" />
                                  )}
                                </div>
                              )}
                            </>
                          )}
                          {selectedConversation.kind ===
                            CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value &&
                            isOnline(selectedConversation.lastLogin) && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            {selectedConversation.name}
                          </h2>
                          <p className="text-sm text-gray-400">
                            {selectedConversation.kind ===
                            CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value ? (
                              <>
                                {isOnline(selectedConversation.lastLogin)
                                  ? "Đang hoạt động"
                                  : selectedConversation.lastLogin
                                  ? `Truy cập ${formatDistanceToNowVN(
                                      selectedConversation.lastLogin
                                    )}`
                                  : ""}
                              </>
                            ) : selectedConversation.kind ===
                              CHAT_ROOM_KIND_MAP.GROUP.value ? (
                              <>{`${selectedConversation.totalMembers} thành viên`}</>
                            ) : (
                              <>{GEMINI_BOT_CONFIG.description}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {selectedConversation.kind ===
                          CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <PhoneIcon size={20} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (panelState === "search") {
                              setPanelState(null);
                            } else {
                              setPanelState("search");
                            }
                          }}
                          className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                        >
                          <SearchIcon size={20} />
                        </motion.button>
                        {selectedConversation.kind !==
                          GEMINI_BOT_CONFIG.kind && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              if (panelState === "info") {
                                setPanelState(null);
                              } else {
                                setPanelState("info");
                              }
                            }}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <InfoIcon size={20} />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <div
                      ref={messagesContainerRef}
                      onScroll={handleScroll}
                      className="flex-1 p-4 overflow-y-auto bg-gray-900/50 backdrop-blur-md"
                    >
                      {loadingMessageList ? (
                        <div className="flex-1">
                          <GridViewLoading loading={loadingMessageList} />
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((message: any, index: any) => (
                          <div key={message.id}>
                            {(index === 0 ||
                              parseCustomDateString(
                                messages[index - 1].createdDate
                              ).toDateString() !==
                                parseCustomDateString(
                                  message.createdDate
                                ).toDateString()) && (
                              <DateDivider
                                date={truncateToDDMMYYYY(message.createdDate)}
                              />
                            )}
                            <div
                              ref={(el: any) =>
                                (messageRefs.current[index] = el)
                              }
                            >
                              <MessageItem
                                openModal={setSelectedFile}
                                message={message}
                                onRecallMessage={onDeleteMessageButtonClick}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 mt-10">
                          {selectedConversation.kind ===
                          GEMINI_BOT_CONFIG.kind ? (
                            <>
                              <BotIcon
                                size={48}
                                className="text-gray-500 mb-4"
                                strokeWidth={1.5}
                              />
                              <p className="text-lg font-medium text-gray-300 text-center">
                                Tôi có thể giúp gì cho bạn
                              </p>
                            </>
                          ) : (
                            <>
                              <HandshakeIcon
                                size={48}
                                className="text-gray-500 mb-4"
                                strokeWidth={1.5}
                              />
                              <p className="text-lg font-medium text-gray-300 text-center">
                                Hãy gửi tin nhắn đầu tiên
                              </p>
                            </>
                          )}
                        </div>
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
                          className="absolute bottom-20 right-4 p-2 bg-gray-700 backdrop-blur-md rounded-full text-white shadow-lg"
                        >
                          <ChevronDownIcon size={20} />
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <div className="p-4 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-md">
                      <div className="flex items-center space-x-3">
                        {selectedConversation.kind !==
                          GEMINI_BOT_CONFIG.kind && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setAttachmentMenuOpen(!attachmentMenuOpen)
                            }
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <PaperclipIcon size={20} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                        >
                          <SmileIcon size={20} />
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
                                <ImageIcon
                                  size={24}
                                  className="text-blue-400"
                                />
                                <span className="text-xs text-gray-300 mt-1">
                                  Ảnh
                                </span>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/50 transition-all"
                              >
                                <VideoIcon
                                  size={24}
                                  className="text-purple-400"
                                />
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
                {panelState && selectedConversation && (
                  <motion.div
                    initial={{ x: 400 }}
                    animate={{ x: 0 }}
                    exit={{ x: 400 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="w-100 bg-gray-800/70 backdrop-blur-md border-l border-gray-700/50 flex flex-col lg:w-1/4"
                  >
                    {panelState === "info" ? (
                      <>
                        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
                          <h2 className="text-lg font-semibold text-white">
                            Thông tin hội thoại
                          </h2>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPanelState(null)}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <XIcon size={20} />
                          </motion.button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                              {selectedConversation.avatar ? (
                                <img
                                  src={getMediaImage(
                                    selectedConversation.avatar
                                  )}
                                  className="w-16 h-16 rounded-full mb-2 border border-gray-600"
                                />
                              ) : (
                                <>
                                  <div className="w-16 h-16 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center">
                                    {CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value ===
                                    selectedConversation.kind ? (
                                      <UserIcon className="text-gray-300" />
                                    ) : (
                                      <UsersIcon className="text-gray-300" />
                                    )}
                                  </div>
                                </>
                              )}
                              {CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE ===
                                selectedConversation.kind &&
                                isOnline(selectedConversation.lastLogin) && (
                                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                )}
                            </div>
                            <h3 className="text-lg font-medium text-white">
                              {selectedConversation.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {selectedConversation.kind ===
                              CHAT_ROOM_KIND_MAP.DIRECT_MESSAGE.value ? (
                                <>
                                  {isOnline(selectedConversation.lastLogin)
                                    ? "Đang hoạt động"
                                    : selectedConversation.lastLogin
                                    ? `Truy cập ${formatDistanceToNowVN(
                                        selectedConversation.lastLogin
                                      )}`
                                    : ""}
                                </>
                              ) : selectedConversation.kind ===
                                CHAT_ROOM_KIND_MAP.GROUP.value ? (
                                <>{`${selectedConversation.totalMembers} thành viên`}</>
                              ) : (
                                <>{GEMINI_BOT_CONFIG.description}</>
                              )}
                            </p>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                              <ImageIcon
                                size={16}
                                className="mr-1 text-blue-400"
                              />
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
                              <FileIcon
                                size={16}
                                className="mr-1 text-gray-400"
                              />
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
                                    <FileTypeIcon
                                      mimeType={getMimeType(file.name)}
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-200 truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {formatDistanceToNow(
                                          parseCustomDateString(
                                            messages.find((msg: any) =>
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
                      </>
                    ) : (
                      <>
                        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between bg-gray-800/30 backdrop-blur-md">
                          <h2 className="text-lg font-semibold text-white">
                            Tìm kiếm tin nhắn
                          </h2>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPanelState(null)}
                            className="p-2 rounded-full hover:bg-gray-700/50 transition-all text-gray-400 hover:text-white"
                          >
                            <XIcon size={20} />
                          </motion.button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                          <div className="relative mb-4">
                            <SearchIcon
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              value={searchMessages}
                              onChange={(e) =>
                                setSearchMessages(e.target.value)
                              }
                              placeholder="Tìm kiếm tin nhắn..."
                              className="w-full pl-10 pr-10 p-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            />
                            {searchMessages.length > 0 && (
                              <button
                                onClick={() => setSearchMessages("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                                aria-label="Xóa nội dung tìm kiếm"
                              >
                                <XIcon size={16} />
                              </button>
                            )}
                          </div>
                          {filteredMessages.length > 0 ? (
                            filteredMessages.map((message: any) => (
                              <motion.div
                                key={message.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => scrollToMessage(message.id)}
                                className="p-3 rounded-lg hover:bg-gray-700/50 cursor-pointer mb-2 border border-gray-600/30 transition-all flex items-start space-x-3"
                                role="button"
                              >
                                {selectedConversation.kind !==
                                  GEMINI_BOT_CONFIG.kind && (
                                  <>
                                    {message.sender.avatarPath ? (
                                      <img
                                        src={getMediaImage(
                                          message.sender.avatarPath
                                        )}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-600 shadow-md"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 shadow-md flex items-center justify-center">
                                        <UserIcon
                                          size={20}
                                          className="text-gray-300"
                                        />
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between">
                                    <p className="text-sm font-semibold text-blue-500 truncate">
                                      {selectedConversation?.kind ===
                                      GEMINI_BOT_CONFIG.kind ? (
                                        <>
                                          {message.role ===
                                          CHAT_HISTORY_ROLE.USER
                                            ? "Bạn"
                                            : GEMINI_BOT_CONFIG.name}
                                        </>
                                      ) : (
                                        <>{message.sender?.fullName}</>
                                      )}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {parseCustomDateString(
                                        message.createdDate
                                      ).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-200 truncate">
                                    {selectedConversation?.kind ===
                                    GEMINI_BOT_CONFIG.kind
                                      ? truncateString(message.message, 50)
                                      : truncateString(message.content, 50)}
                                  </p>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm text-center">
                              Không tìm thấy tin nhắn
                            </p>
                          )}
                        </div>
                      </>
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
          </>
        )}
      </div>
    </>
  );
};

export default InternalChatPage;
