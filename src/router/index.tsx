import Login from '../pages/Login'
import Home from '../pages/home'
import Signup from '../pages/signup'
import { Layout } from '../layouts/layout'
import {createBrowserRouter} from 'react-router-dom'
import ForgetPassword from '../pages/forget-password'
import TeacherDashboard from '../pages/teacherDashboard'
import { ProtectedRoute } from '../components/ProtectedRoute'
import StudentDashboard from '../pages/studentDashboard'
import AdminDashboard from '../pages/adminDashboard'

export  const  router = createBrowserRouter([
    {
        element :<Layout />,
        children :[
            {
                path:'/' , element: <Home />
            },
            {
                path:'/login',element :<Login />
            },
            {
                path:'/signup', element : <Signup/>
            },
            {
                path:'/forgot-password', element : <ForgetPassword/>
            },
           
        
        ]},
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
    
])