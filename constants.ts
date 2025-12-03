import { Department, DepartmentType, Role, User, Project, ProjectStatus } from './types';

export const DEPARTMENTS: Department[] = [
  // Technology (3)
  { id: 'cs', name: 'Computer Science', type: DepartmentType.TECHNOLOGY },
  { id: 'it', name: 'Information Technology', type: DepartmentType.TECHNOLOGY },
  { id: 'se', name: 'Software Engineering', type: DepartmentType.TECHNOLOGY },
  // Social Science (8)
  { id: 'psych', name: 'Psychology', type: DepartmentType.SOCIAL_SCIENCE },
  { id: 'soc', name: 'Sociology', type: DepartmentType.SOCIAL_SCIENCE },
  { id: 'pol-sci', name: 'Political Science', type: DepartmentType.SOCIAL_SCIENCE },
  { id: 'econ', name: 'Economics', type: DepartmentType.SOCIAL_SCIENCE },
  { id: 'anthro', name: 'Anthropology', type: DepartmentType.SOCIAL_SCIENCE },
  { id: 'hist', name: 'History', type: DepartmentType.SOCIAL_SCIENCE },
  { id: 'geo', name: 'Geography', type: DepartmentType.SOCIAL_SCIENCE },
  { id: 'edu', name: 'Education', type: DepartmentType.SOCIAL_SCIENCE },
];

export const TECH_MILESTONES_TEMPLATE = [
  "Title Submission", 
  "Proposal Submission", 
  "Proposal Defense", 
  "Deliverable 1", 
  "Deliverable 1 Evaluation", 
  "Deliverable 2", 
  "Deliverable 2 Evaluation", 
  "Final Submission"
];

export const SOCIAL_MILESTONES_TEMPLATE = [
  "Chapter 1 - Introduction", 
  "Chapter 2 - Literature Review", 
  "Chapter 3 - Methodology", 
  "Chapter 4 - Results & Discussion", 
  "Chapter 5 - Conclusion", 
  "References & Appendices"
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', email: 'admin@uni.edu', role: Role.ADMIN, avatar: 'https://picsum.photos/100/100' },
  { id: 'u2', name: 'Dr. Smith', email: 'smith@uni.edu', role: Role.SUPERVISOR, department: 'Computer Science', avatar: 'https://picsum.photos/101/101' },
  { id: 'u3', name: 'Dr. Jones', email: 'jones@uni.edu', role: Role.SUPERVISOR, department: 'Psychology', avatar: 'https://picsum.photos/102/102' },
  { id: 'u4', name: 'John Doe', email: 'john@uni.edu', role: Role.STUDENT, department: 'Computer Science', avatar: 'https://picsum.photos/103/103' },
  { id: 'u5', name: 'Jane Doe', email: 'jane@uni.edu', role: Role.STUDENT, department: 'Psychology', avatar: 'https://picsum.photos/104/104' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'AI-Driven Traffic Management System',
    description: 'Using computer vision to optimize traffic light timings.',
    department: 'Computer Science',
    departmentType: DepartmentType.TECHNOLOGY,
    studentId: 'u4',
    studentName: 'John Doe',
    supervisorId: 'u2',
    supervisorName: 'Dr. Smith',
    status: ProjectStatus.IN_PROGRESS,
    progress: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['AI', 'Smart City', 'Traffic'],
    comments: [],
    abstract: 'This study proposes a dynamic traffic control system...',
    milestones: TECH_MILESTONES_TEMPLATE.map((m, i) => ({
      id: `m-${i}`,
      name: m,
      status: i < 3 ? 'Approved' : i === 3 ? 'Submitted' : 'Pending',
      dueDate: new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 24 * 14).toISOString()
    })) as any
  },
  {
    id: 'p2',
    title: 'Impact of Social Media on Teen Anxiety',
    description: 'A quantitative study of high school students in the district.',
    department: 'Psychology',
    departmentType: DepartmentType.SOCIAL_SCIENCE,
    studentId: 'u5',
    studentName: 'Jane Doe',
    supervisorId: 'u3',
    supervisorName: 'Dr. Jones',
    status: ProjectStatus.PROPOSED,
    progress: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['Mental Health', 'Social Media', 'Teens'],
    comments: [],
    abstract: 'This thesis explores the correlation between screen time and anxiety levels...',
    milestones: SOCIAL_MILESTONES_TEMPLATE.map((m, i) => ({
      id: `m-${i}`,
      name: m,
      status: i === 0 ? 'Submitted' : 'Pending',
      dueDate: new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 24 * 30).toISOString()
    })) as any
  }
];
