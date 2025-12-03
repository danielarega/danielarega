import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  PlusCircle, 
  Users, 
  BrainCircuit,
  GraduationCap,
  ListTodo,
  StickyNote
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <>{children}</>;

  const isActive = (path: string) => location.pathname === path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700/50';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-indigo-800 flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-indigo-300" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Arsi University</h1>
            <p className="text-xs text-indigo-300">FYP & Thesis System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/')}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link to="/projects" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/projects')}`}>
            <BookOpen size={20} />
            <span className="font-medium">All Projects</span>
          </Link>
          
          {(user.role === 'STUDENT' || user.role === 'SUPERVISOR') && (
             <Link to="/project-management" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/project-management')}`}>
               <ListTodo size={20} />
               <span className="font-medium">My Tasks</span>
             </Link>
          )}

          <Link to="/ai-assistant" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/ai-assistant')}`}>
            <BrainCircuit size={20} />
            <span className="font-medium">AI Assistant</span>
          </Link>
          
          <Link to="/personal-notes" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/personal-notes')}`}>
            <StickyNote size={20} />
            <span className="font-medium">Personal Notes</span>
          </Link>

          {user.role === 'ADMIN' && (
            <Link to="/users" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/users')}`}>
              <Users size={20} />
              <span className="font-medium">Users</span>
            </Link>
          )}

          {user.role === 'STUDENT' && (
            <Link to="/submit" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/submit')}`}>
              <PlusCircle size={20} />
              <span className="font-medium">New Submission</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-indigo-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-indigo-300 truncate capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center space-x-2 bg-indigo-800 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};