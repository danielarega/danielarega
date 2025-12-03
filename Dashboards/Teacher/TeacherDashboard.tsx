
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from '../../store/index';
import Sidebar from '../../Components/Navbar/Sidebar';
import Dashboard from './pages/Dashboard'; // Will reuse general dashboard but configured for teacher via API
import SupervisionProjects from './pages/SupervisionProjects';
import ExaminationProjects from './pages/ExaminationProjects';
import PersonalNotes from '../../pages/PersonalNotes';
import { ProjectDetails } from '../../pages/ProjectDetails';
import { ProjectManagement } from '../../pages/ProjectManagement'; // Teachers can view tasks too
import AIAssistant from '../../pages/AIAssistant';

// Placeholders
const Notifications = () => <div className="p-6">Notifications & Requests</div>;
const Settings = () => <div className="p-6">Settings Page</div>;

const TeacherDashboard = (props: any) => {
  const { input } = useSelector((state) => state.login);
  const user = {
    name: input.userName || "Teacher",
    id: input.user_id,
  };

  return (
    <Sidebar user={user} links={props.links}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/supervision-projects" element={<SupervisionProjects />} />
        <Route path="/examination-projects" element={<ExaminationProjects />} />
        <Route path="/project/:projectId" element={<ProjectDetails />} /> 
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/personal-notes" element={<PersonalNotes />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Sidebar>
  );
};

export default TeacherDashboard;