
import React, { useEffect, useState } from 'react';
import { ApiCall } from '../api/apiCall';
import { Project } from '../types';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const Submissions = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await ApiCall({ route: 'student/project', verb: 'get' });
      if (response.status === 200) {
        setProject(response.response.project);
      }
      setLoading(false);
    };
    fetchProject();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!project) return <div className="text-center py-20 text-red-500">You are not assigned to a project yet.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Submissions</h2>
            <p className="text-slate-500">Track and upload your project deliverables.</p>
         </div>
         <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium text-sm">
            {project.departmentType === 'TECHNOLOGY' ? 'Group Project' : 'Thesis'}
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Milestones</h3>
            <span className="text-xs text-slate-500">Project: {project.title}</span>
         </div>
         
         <div className="divide-y divide-slate-100">
            {project.milestones?.map((milestone, idx) => (
               <div key={idx} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                     <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        milestone.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                        milestone.status === 'Submitted' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 text-slate-400'
                     }`}>
                        {milestone.status === 'Approved' ? <CheckCircle size={18}/> : 
                         milestone.status === 'Submitted' ? <FileText size={18}/> :
                         <span className="font-bold text-xs">{idx + 1}</span>}
                     </div>
                     <div>
                        <h4 className={`font-medium ${milestone.status === 'Approved' ? 'text-slate-900' : 'text-slate-700'}`}>{milestone.name}</h4>
                        <p className="text-sm text-slate-500 mt-1">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                     {milestone.status === 'Pending' && (
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                           <Upload size={16} /> Upload
                        </button>
                     )}
                     {milestone.status === 'Submitted' && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Under Review</span>
                     )}
                     {milestone.status === 'Approved' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</span>
                     )}
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Submissions;
