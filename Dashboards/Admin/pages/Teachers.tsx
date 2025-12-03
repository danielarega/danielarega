
import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { Teacher } from '../../../types';
import { Mail, Briefcase, User } from 'lucide-react';

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await ApiCall({ route: 'admin/teachers', verb: 'get' });
      if (response.status === 200) {
        setTeachers(response.response.teachers);
      }
      setLoading(false);
    };
    fetchTeachers();
  }, []);

  if (loading) return <div className="text-center py-10 text-indigo-600">Loading Faculty...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Faculty Members</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Add Teacher</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Name / ID</th>
              <th className="px-6 py-3">Designation</th>
              <th className="px-6 py-3">Workload</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {teacher.name.charAt(0)}
                     </div>
                     <div>
                       <div className="font-medium text-slate-900">{teacher.name}</div>
                       <div className="text-xs text-slate-400">{teacher.empId}</div>
                     </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600 flex w-fit items-center gap-1">
                     <Briefcase size={12} /> {teacher.designation}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                         <div 
                           className={`h-2 rounded-full ${teacher.assignedProjectsCount >= teacher.projectsLimit ? 'bg-red-500' : 'bg-green-500'}`} 
                           style={{width: `${(teacher.assignedProjectsCount / teacher.projectsLimit) * 100}%`}}
                         ></div>
                      </div>
                      <span className="text-xs font-medium">{teacher.assignedProjectsCount}/{teacher.projectsLimit}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <button className="text-indigo-600 hover:underline font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
