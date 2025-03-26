import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/layouts/layout';
import Home from '@/pages/home';
import Login from '@/pages/Login';
import Signup from '@/pages/signup';
import ForgetPassword from '@/pages/forget-password';
import StudentDashboard from '@/pages/studentDashboard';
import TeacherDashboard from '@/pages/teacherDashboard';
import AdminDashboard from '@/pages/adminDashboard';
import Unauthorized from '@/pages/Unauthorized';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/forgot-password', element: <ForgetPassword /> },
      { path: '/unauthorized', element: <Unauthorized /> }
    ]
  },
  // Routes protégées avec redirection conditionnelle
  {
    path: '/dashboard',
    element: <DashboardRouter />
  },
  // Routes spécifiques pour accès direct
  {
    path: '/student-dashboard',
    element: <ProtectedRoute component={StudentDashboard} allowedRoles={['student']} />
  },
  {
    path: '/teacher-dashboard',
    element: <ProtectedRoute component={TeacherDashboard} allowedRoles={['teacher']} />
  },
  {
    path: '/admin-dashboard',
    element: <ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} />
  }
]);