import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';

const ChatsDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded hover:bg-indigo-50 transition"
        aria-label="Chat"
      >
        <ChatIcon className="text-slate-800" />   
      </button>

      {/* Chat window */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded shadow-lg max-h-96 overflow-y-auto z-50">
          
          {/* Header */}
          <div className="px-2 py-4 font-semibold text-sm text-indigo-700">
            Messages
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50">
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-b border-indigo-100">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                <PersonIcon />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    Chat Name
                  </p>
                  <span className="text-[10px] text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate mt-1">
                  Last message preview...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatsDropdown;
