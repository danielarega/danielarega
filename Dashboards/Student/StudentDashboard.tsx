
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from '../../store/index';
import Sidebar from '../../Components/Navbar/Sidebar';
import Dashboard from './pages/Dashboard'; // Will reuse general dashboard but configured for student via API
import { ProjectDetails } from '../../pages/ProjectDetails';
import { ProjectManagement } from '../../pages/ProjectManagement';
import Submissions from '../../pages/Submissions';
import PersonalNotes from '../../pages/PersonalNotes';
import AIAssistant from '../../pages/AIAssistant';

// Placeholder for Settings
const Settings = () => <div className="p-6">Settings Page</div>;

const StudentDashboard = (props: any) => {
  const { input } = useSelector((state) => state.login);
  const user = {
    name: input.userName || "Student",
    id: input.user_id,
  };

  return (
    <Sidebar user={user} links={props.links}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/my-project" element={<ProjectDetails />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/personal-notes" element={<PersonalNotes />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Sidebar>
  );
};

export default StudentDashboard;