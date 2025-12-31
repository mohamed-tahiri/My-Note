import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import type { Notification } from '@/types/notification';
import { getByUserId, markAsRead } from '@/api/notificationsService';
import ChatIcon from '@mui/icons-material/Chat';
import { logger } from '@/utils/logger';

interface ChatsDropdownProps {
  socket: Socket;
  userId: number;
}

const ChatsDropdown: React.FC<ChatsDropdownProps> = ({ socket, userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await getByUserId(userId);
      setNotifications(res.data);
    } catch (err) {
      logger.error('Erreur lors du chargement des notifications:', err);
    }
  }, [userId]);

  useEffect(() => {
    const initializeNotes = async () => {
      await loadNotifications();
    };

    initializeNotes();

    const handleNewNotif = (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
    };

    socket.on('notification', handleNewNotif);

    return () => {
      socket.off('notification', handleNewNotif);
    };
  }, [loadNotifications, socket]);

  const markAsReadNoti = async (id: number) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      logger.error('Erreur lors du marquage comme lu:', err);
    }
  };

  // === Gestion clic en dehors ===
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded hover:bg-indigo-50 transition-colors"
        aria-label="Notifications"
      >
        <ChatIcon style={{ color: '#1e293b' }} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg max-h-96 overflow-y-auto z-50">
          <div className="px-2 py-4 font-semibold text-sm text-indigo-700">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-center text-sm">
              Aucune notification
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => !notif.read && markAsReadNoti(notif.id)}
                className={`p-3 cursor-pointer transition-colors ${
                  !notif.read
                    ? 'bg-indigo-100 hover:bg-indigo-200 border-l-4 border-l-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <p className={`text-sm ${!notif.read ? 'font-semibold text-indigo-900' : 'text-gray-700'}`}>
                  {notif.content}
                </p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChatsDropdown;
