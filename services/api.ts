
import { DashboardData, Project, Task, Note, DepartmentType } from '../types';
import { INITIAL_PROJECTS, TECH_MILESTONES_TEMPLATE, SOCIAL_MILESTONES_TEMPLATE, MOCK_USERS } from '../constants';

// THIS SERVICE SIMULATES A MERN BACKEND (Node.js/Express + MongoDB)
const NETWORK_DELAY = 600; 

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate MongoDB Database access
const getDB = (): Project[] => {
  const stored = localStorage.getItem('uni_projects');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('uni_projects', JSON.stringify(INITIAL_PROJECTS));
  return INITIAL_PROJECTS;
};

const saveDB = (projects: Project[]) => {
  localStorage.setItem('uni_projects', JSON.stringify(projects));
};

// Task DB
const getTaskDB = (): Task[] => {
  const stored = localStorage.getItem('uni_tasks');
  if (stored) return JSON.parse(stored);
  return [];
};

const saveTaskDB = (tasks: Task[]) => {
  localStorage.setItem('uni_tasks', JSON.stringify(tasks));
};

// Notes DB
const getNotesDB = (): Note[] => {
  const stored = localStorage.getItem('uni_notes');
  if (stored) return JSON.parse(stored);
  return [];
}

const saveNotesDB = (notes: Note[]) => {
  localStorage.setItem('uni_notes', JSON.stringify(notes));
}

// Mock Data Stores for Admin Views
const MOCK_NOTICES = [
  { id: 'n1', headline: 'Proposal Submission Deadline', description: 'Please submit your proposals by next Friday.', receiverEntity: 'class', receiverName: 'BSCS-2024', createdAt: new Date().toISOString() },
  { id: 'n2', headline: 'Defense Schedule', description: 'Final defense will start from June 15th.', receiverEntity: 'class', receiverName: 'BSIT-2024', createdAt: new Date().toISOString() }
];

const MOCK_CLASSES = [
  { id: 'c1', name: 'BSCS-Morning-2024', totalStudents: 45, totalProjects: 12, assignedSupervisors: 5, program: 'BSCS', session: '2024' },
  { id: 'c2', name: 'BSIT-Evening-2024', totalStudents: 30, totalProjects: 8, assignedSupervisors: 3, program: 'BSIT', session: '2024' }
];

const MOCK_TEACHERS = [
  { id: 't1', name: 'Dr. Solomon', empId: 'EMP001', designation: 'Professor', projectsLimit: 10, assignedProjectsCount: 5 },
  { id: 't2', name: 'Prof. Azeb', empId: 'EMP002', designation: 'Lecturer', projectsLimit: 8, assignedProjectsCount: 8 }
];

export const api = {
  // --- PROJECTS ---
  getProjects: async (): Promise<Project[]> => {
    await delay(NETWORK_DELAY);
    const projects = getDB();
    return projects;
  },

  getProjectById: async (id: string): Promise<Project | undefined> => {
    await delay(NETWORK_DELAY);
    return getDB().find(p => p.id === id);
  },

  createProject: async (project: Project): Promise<Project> => {
    await delay(NETWORK_DELAY);
    const db = getDB();
    
    // Auto-add milestones on creation
    const template = project.departmentType === DepartmentType.TECHNOLOGY 
      ? TECH_MILESTONES_TEMPLATE 
      : SOCIAL_MILESTONES_TEMPLATE;
    
    const milestones = template.map((m, i) => ({
      id: `m-${Date.now()}-${i}`,
      name: m,
      status: 'Pending',
      dueDate: new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 24 * 14).toISOString()
    }));

    const newProject = { 
      ...project, 
      milestones: milestones as any,
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    };
    db.unshift(newProject);
    saveDB(db);
    return newProject;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    await delay(NETWORK_DELAY);
    const db = getDB();
    const index = db.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Project not found");
    
    const updatedProject = { ...db[index], ...updates, updatedAt: new Date().toISOString() };
    db[index] = updatedProject;
    saveDB(db);
    return updatedProject;
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay(NETWORK_DELAY);
    let db = getDB();
    db = db.filter(p => p.id !== id);
    saveDB(db);
  },

  // --- TASKS ---
  getTasks: async (projectId?: string): Promise<Task[]> => {
    await delay(NETWORK_DELAY);
    const tasks = getTaskDB();
    if (projectId) return tasks.filter(t => t.projectId === projectId);
    return tasks;
  },

  createTask: async (task: Task): Promise<Task> => {
    await delay(NETWORK_DELAY);
    const tasks = getTaskDB();
    const newTask = { ...task, id: `t-${Date.now()}` };
    tasks.push(newTask);
    saveTaskDB(tasks);
    return newTask;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(NETWORK_DELAY);
    const tasks = getTaskDB();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Task not found");
    
    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    saveTaskDB(tasks);
    return updatedTask;
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(NETWORK_DELAY);
    let tasks = getTaskDB();
    tasks = tasks.filter(t => t.id !== id);
    saveTaskDB(tasks);
  },

  // --- PERSONAL NOTES ---
  getNotes: async (): Promise<Note[]> => {
    await delay(NETWORK_DELAY);
    return getNotesDB();
  },

  createNote: async (text: string): Promise<Note> => {
    await delay(NETWORK_DELAY);
    const notes = getNotesDB();
    const newNote = { id: `n-${Date.now()}`, text, createdAt: new Date().toISOString() };
    notes.push(newNote);
    saveNotesDB(notes);
    return newNote;
  },

  deleteNote: async (id: string): Promise<void> => {
    await delay(NETWORK_DELAY);
    let notes = getNotesDB();
    notes = notes.filter(n => n.id !== id);
    saveNotesDB(notes);
  }
};

interface ApiParams {
  params?: any;
  route: string;
  verb?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  baseurl?: boolean;
}

// Mimic the axios response structure for the "old" MERN frontend code
export const ApiCall = async ({ params = {}, route, verb = "get" }: ApiParams): Promise<{ status: number; response: any }> => {
  console.log(`[Mock API] ${verb.toUpperCase()} /api/${route}`, params);
  
  // Simulate network delay
  await delay(400);

  // --- AUTH ROUTES ---
  if (route === 'login') {
    const { userID, password, loginAs } = params;
    // Mock Authentication
    const foundUser = MOCK_USERS.find(u => u.role.toLowerCase() === loginAs.toLowerCase());
    
    if (userID === 'admin' && loginAs === 'Admin') {
      return { status: 200, response: { token: 'mock-admin', user_id: 'u1', userName: 'Alice Admin' } };
    }
    
    if (foundUser) {
       return { status: 200, response: { token: `mock-${foundUser.id}`, user_id: foundUser.id, userName: foundUser.name } };
    }
    
    // Fallback for demo
    return { status: 200, response: { token: 'mock-token', user_id: 'u4', userName: 'Demo User' } };
  }

  // --- ADMIN ROUTES ---
  if (route === 'admin/dashboard') {
    return {
      status: 200,
      response: {
        classes: MOCK_CLASSES.length,
        projects: getDB().length,
        supervisors: MOCK_TEACHERS.length,
        students: 350,
        notices: MOCK_NOTICES,
        notifications: []
      }
    };
  }
  if (route === 'admin/classes') return { status: 200, response: { classes: MOCK_CLASSES } };
  if (route === 'admin/teachers') return { status: 200, response: { teachers: MOCK_TEACHERS } };
  if (route === 'admin/projects') return { status: 200, response: { projects: getDB() } };

  // --- STUDENT ROUTES ---
  if (route === 'student/dashboard') {
    return {
      status: 200,
      response: {
        myTodoList: getTaskDB().filter(t => t.status !== 'Completed').slice(0, 3),
        notices: MOCK_NOTICES
      }
    };
  }
  
  if (route === 'student/project') {
    // Find project where studentId matches (simulating logged in user check)
    // For demo, just return the first project assigned to a student
    const project = getDB().find(p => p.studentId === 'u4') || getDB()[0];
    return {
       status: 200,
       response: {
         project: project,
         supervisor: MOCK_USERS.find(u => u.id === project?.supervisorId),
         projectMembers: MOCK_USERS.filter(u => u.role === 'STUDENT').slice(0, 2)
       }
    }
  }

  if (route === 'student/personal-notes' || route === 'teacher/personal-notes') {
      return { status: 200, response: { notes: getNotesDB() } };
  }

  // --- TEACHER ROUTES ---
  if (route === 'teacher/dashboard') {
    return {
      status: 200,
      response: {
        classesExamination: 2,
        classesSupervision: 1,
        projectsSupervision: 5,
        projectsExamination: 8,
        projectsSupervisionLimit: 10,
        notices: MOCK_NOTICES,
        notifications: []
      }
    };
  }

  if (route === 'teacher/supervision-projects') {
      const projects = getDB().filter(p => p.supervisorId === 'u2'); // Mock for Dr. Smith
      return {
          status: 200,
          response: {
              allClasses: [{id: 'c1', name: 'BSCS-Morning'}],
              allProjects: [{ className: 'BSCS-Morning', classProjects: projects }]
          }
      }
  }
  
  if (route === 'teacher/examination-projects') {
      const projects = getDB().filter(p => p.department === 'Computer Science').slice(0, 2); 
      return {
          status: 200,
          response: {
              allClasses: [{id: 'c2', name: 'BSIT-Evening'}],
              allProjects: [{ className: 'BSIT-Evening', classProjects: projects }]
          }
      }
  }

  // Catch-all for project details by ID
  if (route.match(/^admin\/projects\/[^/]+$/)) {
     const id = route.split('/').pop();
     const project = getDB().find(p => p.id === id);
     return { status: 200, response: { project } };
  }

  console.warn(`Route not mocked: ${route}`);
  return { status: 404, response: { message: "Route not found in mock API" } };
};
