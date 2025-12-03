
export enum Role {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  STUDENT = 'STUDENT'
}

export enum DepartmentType {
  TECHNOLOGY = 'TECHNOLOGY',
  SOCIAL_SCIENCE = 'SOCIAL_SCIENCE'
}

export enum ProjectStatus {
  PROPOSED = 'PROPOSED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Department {
  id: string;
  name: string;
  type: DepartmentType;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role | string;
  token?: string;
  department?: string;
  avatar?: string;
}

export interface ClassEntity {
  id: string;
  name: string;
  totalStudents: number;
  totalProjects: number;
  assignedSupervisors: number;
  program?: string;
  session?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  memberNames?: { id: string; name: string }[];
  supervisorName: string;
  supervisorId: string;
  className?: string;
  status: ProjectStatus | string;
  progress?: number;
  department?: string;
  departmentType?: DepartmentType;
  studentId?: string;
  studentName?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  comments?: any[];
  abstract?: string;
  supervisorFeedback?: string;
  aiFeedback?: string;
  milestones?: {
    id: string;
    name: string;
    status: string;
    dueDate: string;
  }[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  phase: string;
  assignedTo: string;
  assignedToId: string;
  startDate?: string;
  deadline: string;
  status: string;
  endDate?: string;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  headline: string;
  description: string;
  receiverEntity: string;
  receiverName: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  headline: string;
  description: string;
  senderName: string;
  senderId: string;
}

export interface Teacher {
  id: string;
  name: string;
  empId: string;
  designation: string;
  projectsLimit: number;
  assignedProjectsCount: number;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  cgpa: number;
  hasTopped: boolean;
}

export interface AuthState {
  input: {
    token: string;
    userID: string;
    user_id: string;
    loginAs: string;
    userName: string;
  };
  auth: {
    uid: boolean;
  };
}

export interface DashboardData {
  classes?: number;
  projects?: number;
  supervisors?: number;
  students?: number;
  notices?: Notice[];
  notifications?: Notification[];
  
  // Student specific
  myTodoList?: any[];
  
  // Teacher specific
  classesExamination?: number;
  classesSupervision?: number;
  projectsSupervision?: number;
  projectsExamination?: number;
  projectsSupervisionLimit?: number;
}