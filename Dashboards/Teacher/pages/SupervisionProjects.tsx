import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { Project } from '../../../types';
import { Link } from 'react-router-dom';
import { Users, FileText, Loader2 } from 'lucide-react';

const SupervisionProjects = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ApiCall({ route: 'teacher/supervision-projects', verb: 'get' });
      if (response.status === 200) {
        setClasses(response.response.allClasses);
        // Flatten all projects from all classes for the view
        const allProjs = response.response.allProjects.flatMap((group: any) => group.classProjects);
        setProjects(allProjs);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Supervision Projects</h2>
            <p className="text-slate-500">Manage students and projects under your supervision.</p>
         </div>
         <div className="bg-indigo-50 px-4 py-3 rounded-lg border border-indigo-100">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Active Classes</p>
            <div className="flex gap-2 mt-1">
               {classes.map(c => (
                   <span key={c.id} className="bg-white px-2 py-1 rounded text-xs font-medium text-slate-600 border border-slate-200 shadow-sm">{c.name}</span>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} to={`/project/${project.id}`} className="block group">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all h-full flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                   <Users size={16} />
                   <span>{project.memberNames?.length} Members</span>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">{project.description}</p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                      {project.status}
                   </span>
                   <span className="text-xs text-slate-400">View Details →</span>
                </div>
             </div>
          </Link>
        ))}
        {projects.length === 0 && (
            <div className="col-span-3 py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <p>No projects assigned for supervision yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SupervisionProjects;