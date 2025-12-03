
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ProjectStatus, Role } from '../types';
import { refineAbstract, summarizeProjectForSupervisor } from '../services/geminiService';
import { ArrowLeft, User, BookOpen, Bot, Send, CheckCircle, XCircle, UserPlus, Loader2, MessageSquare, Clock, Edit2, Save } from 'lucide-react';
import { MOCK_USERS } from '../constants';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProject, isLoading } = useData();
  const { user } = useAuth();
  
  const project = projects.find(p => p.id === id);
  const supervisors = MOCK_USERS.filter(u => u.role === Role.SUPERVISOR);

  const [aiLoading, setAiLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  
  // Ref for auto-scrolling comments
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [project?.comments]);

  useEffect(() => {
    if (project?.supervisorFeedback) {
      setFeedback(project.supervisorFeedback);
    }
  }, [project?.supervisorFeedback]);

  if (isLoading && !project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (!project) return <div className="text-center py-20 text-slate-500">Project not found</div>;

  const handleRefineAbstract = async () => {
    if (!project.abstract) return;
    setAiLoading(true);
    const feedback = await refineAbstract(project.abstract);
    updateProject(project.id, { aiFeedback: feedback });
    setAiLoading(false);
  };

  const handleGenerateSummary = async () => {
    setAiLoading(true);
    const result = await summarizeProjectForSupervisor(project.title, project.description, project.abstract);
    setSummary(result);
    setAiLoading(false);
  };

  const handleStatusChange = (status: ProjectStatus) => {
    const updates: any = { status };
    if (status === ProjectStatus.COMPLETED) {
      updates.progress = 100;
    } else if (status === ProjectStatus.PROPOSED) {
      updates.progress = 0;
    }
    updateProject(project.id, updates);
  };

  const handleAssignSupervisor = (supervisorId: string) => {
    if (!supervisorId) {
      updateProject(project.id, { supervisorId: undefined, supervisorName: undefined });
      return;
    }
    const supervisor = supervisors.find(s => s.id === supervisorId);
    if (supervisor) {
      updateProject(project.id, { 
        supervisorId: supervisor.id, 
        supervisorName: supervisor.name 
      });
    }
  };

  const handlePostComment = () => {
    if (!comment.trim() || !user) return;
    const newComment = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      text: comment,
      timestamp: new Date().toISOString()
    };
    // Optimistic update via Context
    updateProject(project.id, { comments: [...(project.comments || []), newComment] });
    setComment('');
  };

  const handleSaveFeedback = () => {
    updateProject(project.id, { supervisorFeedback: feedback });
    setIsEditingFeedback(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePostComment();
    }
  };

  const getAuthorRole = (authorId: string) => {
    const author = MOCK_USERS.find(u => u.id === authorId);
    return author?.role || 'USER';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Projects
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2 flex-1">
              <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                project.departmentType === 'TECHNOLOGY' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {project.departmentType.replace('_', ' ')}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pt-2">
                <span className="flex items-center"><BookOpen size={16} className="mr-1.5 text-indigo-500"/> {project.department}</span>
                <span className="flex items-center"><User size={16} className="mr-1.5 text-indigo-500"/> {project.studentName}</span>
                <span className="flex items-center"><Clock size={16} className="mr-1.5 text-indigo-500"/> Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                project.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                project.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {project.status.replace('_', ' ')}
              </span>
              
              <div className="w-48 bg-slate-100 rounded-full h-2.5 border border-slate-200 overflow-hidden relative group">
                 <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      project.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                  <div className="absolute -top-6 right-0 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.progress}% Complete
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Project Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{project.description}</p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-800">Abstract</h3>
                {(user?.role === Role.STUDENT || user?.role === Role.ADMIN) && (
                  <button 
                    onClick={handleRefineAbstract}
                    disabled={aiLoading}
                    className="flex items-center text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors font-medium disabled:opacity-70"
                  >
                    <Bot size={14} className="mr-1.5" />
                    {aiLoading ? 'Analyzing...' : 'AI Review'}
                  </button>
                )}
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-slate-700 font-serif leading-relaxed">
                {project.abstract || <span className="text-slate-400 italic">No abstract submitted yet.</span>}
              </div>
              
              {project.aiFeedback && (
                <div className="mt-4 bg-purple-50 p-5 rounded-xl border border-purple-100 animate-fade-in">
                  <h4 className="flex items-center text-sm font-bold text-purple-900 mb-2">
                    <Bot size={16} className="mr-2 text-purple-700" /> AI Feedback
                  </h4>
                  <p className="text-sm text-purple-800 whitespace-pre-line leading-relaxed">{project.aiFeedback}</p>
                </div>
              )}
            </section>

            {/* Supervisor Feedback Section */}
            <section className="bg-amber-50 border border-amber-100 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
                  <User size={20} /> Supervisor Feedback
                </h3>
                {user?.role === Role.SUPERVISOR && !isEditingFeedback && (
                  <button 
                    onClick={() => setIsEditingFeedback(true)}
                    className="text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
              </div>
              
              {isEditingFeedback ? (
                <div className="space-y-3">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback here..."
                    className="w-full p-3 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setIsEditingFeedback(false)}
                      className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveFeedback}
                      className="flex items-center gap-2 px-4 py-1.5 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      <Save size={16} /> Save Feedback
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-amber-800/90 leading-relaxed whitespace-pre-line">
                  {project.supervisorFeedback || <span className="italic opacity-70">No feedback provided yet.</span>}
                </div>
              )}
            </section>

            {/* Comments Section */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[500px] shadow-sm">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-600"/> Project Discussion
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">
                  {(project.comments || []).length} messages
                </span>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/30 space-y-4 scroll-smooth">
                {(!project.comments || project.comments.length === 0) && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <MessageSquare size={40} className="opacity-10" />
                    <p className="text-sm">No comments yet. Start the conversation!</p>
                  </div>
                )}
                
                {(project.comments || []).map(c => {
                  const isMe = c.authorId === user?.id;
                  const role = getAuthorRole(c.authorId);
                  
                  return (
                    <div key={c.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0 shadow-sm">
                            {c.authorName.charAt(0)}
                          </div>
                        )}
                        
                        <div className={`p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                        }`}>
                          <div className={`flex items-center gap-2 mb-1 text-xs ${isMe ? 'justify-end text-indigo-100' : 'justify-start text-slate-400'}`}>
                            {!isMe && <span className="font-bold text-slate-700">{c.authorName}</span>}
                            {!isMe && role === Role.SUPERVISOR && (
                              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Supervisor</span>
                            )}
                            {isMe && <span className="opacity-75">Me</span>}
                          </div>
                          {c.text}
                        </div>
                      </div>
                      <span className={`text-[10px] text-slate-400 mt-1 mx-11`}>
                        {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(c.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })}
                <div ref={commentsEndRef} />
              </div>
              
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
                  />
                  <button 
                    onClick={handlePostComment} 
                    disabled={!comment.trim()}
                    className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Info & Actions */}
          <div className="space-y-6">
            {/* Supervisor Actions */}
            {user?.role === Role.SUPERVISOR && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Supervisor Actions</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleStatusChange(ProjectStatus.APPROVED)}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition-all shadow-sm hover:shadow"
                  >
                    <CheckCircle size={18} /> <span>Approve Project</span>
                  </button>
                  <button 
                    onClick={() => handleStatusChange(ProjectStatus.REJECTED)}
                    className="w-full flex items-center justify-center space-x-2 bg-white text-rose-600 border border-rose-200 py-2.5 rounded-lg hover:bg-rose-50 transition-all"
                  >
                    <XCircle size={18} /> <span>Reject Project</span>
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100">
                   <div className="flex justify-between items-center mb-3">
                     <h5 className="font-medium text-slate-700 flex items-center gap-2">
                       <Bot size={16} className="text-indigo-600"/> AI Summary
                     </h5>
                     <button 
                      onClick={handleGenerateSummary} 
                      disabled={aiLoading}
                      className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                     >
                       {summary ? 'Regenerate' : 'Generate'}
                     </button>
                   </div>
                   {aiLoading && <p className="text-xs text-slate-400 animate-pulse">Generating summary...</p>}
                   {summary && (
                     <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                       {summary}
                     </div>
                   )}
                </div>
              </div>
            )}

            {/* Project Details Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4">Project Info</h4>
              <dl className="space-y-4 text-sm">
                <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <dt className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Status</dt>
                  <dd className="font-medium text-slate-900">
                    <select 
                        value={project.status}
                        onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                        {Object.values(ProjectStatus).map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                    </select>
                  </dd>
                </div>

                <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <dt className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Progress</dt>
                  <dd className="font-medium text-slate-900 flex items-center gap-3">
                    <input 
                        type="range"
                        min="0"
                        max="100"
                        value={project.progress}
                        onChange={(e) => updateProject(project.id, { progress: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-xs font-bold text-indigo-600 w-8">{project.progress}%</span>
                  </dd>
                </div>

                <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <dt className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1 flex items-center justify-between">
                    Supervisor
                    {user?.role === Role.ADMIN && <UserPlus size={14} className="text-indigo-500" />}
                  </dt>
                  <dd className="font-medium text-slate-900">
                    {user?.role === Role.ADMIN ? (
                      <select 
                        value={project.supervisorId || ""}
                        onChange={(e) => handleAssignSupervisor(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      >
                        <option value="">Select Supervisor...</option>
                        {supervisors.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} {s.department ? `(${s.department})` : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      project.supervisorName || <span className="text-amber-600 italic">Pending Assignment</span>
                    )}
                  </dd>
                </div>
                <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <dt className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Student ID</dt>
                  <dd className="font-medium text-slate-900 uppercase tracking-wide">{project.studentId}</dd>
                </div>
                <div className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <dt className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Created</dt>
                  <dd className="font-medium text-slate-900">{new Date(project.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
            
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium border border-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
