import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, UserIcon } from "lucide-react";

// const DetailsDialog = ({ isOpen, onClose, message }: any) => {
//   const [activeTab, setActiveTab] = useState<"reactions" | "seen">("reactions");

//   if (!isOpen || !message) return null;

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="bg-gray-900/90 p-6 rounded-xl max-w-[90vw] max-h-[90vh] overflow-auto border border-gray-700/50 shadow-2xl w-full md:w-[600px]"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium text-white">Chi tiết tin nhắn</h3>
//               <motion.button
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800/70 transition-all"
//               >
//                 <XIcon size={24} />
//               </motion.button>
//             </div>
//             <div className="mb-4">
//               <MessageItem
//                 message={message}
//                 openModal={() => {}}
//                 onClickParentMessage={() => {}}
//                 onReplyMessage={() => {}}
//                 onAddReaction={() => {}}
//                 onRemoveReaction={() => {}}
//                 onCopyMessage={() => {}}
//                 onEditMessage={() => {}}
//                 onSaveEdit={() => {}}
//                 onCancelEdit={() => {}}
//                 onRecallMessage={() => {}}
//                 onViewDetails={() => {}}
//               />
//             </div>
//             <div className="flex border-b border-gray-700/50 mb-4">
//               <button
//                 onClick={() => setActiveTab("reactions")}
//                 className={`px-4 py-2 text-sm font-medium ${
//                   activeTab === "reactions"
//                     ? "text-blue-400 border-b-2 border-blue-400"
//                     : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 Đã phản ứng ({message.messageReactions.length})
//               </button>
//               <button
//                 onClick={() => setActiveTab("seen")}
//                 className={`px-4 py-2 text-sm font-medium ${
//                   activeTab === "seen"
//                     ? "text-blue-400 border-b-2 border-blue-400"
//                     : "text-gray-400 hover:text-white"
//                 }`}
//               >
//                 Đã xem ({message.totalSeenMembers})
//               </button>
//             </div>
//             <div className="max-h-[300px] overflow-y-auto">
//               {activeTab === "reactions" ? (
//                 <div className="space-y-2">
//                   {message.messageReactions.length > 0 ? (
//                     message.messageReactions.map((reaction: any) => (
//                       <div
//                         key={reaction.id}
//                         className="flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-md"
//                       >
//                         <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center">
//                           {reaction.account.avatarPath ? (
//                             <img
//                               src={getMediaImage(reaction.account.avatarPath)}
//                               alt={reaction.account.fullName}
//                               className="w-8 h-8 rounded-full object-cover"
//                             />
//                           ) : (
//                             <UserIcon size={20} className="text-gray-300" />
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm text-gray-200">
//                             {reaction.account.fullName}
//                           </p>
//                           <p className="text-xs text-gray-400">
//                             {
//                               MESSAGE_REACTION_KIND_MAP[
//                                 Object.keys(MESSAGE_REACTION_KIND_MAP).find(
//                                   (key) =>
//                                     MESSAGE_REACTION_KIND_MAP[key].value ===
//                                     reaction.kind
//                                 ) as keyof typeof MESSAGE_REACTION_KIND_MAP
//                               ].label
//                             }
//                           </p>
//                         </div>
//                         <MESSAGE_REACTION_KIND_MAP[
//                           Object.keys(MESSAGE_REACTION_KIND_MAP).find(
//                             (key) =>
//                               MESSAGE_REACTION_KIND_MAP[key].value ===
//                               reaction.kind
//                           ) as keyof typeof MESSAGE_REACTION_KIND_MAP
//                         ].icon({
//                           size: 20,
//                           className:
//                             MESSAGE_REACTION_KIND_MAP[
//                               Object.keys(MESSAGE_REACTION_KIND_MAP).find(
//                                 (key) =>
//                                   MESSAGE_REACTION_KIND_MAP[key].value ===
//                                   reaction.kind
//                               ) as keyof typeof MESSAGE_REACTION_KIND_MAP
//                             ].className,
//                         })}
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-400 text-sm text-center">
//                       Chưa có phản ứng
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {message.seenMembers.length > 0 ? (
//                     message.seenMembers.map((member: any) => (
//                       <div
//                         key={member.id}
//                         className="flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-md"
//                       >
//                         <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center">
//                           {member.avatarPath ? (
//                             <img
//                               src={getMediaImage(member.avatarPath)}
//                               alt={member.fullName}
//                               className="w-8 h-8 rounded-full object-cover"
//                             />
//                           ) : (
//                             <UserIcon size={20} className="text-gray-300" />
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-200">
//                           {member.fullName}
//                         </p>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-gray-400 text-sm text-center">
//                       Chưa có ai xem
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

