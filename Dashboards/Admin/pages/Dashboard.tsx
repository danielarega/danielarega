import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { DashboardData } from '../../../types';
import { Users, BookOpen, GraduationCap, AlertCircle, FileText } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ApiCall({ route: 'admin/dashboard', verb: 'get' });
      if (response.status === 200) {
        setData(response.response);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10 text-indigo-600">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Classes</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{data?.classes}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600"><BookOpen size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Students</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{data?.students}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600"><GraduationCap size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-500 text-sm font-medium">Supervisors</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{data?.supervisors}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Users size={24}/></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-slate-500 text-sm font-medium">Active Projects</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{data?.projects}</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-full text-amber-600"><FileText size={24}/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Notice Board</h3>
          <div className="space-y-4">
            {data?.notices?.map((notice: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex justify-between items-start">
                   <h4 className="font-bold text-indigo-900">{notice.headline}</h4>
                   <span className="text-xs text-slate-400">{new Date(notice.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 text-sm mt-1">{notice.description}</p>
                <div className="mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded">
                   To: {notice.receiverName}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
           <p>Charts & Statistics Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;