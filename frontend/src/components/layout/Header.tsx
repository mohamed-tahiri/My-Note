import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import NotificationsDropdown from './NotificationsDropdown';
import ChatsDropdown from './ChatsDropdown';

const socket = io('http://localhost:3000', { query: { userId: 1 } });

export default function Header() {
  const userId = 1;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          My Note
        </Link>
        <div className='flex items-center space-x-2'>
          <nav className="hidden md:flex space-x-6 text-gray-700">
            <Link to="/notes" className="hover:text-indigo-500 transition-colors">Notes</Link>
            <Link to="/tasks" className="hover:text-indigo-500 transition-colors">Tasks</Link>
            <Link to="/appointments" className="hover:text-indigo-500 transition-colors">Appointments</Link>
          </nav>
          <ChatsDropdown socket={socket} userId={userId} />  
          <NotificationsDropdown socket={socket} userId={userId} />
        </div>
      </div>
    </header>
  );
}
