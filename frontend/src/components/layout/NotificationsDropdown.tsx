import React, { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import type { Notification } from '../../types/notification';
import { notificationsService } from '../../api/notificationsService';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface NotificationsDropdownProps {
  socket: Socket;
  userId: number;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ socket, userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await notificationsService.getByUserId(userId);
      setNotifications(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
    }
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadNotifications();

    const handleNewNotif = (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
    };

    socket.on('notification', handleNewNotif);

    return () => {
      socket.off('notification', handleNewNotif);
    };
  }, [loadNotifications, socket]);

  const markAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Erreur lors du marquage comme lu:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Bouton notifications */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded hover:bg-indigo-50 transition-colors"
        aria-label="Notifications"
      >
        <NotificationsIcon style={{ color: '#1e293b' }} /> {/* texte noir foncé */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Liste déroulante */}
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
                onClick={() => !notif.read && markAsRead(notif.id)}
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

export default NotificationsDropdown;
