import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { DashboardData } from '../../../types';
import { Calendar, CheckCircle, Circle, AlertCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ApiCall({ route: 'student/dashboard', verb: 'get' });
      if (response.status === 200) {
        setData(response.response);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
        <p className="text-slate-500">Overview of your pending tasks and university notices.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Todo List Section */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-lg text-slate-700">My Todo List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(!data?.myTodoList || data.myTodoList.length === 0) && (
               <div className="col-span-2 p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-400">
                 <CheckCircle className="mx-auto mb-2 h-10 w-10 opacity-20" />
                 <p>Hurray! No pending tasks.</p>
               </div>
            )}
            {data?.myTodoList?.map((todo: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all">
                <div className="flex justify-between items-start mb-3">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                     todo.phase === 'Planning' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                   }`}>{todo.phase}</span>
                   {todo.status === 'Pending' ? <Circle size={18} className="text-amber-500" /> : <CheckCircle size={18} className="text-emerald-500" />}
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{todo.title}</h4>
                <div className="flex items-center text-sm text-slate-500">
                   <Calendar size={14} className="mr-1.5" />
                   Due: {new Date(todo.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-indigo-600" /> Notice Board
          </h3>
          <div className="space-y-4">
            {data?.notices?.map((notice: any, idx: number) => (
              <div key={idx} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <h5 className="font-semibold text-slate-800 text-sm">{notice.headline}</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notice.description}</p>
                <span className="text-[10px] text-slate-400 mt-2 block">{new Date(notice.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;