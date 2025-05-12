import { motion } from "framer-motion";
import { parseCustomDateString } from "../../../services/utils";
import { BASIC_MESSAGES, CHAT_HISTORY_ROLE } from "../../../services/constant";
import {
  AttachedFiles,
  Avatar,
  MessageActions,
  MessageTime,
  ParentMessage,
  ReactionCount,
  SeenAvatars,
} from "./MessageComponents";
import { MESSAGE_REACTION_KIND_MAP } from "../../../components/config/PageConfig";

const MessageItem = ({
  message,
  openModal,
  onRecallMessage,
  onEditMessage,
  onReplyMessage,
  onClickParentMessage,
}: any) => {
  const {
    isSender,
    content,
    document,
    createdDate,
    sender,
    isDeleted,
    isUpdated,
    isChildren,
    parent,
    seenMembers,
    totalSeenMembers,
    myReaction,
    isReacted,
    totalReactions,
    messageReactions,
    id,
  } = message;
  const { message: msg, role } = message;
  const isBot = [CHAT_HISTORY_ROLE.MODEL, CHAT_HISTORY_ROLE.USER].includes(
    role
  );
  const isUser = role === CHAT_HISTORY_ROLE.USER;
  const files = document ? JSON.parse(document) : [];
  const matched = Object.values(MESSAGE_REACTION_KIND_MAP).find(
    (item) => item.value === myReaction
  );

  const RenderSeenAvatars = () => {
    return (
      <div className="flex flex-col mx-1">
        <div className="flex flex-1" />
        <SeenAvatars
          seenMembers={seenMembers}
          totalSeenMembers={totalSeenMembers}
        />
        <div className="mb-8" />
      </div>
    );
  };

  const RenderMessageTime = () => {
    return <MessageTime createdDate={createdDate} />;
  };

  const RenderReactionCout = () => {
    return (
      <ReactionCount
        totalReactions={totalReactions}
        messageReactions={messageReactions}
        MESSAGE_REACTION_KIND_MAP={MESSAGE_REACTION_KIND_MAP}
      />
    );
  };

  return (
    <>
      {isBot ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          data-message-id={message.id}
          className={`flex ${
            isUser ? "justify-end" : "justify-start"
          } mb-4 transition-all duration-300`}
        >
          <div
            className={`max-w-[80%] sm:max-w-[60%] md:max-w-[50%] p-4 rounded-xl shadow-md ${
              isUser ? "bg-blue-600/80 text-white" : "bg-gray-700 text-gray-200"
            } ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
          >
            <p className="text-sm">{msg}</p>
            <div
              className={`${
                isUser ? "justify-end" : "justify-start"
              } flex items-center  mt-2 space-x-1`}
            >
              <p className="text-xs text-gray-300/70">
                {parseCustomDateString(createdDate).toLocaleTimeString(
                  "vi-VN",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`flex ${
            isSender ? "justify-end" : "justify-start"
          } mb-4 group`}
        >
          {!isSender ? (
            <div className="mr-2 self-end">
              <Avatar sender={sender} />
            </div>
          ) : (
            <RenderSeenAvatars />
          )}
          <div className="flex flex-col">
            <div
              className={`max-w-xs sm:max-w-md md:max-w-lg p-3 rounded-2xl shadow-md ${
                isSender
                  ? "bg-blue-600/90 text-white rounded-br-sm"
                  : "bg-gray-700 text-gray-200 rounded-bl-sm"
              } border ${
                isSender ? "border-blue-500/30" : "border-gray-700/30"
              }`}
            >
              {isChildren && parent && (
                <ParentMessage
                  parent={parent}
                  onClick={onClickParentMessage}
                />
              )}
              {isDeleted ? (
                <p
                  className="text-sm italic text-gray-300"
                  aria-label="Tin nhắn đã bị thu hồi"
                >
                  {BASIC_MESSAGES.MESSAGE_DELETED}
                </p>
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {content}
                  {isUpdated && (
                    <span className="text-xs italic text-gray-300 ml-1">
                      (đã chỉnh sửa)
                    </span>
                  )}
                </p>
              )}
              {document && files.length > 0 && (
                <AttachedFiles files={files} openModal={openModal} />
              )}
              <div className={`flex flex-row justify-between space-x-5`}>
                {isSender ? (
                  <>
                    <RenderMessageTime />
                    <RenderReactionCout />
                  </>
                ) : (
                  <>
                    <RenderReactionCout />
                    <RenderMessageTime />
                  </>
                )}
              </div>
            </div>
            <div
              className={`flex items-center mt-1 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-center space-x-1">
                <MessageActions
                  id={id}
                  isSender={isSender}
                  isReacted={isReacted}
                  isDeleted={isDeleted}
                  matched={matched}
                  totalReactions={totalReactions}
                  myReaction={myReaction}
                  onRecallMessage={onRecallMessage}
                  onEditMessage={onEditMessage}
                  onReplyMessage={onReplyMessage}
                />
              </div>
            </div>
          </div>
          {!isSender ? (
            <RenderSeenAvatars />
          ) : (
            <div className="ml-2 self-end">
              <Avatar sender={sender} />
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

const DateDivider = ({ date }: { date: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-center my-6"
  >
    <div className="bg-gray-800/70 backdrop-blur-sm text-gray-300 text-sm px-4 py-1 rounded-full shadow-md border border-gray-700/30">
      {date}
    </div>
  </motion.div>
);

export { MessageItem, DateDivider };
