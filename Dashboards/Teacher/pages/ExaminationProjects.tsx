import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { Project } from '../../../types';
import { Link } from 'react-router-dom';
import { Eye, Users, Loader2 } from 'lucide-react';

const ExaminationProjects = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await ApiCall({ route: 'teacher/examination-projects', verb: 'get' });
      if (response.status === 200) {
        setClasses(response.response.allClasses);
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
            <h2 className="text-2xl font-bold text-slate-800">Examination Projects</h2>
            <p className="text-slate-500">Projects assigned to you for evaluation and grading.</p>
         </div>
         <div className="bg-amber-50 px-4 py-3 rounded-lg border border-amber-100">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Examining Classes</p>
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
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                <Eye size={18} className="absolute top-4 right-4 text-amber-600 z-10" />
                
                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors z-10">
                  {project.title}
                </h3>
                
                <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wide z-10">{project.className}</p>

                <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1 z-10">{project.description}</p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center z-10">
                   <div className="flex -space-x-2">
                      {project.memberNames?.map((m, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600">
                            {m.name.charAt(0)}
                         </div>
                      ))}
                   </div>
                   <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Evaluate</span>
                </div>
             </div>
          </Link>
        ))}
         {projects.length === 0 && (
            <div className="col-span-3 py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <p>No projects assigned for examination.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ExaminationProjects;