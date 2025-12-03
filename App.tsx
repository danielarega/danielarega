
import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from './store/index';
import { ADMIN_ROUTES, STUDENT_ROUTES, TEACHER_ROUTES } from './Routes';
import { Login } from './pages/Login';
import AdminDashboard from './Dashboards/Admin/AdminDashboard';
import StudentDashboard from './Dashboards/Student/StudentDashboard';
import TeacherDashboard from './Dashboards/Teacher/TeacherDashboard';

const App = () => {
  const { input, auth } = useSelector((state) => state.login);

  // Derive dashboard immediately during render, not in useEffect
  const dashboard = useMemo(() => {
    if (!auth.uid) return null;
    
    const userType = input.loginAs;
    if (userType === "Admin") {
      return <AdminDashboard links={ADMIN_ROUTES} />;
    } else if (userType === "Teacher") {
      return <TeacherDashboard links={TEACHER_ROUTES} />;
    } else if (userType === "Student") {
      return <StudentDashboard links={STUDENT_ROUTES} />;
    }
    return null;
  }, [auth.uid, input.loginAs]);

  return (
    <Routes>
      <Route path="/*" element={auth && auth.uid ? dashboard : <Navigate to="/login" />} />
      <Route path="/login" element={auth && auth.uid ? <Navigate to="/" /> : <Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
