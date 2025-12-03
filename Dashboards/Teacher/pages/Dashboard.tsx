import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { DashboardData } from '../../../types';
import { FileText, Users, BookOpen, AlertCircle, Loader2, Eye } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ApiCall({ route: 'teacher/dashboard', verb: 'get' });
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
        <h2 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h2>
        <p className="text-slate-500">Manage your supervision and examination duties.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Supervision Classes</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data?.classesSupervision}</h3>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Users size={24} /></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Examination Classes</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data?.classesExamination}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><BookOpen size={24} /></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Projects Supervised</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data?.projectsSupervision} <span className="text-sm text-slate-400 font-normal">/ {data?.projectsSupervisionLimit}</span></h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileText size={24} /></div>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
             <div className="bg-blue-500 h-full rounded-full" style={{width: `${((data?.projectsSupervision || 0) / (data?.projectsSupervisionLimit || 1)) * 100}%`}}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">To Examine</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">{data?.projectsExamination}</h3>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Eye size={24} /></div>
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4">Recent Notices</h3>
            <div className="space-y-4">
              {data?.notices?.map((notice: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-indigo-900 text-sm">{notice.headline}</h4>
                     <span className="text-xs text-slate-400">{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 text-sm mt-1">{notice.description}</p>
                </div>
              ))}
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <AlertCircle size={40} className="opacity-20 mb-2" />
            <p>No new notifications from PMO</p>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;