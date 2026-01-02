// import { useEffect, useRef, useState } from 'react';
// import type { Notification } from '@/types/notification';
// import { Socket } from 'socket.io-client';
// import CloseIcon from '@mui/icons-material/Close';

// interface ChatModalProps {
//   chat: Notification;
//   socket: Socket;
//   onClose: () => void;
// }

// export const ChatModal = ({
//   chat,
//   onClose,
// }: ChatModalProps) => {
//   const [messages] = useState<Notification[]>([chat]);
//   const endRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border rounded-xl shadow-xl flex flex-col z-50">
      
//       {/* Header */}
//       <div className="px-3 py-2 border-b flex justify-between items-center">
//         <span className="font-semibold text-sm">
//           Chat 
//         </span>
//         <button onClick={onClose}>
//           <CloseIcon fontSize="small" />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50">
//         {messages.map(m => (
//           <div
//             key={m.id}
//             className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm max-w-[75%] ml-auto"
//           >
//             {m.content}
//           </div>
//         ))}
//         <div ref={endRef} />
//       </div>

//       {/* Input */}
//       <div className="border-t p-2">
//         <input
//           type="text"
//           placeholder="Écrire un message..."
//           className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none"
//         />
//       </div>
//     </div>
//   );
// };
