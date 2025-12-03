import { DashboardData } from '../types';

// Mock Data Stores
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

const MOCK_PROJECTS = [
  { id: 'p1', title: 'Library Management System', memberNames: [{id:'s1', name: 'Daniel'}, {id:'s2', name: 'Jamshaid'}], supervisorName: 'Dr. Solomon', supervisorId: 't1', className: 'BSCS-Morning-2024', status: 'In Progress', description: 'A system to manage library resources.' },
  { id: 'p2', title: 'AI Traffic Control', memberNames: [{id:'s3', name: 'Fatima'}], supervisorName: 'Prof. Azeb', supervisorId: 't2', className: 'BSIT-Evening-2024', status: 'Proposed', description: 'Using computer vision for traffic lights.' }
];

interface ApiParams {
  params?: any;
  route: string;
  verb?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  baseurl?: boolean;
}

// Mimic the axios response structure
export const ApiCall = async ({ params = {}, route, verb = "get" }: ApiParams): Promise<{ status: number; response: any }> => {
  console.log(`[Mock API] ${verb.toUpperCase()} /api/${route}`, params);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));

  // --- AUTH ROUTES ---
  if (route === 'login') {
    const { userID, password, loginAs } = params;
    
    // Mock Authentication Logic
    if (userID === 'admin' && password === 'admin' && loginAs === 'Admin') {
      return {
        status: 200,
        response: { token: 'mock-admin-token', user_id: 'admin-1', userName: 'Admin User', message: 'Welcome Admin' }
      };
    }
    if (loginAs === 'Student' && userID) {
       // Accept any student login for demo
       return {
        status: 200,
        response: { token: 'mock-student-token', user_id: 's1', userName: 'Daniel Arega', message: 'Student logged in successfully' }
      };
    }
    if (loginAs === 'Teacher' && userID) {
       return {
        status: 200,
        response: { token: 'mock-teacher-token', user_id: 't1', userName: 'Dr. Solomon', message: 'Teacher logged in successfully' }
      };
    }
    
    return { status: 401, response: { message: "Invalid Credentials" } };
  }

  // --- ADMIN ROUTES ---
  if (route === 'admin/dashboard') {
    return {
      status: 200,
      response: {
        classes: MOCK_CLASSES.length,
        projects: MOCK_PROJECTS.length,
        supervisors: MOCK_TEACHERS.length,
        students: 350,
        notices: MOCK_NOTICES,
        notifications: []
      }
    };
  }

  if (route === 'admin/classes') {
    return { status: 200, response: { classes: MOCK_CLASSES } };
  }

  if (route === 'admin/teachers') {
    return { status: 200, response: { teachers: MOCK_TEACHERS } };
  }

  if (route === 'admin/projects') {
    return { status: 200, response: { projects: MOCK_PROJECTS } };
  }

  // --- STUDENT ROUTES ---
  if (route === 'student/dashboard') {
    return {
      status: 200,
      response: {
        myTodoList: [
          { id: 'todo1', title: 'Submit Proposal', phase: 'Planning', deadline: new Date().toISOString(), status: 'Pending' },
          { id: 'todo2', title: 'Literature Review', phase: 'Documentation', deadline: new Date().toISOString(), status: 'In Progress' }
        ],
        notices: MOCK_NOTICES
      }
    };
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

  // Default catch-all for un-mocked routes
  console.warn(`Route not mocked: ${route}`);
  return { status: 404, response: { message: "Route not found in mock API" } };
};