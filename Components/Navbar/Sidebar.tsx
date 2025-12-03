import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap } from 'lucide-react';
import { useDispatch, authActions } from '../../store/index';

const Sidebar = (props: any) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    window.location.href = "/login";
  };

  const sidebarLinks = props.links.map((link: any, index: number) => {
    const isActive = location.pathname === link.path;
    return (
      <Link
        to={link.path}
        key={index}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
          isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700/50'
        }`}
      >
        <div className="text-xl">{link.icon}</div>
        <div className="font-medium text-sm">{link.name}</div>
      </Link>
    );
  });

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-indigo-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-indigo-800 flex items-center space-x-3">
          <GraduationCap className="h-8 w-8 text-indigo-300" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Arsi University</h1>
            <p className="text-xs text-indigo-300">FYPMS</p>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {sidebarLinks}
        </nav>

        <div className="p-4 border-t border-indigo-800">
           <div className="flex items-center space-x-3 mb-4 px-2">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white uppercase">
               {props.user.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-semibold truncate">{props.user.name}</p>
               <p className="text-xs text-indigo-300 truncate">ID: {props.user.id}</p>
             </div>
           </div>
           <button 
             onClick={logoutHandler}
             className="w-full flex items-center justify-center space-x-2 bg-indigo-800 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-colors text-white"
           >
             <LogOut size={16} />
             <span>Logout</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* Topbar could go here if extracted */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-slate-700">Welcome, <span className="text-indigo-600">{props.user.name}</span></h2>
        </div>
        <div className="p-8">
          {props.children}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;