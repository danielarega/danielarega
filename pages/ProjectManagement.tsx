import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Task, Role, Project } from '../types';
import { Plus, Calendar, CheckCircle2, Circle, Clock, Trash2, AlertCircle } from 'lucide-react';

export const ProjectManagement: React.FC = () => {
  const { user } = useAuth();
  const { tasks, projects, addTask, updateTask, deleteTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [phase, setPhase] = useState<Task['phase']>('Planning');
  const [deadline, setDeadline] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Filter projects relevant to user
  const myProjects = useMemo(() => {
    if (!user) return [];
    if (user.role === Role.STUDENT) return projects.filter(p => p.studentId === user.id);
    if (user.role === Role.SUPERVISOR) return projects.filter(p => p.supervisorId === user.id);
    return projects;
  }, [projects, user]);

  // Filter tasks
  const myTasks = useMemo(() => {
    if (!user) return [];
    if (user.role === Role.STUDENT) return tasks.filter(t => t.assignedToId === user.id);
    // Supervisors see tasks for their projects
    const myProjectIds = myProjects.map(p => p.id);
    return tasks.filter(t => myProjectIds.includes(t.projectId));
  }, [tasks, user, myProjects]);

  const todoTasks = myTasks.filter(t => t.status !== 'Completed');
  const completedTasks = myTasks.filter(t => t.status === 'Completed');

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // If no project selected, pick the first one
    const pid = selectedProjectId || (myProjects.length > 0 ? myProjects[0].id : '');
    if (!pid) {
        alert("You must be assigned to a project to create a task.");
        return;
    }

    const newTask: Task = {
      id: '', // API handles ID
      projectId: pid,
      title,
      phase,
      assignedTo: user.name,
      assignedToId: user.id,
      startDate: new Date().toISOString(),
      deadline,
      status: 'Pending'
    };

    await addTask(newTask);
    setIsModalOpen(false);
    setTitle('');
    setDeadline('');
  };

  const toggleStatus = (task: Task) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    const endDate = newStatus === 'Completed' ? new Date().toISOString() : undefined;
    updateTask(task.id, { status: newStatus, endDate });
  };

  const getPhaseColor = (phase: string) => {
    switch(phase) {
      case 'Planning': return 'bg-blue-100 text-blue-700';
      case 'Design': return 'bg-purple-100 text-purple-700';
      case 'Implementation': return 'bg-amber-100 text-amber-700';
      case 'Testing': return 'bg-pink-100 text-pink-700';
      case 'Deployment': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (myProjects.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-96">
              <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">No Projects Found</h3>
              <p className="text-slate-500 mt-2">You need to be assigned to a project to manage tasks.</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Project Management</h2>
          <p className="text-slate-500">Track your progress and deliverables.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TODO COLUMN */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <Circle className="text-indigo-500" size={20} /> To Do
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{todoTasks.length}</span>
          </h3>
          
          <div className="space-y-3">
            {todoTasks.length === 0 && <p className="text-slate-400 text-sm italic">No active tasks. Great job!</p>}
            {todoTasks.map(task => (
              <div key={task.id} className="p-4 bg-slate-50 border border-slate-100 rounded-lg hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                       <span className={`text-xs px-2 py-0.5 rounded font-medium ${getPhaseColor(task.phase)}`}>
                         {task.phase}
                       </span>
                       <span className="text-xs text-slate-500 flex items-center gap-1">
                         <Calendar size={12} /> {new Date(task.deadline).toLocaleDateString()}
                       </span>
                       {new Date(task.deadline) < new Date() && (
                           <span className="text-xs text-rose-600 font-bold">Overdue</span>
                       )}
                    </div>
                  </div>
                  <button onClick={() => toggleStatus(task)} className="text-slate-300 hover:text-emerald-500 transition-colors">
                    <CheckCircle2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED COLUMN */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={20} /> Completed
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">{completedTasks.length}</span>
          </h3>

          <div className="space-y-3">
            {completedTasks.length === 0 && <p className="text-slate-400 text-sm italic">No completed tasks yet.</p>}
            {completedTasks.map(task => (
              <div key={task.id} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity">
                 <div>
                   <h4 className="font-medium text-slate-700 line-through">{task.title}</h4>
                   <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                     Completed on {task.endDate ? new Date(task.endDate).toLocaleDateString() : 'N/A'}
                   </p>
                 </div>
                 <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                   <Trash2 size={18} />
                 </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Design Database Schema"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Phase</label>
                <select 
                  value={phase}
                  onChange={e => setPhase(e.target.value as Task['phase'])}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                >
                  <option value="Planning">Planning</option>
                  <option value="Design">Design</option>
                  <option value="Implementation">Implementation</option>
                  <option value="Testing">Testing</option>
                  <option value="Deployment">Deployment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input 
                  type="date" 
                  required 
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              {myProjects.length > 1 && (
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">For Project</label>
                    <select 
                      value={selectedProjectId} 
                      onChange={e => setSelectedProjectId(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg outline-none"
                    >
                        {myProjects.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                 </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};