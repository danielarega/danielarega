import React, { useEffect, useState } from 'react';
import { ApiCall } from '../../../api/apiCall';
import { Project } from '../../../types';
import { FileText, User, Calendar } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await ApiCall({ route: 'admin/projects', verb: 'get' });
      if (response.status === 200) {
        setProjects(response.response.projects);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center py-10 text-indigo-600">Loading Projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">All Projects</h2>
        <div className="text-sm text-slate-500">Total: {projects.length}</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Project Title</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Supervisor</th>
                <th className="px-6 py-3">Members</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-indigo-500" />
                        {project.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">{project.className}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" />
                        {project.supervisorName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                        {project.memberNames?.map(m => (
                            <span key={m.id} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{m.name}</span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'Proposed' ? 'bg-amber-100 text-amber-800' :
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        'bg-slate-100 text-slate-800'
                    }`}>
                        {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Projects;