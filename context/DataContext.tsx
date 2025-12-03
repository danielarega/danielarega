import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Department, Task, Note } from '../types';
import { DEPARTMENTS } from '../constants';
import { api } from '../services/api';

interface DataContextType {
  projects: Project[];
  departments: Department[];
  tasks: Task[];
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  
  // Project Methods
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectsByDepartment: (dept: string) => Project[];
  getProjectsByStudent: (studentId: string) => Project[];
  getProjectsBySupervisor: (supervisorId: string) => Project[];
  
  // Task Methods
  refreshTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Note Methods
  addNote: (text: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [projectsData, tasksData, notesData] = await Promise.all([
        api.getProjects(),
        api.getTasks(),
        api.getNotes()
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
      setNotes(notesData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Project Handlers
  const addProject = async (project: Project) => {
    try {
      const newProject = await api.createProject(project);
      setProjects(prev => [newProject, ...prev]);
    } catch (err) {
      console.error("Failed to create project:", err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      await api.updateProject(id, updates);
    } catch (err) {
      console.error("Failed to update project:", err);
      setError("Failed to save changes.");
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setProjects(prev => prev.filter(p => p.id !== id));
      await api.deleteProject(id);
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Task Handlers
  const refreshTasks = async () => {
    const data = await api.getTasks();
    setTasks(data);
  };

  const addTask = async (task: Task) => {
    try {
      const newTask = await api.createTask(task);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      await api.updateTask(id, updates);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasks(prev => prev.filter(t => t.id !== id));
      await api.deleteTask(id);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  // Note Handlers
  const addNote = async (text: string) => {
    try {
      const newNote = await api.createNote(text);
      setNotes(prev => [...prev, newNote]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      setNotes(prev => prev.filter(n => n.id !== id));
      await api.deleteNote(id);
    } catch (err) {
      console.error(err);
    }
  };

  const getProjectsByDepartment = (dept: string) => projects.filter(p => p.department === dept);
  const getProjectsByStudent = (studentId: string) => projects.filter(p => p.studentId === studentId);
  const getProjectsBySupervisor = (supervisorId: string) => projects.filter(p => p.supervisorId === supervisorId);

  return (
    <DataContext.Provider value={{
      projects,
      departments: DEPARTMENTS,
      tasks,
      notes,
      isLoading,
      error,
      addProject,
      updateProject,
      deleteProject,
      getProjectsByDepartment,
      getProjectsByStudent,
      getProjectsBySupervisor,
      refreshTasks,
      addTask,
      updateTask,
      deleteTask,
      addNote,
      deleteNote
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};