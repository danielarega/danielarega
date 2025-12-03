
import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { BookOpen, Users, Calendar } from 'lucide-react';

const Classes = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await ApiCall({ route: 'admin/classes', verb: 'get' });
      if (response.status === 200) {
        setClasses(response.response.classes);
      }
      setLoading(false);
    };
    fetchClasses();
  }, []);

  if (loading) return <div className="text-center py-10 text-indigo-600">Loading Classes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Manage Classes</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Add Class</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-indigo-900">{cls.name}</h3>
                <p className="text-sm text-slate-500">{cls.program} • {cls.session}</p>
              </div>
              <div className="bg-indigo-50 p-2 rounded-full text-indigo-600">
                <BookOpen size={20} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Users size={16}/> Students</span>
                <span className="font-medium text-slate-800">{cls.totalStudents}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Calendar size={16}/> Projects</span>
                <span className="font-medium text-slate-800">{cls.totalProjects}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                 <div className="bg-indigo-500 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
               <button className="flex-1 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
