import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { getMimeType, parseCustomDateString } from "../../services/utils";
import { FileTypeIcon } from "./FileComponents";

const MessageItem = ({
  message,
  avatar,
  isVisible,
  ref,
  openModal,
}: any) => {
  const { isOwner, content, document, createdDate, status } = message;

  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return "⌛";
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      ref={ref}
      data-message-id={message.id}
      className={`flex ${
        isOwner ? "justify-end" : "justify-start"
      } mb-4 transition-all duration-300`}
    >
      {!isOwner && (
        <img
          src={avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2 self-end border border-gray-700"
        />
      )}
      <div
        className={`max-w-xs p-4 rounded-xl shadow-md ${
          isOwner ? "bg-blue-600/80 text-white" : "bg-gray-700 text-gray-200"
        } ${isOwner ? "rounded-br-sm" : "rounded-bl-sm"}`}
      >
        <p className="text-sm">{content}</p>
        {document && (
          <div className="mt-3 space-y-2">
            {JSON.parse(document).map((file: any, idx: number) => (
              <motion.div
                key={idx}
                onClick={() => openModal(file)}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-2 bg-gray-800 backdrop-blur-sm p-3 rounded-lg cursor-pointer hover:bg-gray-800/50 border border-gray-600/30 transition-all"
              >
                <FileTypeIcon mimeType={getMimeType(file.name)} />
                <span className="text-sm truncate flex-1">{file.name}</span>
                <ChevronRightIcon size={16} className="text-gray-400" />
              </motion.div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-end mt-2 space-x-1">
          <p className="text-xs text-gray-300/70">
            {parseCustomDateString(createdDate).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {isOwner && (
            <span
              className={`text-xs ${
                status === "read" ? "text-blue-300" : "text-gray-300/70"
              }`}
            >
              {getStatusIcon()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
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
