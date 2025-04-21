import Login from '../pages/Login'
import Home from '../pages/home'
import Signup from '../pages/signup'
import { Layout } from '../layouts/layout'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ForgetPassword from '../pages/forget-password'
import TeacherDashboard from '../pages/teacherDashboard'
import { ProtectedRoute } from '../components/ProtectedRoute'
import StudentDashboard from '../pages/studentDashboard'
import AdminDashboard from '../pages/adminDashboard'
import StudentProfilePage from '../pages/profile/studentProfile'
import CoursesExplorer from '../pages/course/courseExplore'
import CourseDetails from '../pages/course/courseDetails'
import LessonViewer from '@/components/course/LessonViewer'
import CoursePlayer from '@/components/course/coursePLayer'

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
            {
                path:'/course-explore', element : <CoursesExplorer/>
            },
            {
                path:'/course/:id', element : <CourseDetails/>
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
          },
          {
            path : '/student-dashboard/profile' ,
            element : <StudentProfilePage/>
          },
          {
            path : '/logout',
            element : <Navigate to="/login" replace />
          }
          ,{
            path : '/course' , 
            element : <CoursePlayer/>
          }
          
])