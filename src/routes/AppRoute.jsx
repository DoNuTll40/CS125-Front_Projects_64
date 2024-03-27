
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/UseAuth';
import Welcome from '../components/Admin/Welcome';
import WelcomeT from '../components/Teacher/Welcome';
import Build from '../components/Admin/Build';
import Teacher from '../components/Admin/Teacher';
import Header from '../components/Header';
import TableStudent from '../components/Student/TableStudent';
import Profile from '../components/Profile';
import DashBoard from '../components/DashBoard';
import LoginStudent from '../components/LoginStudent';
import LoginAdmin from '../components/LoginAdmin';
import Rooms from '../components/Admin/Rooms';
import PageFound from '../components/PageFound';
import Footer from '../components/Footer';
import AllUsers from '../components/Admin/AllUsers';
import EditUser from '../components/Admin/EditUser';
import Schedule from '../components/Admin/Schedule'
import AddSchedule from '../components/Admin/AddSchedule';
import Subjects from '../components/Admin/Subjects';
import AddSubject from '../components/Admin/AddSubject';
import AddRoom from '../components/Admin/AddRoom';
import AddBuild from '../components/Admin/AddBuild';
import TeacherSchedule from '../components/Teacher/TeacherSchedule';
import TeacherBuild from '../components/Teacher/Build';
import Printlist from '../components/Print-list';
import TableTeacher from '../components/Teacher/TableTeacher';
import Report from '../components/Report';
import ScrollProgress from '../components/ScrollProgress';

const guestRouter = createBrowserRouter([
    {
        path: '/',
        element: <>
            <Outlet />
        </>,
        children: [
            { index: true, element: <LoginStudent /> },
            { path: "teacher", element: <LoginAdmin /> },
        ]
    },
    {
        path: '*',
        element: <>
            <PageFound />
        </>
    }
]);

const userRouter = createBrowserRouter([
    {
        path: '/',
        element: <>
            <Header />
            <Outlet />
            <Footer />
        </>,
        children: [
            { index: true, element: <TableStudent /> },
            { path: 'profile', element: <Profile /> },
        ]
    },
    {
        path: '*',
        element: <>
            <PageFound />
        </>
    },
    {
        path: '/profile',
        element: <>
            <Header />
            <Outlet />
        </>,
        children: [
            { index: true, element: <Profile /> }
        ]
    },
])

const teacherRouter = createBrowserRouter([
    {
        path: '/',
        element: <>
            <Header />
            <DashBoard />
            <Outlet />
        </>,
        children: [
            { index: true, element: <WelcomeT /> },
            { path: 'teacher', element: <WelcomeT /> },
            { path: 'teachers', element: <Teacher /> },
            { path: 'build', element: <TeacherBuild /> },
            { path: 'teacher-table', element: <TeacherSchedule /> },
            { path: 'report', element: <Report /> },
            { path: 'profile', element: <Profile /> },
        ]
    },
    {
        path: 'teacher-schedule',
        element: <>
            <Header />
            <Outlet />
        </>,
        children: [
            { index: true, element: <TableTeacher /> }
        ]
    },
    {
        path: '/print',
        element: <>
            <Outlet />
        </>,
        children: [
            { index: true, element: <Printlist /> }
        ]
    },
    {
        path: '/profile',
        element: <>
            <Header />
            <Outlet />
        </>,
        children: [
            { index: true, element: <Profile /> }
        ]
    },
    {
        path: '*',
        element: <>
            <PageFound />
        </>
    }
])

const adminRouter = createBrowserRouter([
    {
        path: '/',
        element: <>
            <Header />
            <DashBoard />
            <Outlet />
        </>,
        children: [
            { index: true, element: <Welcome /> },
            { path: 'teacher', element: <Welcome /> },
            { path: 'build', element: <Build /> },
            { path: 'room', element: <Rooms /> },
            { path: 'users', element: <AllUsers /> },
            { path: 'users/edit/:id', element: <EditUser /> },
            { path: 'teachers', element: <Teacher /> },
            { path: 'report', element: <Report /> },
            { path: 'schedule', element: <Schedule /> },
            { path: 'schedule/add', element: <AddSchedule /> },
            { path: 'profile', element: <Profile /> },
            { path: 'subject', element: <Subjects /> },
            { path: 'subject/add', element: <AddSubject /> },
            { path: 'room/add', element: <AddRoom /> },
            { path: 'build/add', element: <AddBuild /> },
        ]
    },
    {
        path: '/profile',
        element: <>
            <Header />
            <Outlet />
        </>,
        children: [
            { index: true, element: <Profile /> }
        ]
    },
    {
        path: '*',
        element: <>
            <PageFound />
        </>
    }
])

export default function appRoute() {
    const { user } = useAuth()
    const finalRouter = user?.user_id ? user?.user_role === "ADMIN" ? adminRouter : user?.user_role === "TEACHER" ? teacherRouter : userRouter : guestRouter;
    return (
        <RouterProvider router={finalRouter} />
    )
}
