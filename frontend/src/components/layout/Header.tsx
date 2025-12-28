import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Link } from 'react-router-dom';
import type { Notification } from '../../types/notification';
import { notificationsService } from '../../api/notificationsService';

const socket: Socket = io('http://localhost:3000', {
  query: { userId: 1 }
});

export function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const userId = 1; 

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
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on('notification', handleNewNotif);

    return () => {
      socket.off('notification', handleNewNotif);
    };
  }, [loadNotifications]);

  const markAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Erreur lors du marquage comme lu:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">NoteApp</Link>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative p-2 rounded hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <span role="img" aria-label="cloche">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-xl max-h-96 overflow-y-auto z-50">
            <div className="p-2 border-b bg-gray-50 font-semibold text-sm text-gray-700">
              Notifications
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-500 text-center text-sm">
                Aucune notification
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className={`p-3 border-b cursor-pointer transition-colors ${
                    !notif.read 
                      ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
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
    </header>
  );
}