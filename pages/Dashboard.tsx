import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ProjectStatus, DepartmentType, Role } from '../types';
import { FileText, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { projects, departments, isLoading } = useData();

  const stats = useMemo(() => {
    return {
      total: projects.length,
      completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
      inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
      proposed: projects.filter(p => p.status === ProjectStatus.PROPOSED).length,
    };
  }, [projects]);

  const deptData = useMemo(() => {
    return departments.map(dept => ({
      name: dept.name,
      count: projects.filter(p => p.department === dept.name).length
    })).filter(d => d.count > 0);
  }, [departments, projects]);

  const statusData = useMemo(() => {
    return [
      { name: 'Proposed', value: stats.proposed },
      { name: 'In Progress', value: stats.inProgress },
      { name: 'Completed', value: stats.completed },
    ];
  }, [stats]);

  // Filter projects for student/supervisor specific views
  const myProjects = useMemo(() => {
    if (user?.role === Role.STUDENT) {
      return projects.filter(p => p.studentId === user.id);
    }
    if (user?.role === Role.SUPERVISOR) {
      return projects.filter(p => p.supervisorId === user.id);
    }
    return projects; // Admin sees all
  }, [projects, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name}</h2>
        <p className="text-slate-500 mt-2">Here's an overview of the current academic projects and theses.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Projects</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FileText size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{stats.inProgress}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{stats.completed}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Review</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{projects.filter(p => p.status === ProjectStatus.SUBMITTED).length}</p>
            </div>
            <div className="bg-rose-100 p-3 rounded-full text-rose-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-slate-800">
              {user?.role === Role.ADMIN ? 'Department Distribution' : 'My Active Projects'}
            </h3>
            {user?.role !== Role.ADMIN && (
              <Link to="/projects" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
            )}
          </div>
          
          <div className="p-6 flex-1 min-h-[300px]">
             {user?.role === Role.ADMIN ? (
               <ResponsiveContainer width="100%" height={300}>
                 <BarChart data={deptData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" height={60} />
                   <YAxis />
                   <Tooltip />
                   <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="space-y-4">
                 {myProjects.length === 0 ? (
                   <p className="text-slate-500 text-center py-10">No projects found.</p>
                 ) : (
                   myProjects.slice(0, 5).map(project => (
                     <div key={project.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                       <div>
                         <h4 className="font-medium text-slate-900">{project.title}</h4>
                         <p className="text-sm text-slate-500">{project.department} • {project.status}</p>
                       </div>
                       <div className="text-right">
                         <div className="text-sm font-semibold text-indigo-600">{project.progress}%</div>
                         <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1">
                           <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                         </div>
                       </div>
                     </div>
                   ))
                 )}
               </div>
             )}
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-lg text-slate-800">Status Overview</h3>
          </div>
          <div className="p-6 flex items-center justify-center flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};