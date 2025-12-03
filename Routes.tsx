import React from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  ClipboardList,
  Bell
} from 'lucide-react';

export const ADMIN_ROUTES = [
  { path: "/", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/classes", name: "Classes", icon: <BookOpen size={20} /> },
  { path: "/teachers", name: "Teachers", icon: <Users size={20} /> },
  { path: "/projects", name: "Projects", icon: <FileText size={20} /> },
  { path: "/notice-board", name: "Notice Board", icon: <ClipboardList size={20} /> },
  { path: "/settings", name: "Settings", icon: <Settings size={20} /> },
];

export const STUDENT_ROUTES = [
  { path: "/", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/my-project", name: "My Project", icon: <FileText size={20} /> },
  { path: "/project-management", name: "Project Management", icon: <ClipboardList size={20} /> },
  { path: "/submissions", name: "Submissions", icon: <BookOpen size={20} /> },
  { path: "/settings", name: "Settings", icon: <Settings size={20} /> },
];

export const TEACHER_ROUTES = [
  { path: "/", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/supervision-projects", name: "Supervision", icon: <FileText size={20} /> },
  { path: "/examination-projects", name: "Examination", icon: <BookOpen size={20} /> },
  { path: "/notifications", name: "Notify PMO", icon: <Bell size={20} /> },
  { path: "/settings", name: "Settings", icon: <Settings size={20} /> },
];