import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { Search, Filter, Book, Cpu } from 'lucide-react';
import { DepartmentType, ProjectStatus } from '../types';

export const Projects: React.FC = () => {
  const { projects, departments } = useData();
  const [filterType, setFilterType] = useState<DepartmentType | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (project.studentName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || project.departmentType === filterType;
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Projects & Theses</h2>
          <p className="text-slate-500">Browse all academic works across departments.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setFilterType('ALL')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
           >
             All
           </button>
           <button 
             onClick={() => setFilterType(DepartmentType.TECHNOLOGY)}
             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${filterType === DepartmentType.TECHNOLOGY ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
           >
             <Cpu size={16} /> Technology
           </button>
           <button 
             onClick={() => setFilterType(DepartmentType.SOCIAL_SCIENCE)}
             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${filterType === DepartmentType.SOCIAL_SCIENCE ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
           >
             <Book size={16} /> Social Science
           </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
          >
            <option value="ALL">All Statuses</option>
            {Object.values(ProjectStatus).map(s => (
              <option key={s as string} value={s as string}>{(s as string).replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Link key={project.id} to={`/project/${project.id}`} className="block group">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
              <div className={`h-2 ${project.departmentType === DepartmentType.TECHNOLOGY ? 'bg-blue-500' : 'bg-emerald-500'}`} />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    project.status === ProjectStatus.COMPLETED ? 'bg-green-100 text-green-700' : 
                    project.status === ProjectStatus.IN_PROGRESS ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {(project.status as string).replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>
                
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">
                  {project.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="font-medium">{project.department}</span>
                    <span className="text-slate-400">By {project.studentName}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};