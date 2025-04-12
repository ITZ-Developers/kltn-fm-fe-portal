import { motion } from "framer-motion";
import { formatMessageTime } from "../../services/utils";

const ConversationItem = ({ conversation, selected, onClick }: any) => {
  const isUnread = conversation.unread > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={`relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        selected
          ? "bg-blue-500/10 border border-blue-500/20"
          : "hover:bg-gray-700/50"
      }`}
    >
      <div className="relative">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="w-12 h-12 rounded-full object-cover shadow-md border border-gray-600"
        />
        {conversation.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        )}
      </div>
      <div className="flex-1 ml-3">
        <div className="flex justify-between items-center">
          <span
            className={`font-medium ${
              selected ? "text-blue-400" : "text-gray-200"
            }`}
          >
            {conversation.name}
          </span>
          <span className="text-xs text-gray-400">
            {formatMessageTime(conversation.lastMessage.createdDate)}
          </span>
        </div>
        <p
          className={`text-sm truncate ${
            isUnread ? "text-gray-200" : "text-gray-400"
          }`}
        >
          {conversation.lastMessage.content}
        </p>
      </div>
      {isUnread && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-opacity-65 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white">{conversation.unread}</span>
        </div>
      )}
    </motion.div>
  );
};

export default ConversationItem;
