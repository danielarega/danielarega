import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from '../../store/index';
import Sidebar from '../../Components/Navbar/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';

// Placeholder components to ensure routes work
const Classes = () => <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold mb-4">Classes Management</h2><p>Manage your classes here.</p></div>;
const Teachers = () => <div className="p-6 bg-white rounded-lg shadow"><h2 className="text-2xl font-bold mb-4">Teachers Management</h2><p>Manage your faculty here.</p></div>;

const AdminDashboard = (props: any) => {
  const { input } = useSelector((state) => state.login);
  const user = {
    name: input.userName || "Admin",
    id: input.user_id,
  };

  return (
    <Sidebar user={user} links={props.links}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Sidebar>
  );
};

export default AdminDashboard;