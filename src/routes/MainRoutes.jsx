import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from '../utils/protectedRoute';

// ==============================|| LAZY IMPORTS ||============================== //
const DashboardDefault = Loadable(
  lazy(() => import('views/dashboard/Default')),
);
const FilesHandler = Loadable(
  lazy(() => import('views/dashboard/Default/Files/FilesHandler')),
);
const Projects = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/Projects')),
);
const CreateProjectPage = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/CreateProjectPage')),
);
const ProjectView = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/ProjectView')),
);
const Project = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/Project')),
);
const ProjectWork = Loadable(
  lazy(() => import('views/dashboard/Default/ProjectWork/ProjectWork')),
);
const CompareProject = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/CompareProject')),
);
const DprForm = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/Project/DprForm')),
);
const IssueReport = Loadable(
  lazy(() => import('views/dashboard/Default/issues/IssuesReport')),
);
const FilesTab = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/Project/tabs/FileTab')),
);
const AllDirectionViewList = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/Project/360ViewList')),
);
const TeamSetup = Loadable(
  lazy(() => import('views/dashboard/Default/Projects/Project/TeamSetup')),
);
const UserControlSystem = Loadable(
  lazy(() => import('views/dashboard/admin/userControlSystem')),
);
const WorkDayList = Loadable(
  lazy(() => import('views/dashboard/admin/WorkDayList')),
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/dashboard',
      element: <ProtectedRoute element={DashboardDefault} />,
    },
    {
      path: 'createProject',
      element: <ProtectedRoute element={CreateProjectPage} />,
    },
    { path: '/project', element: <ProtectedRoute element={Projects} /> },
    {
      path: '/project/:id/viewer',
      element: <ProtectedRoute element={Projects} />,
    },
    {
      path: '/project/:id/compare',
      element: <ProtectedRoute element={CompareProject} />,
    },
    { path: '/project/:projectID/issue', element: <IssueReport /> },
    { path: '/project/:projectID/dpr', element: <DprForm /> },
    { path: '/project/:projectID', element: <Project /> },
    { path: '/project/:projectID/files', element: <FilesTab /> },
    { path: '/project/:projectID/360view', element: <AllDirectionViewList /> },
    { path: '/project/:projectID/team', element: <TeamSetup /> },
    { path: '/user-control-panel', element: <UserControlSystem /> },
    { path: '/work-days', element: <ProtectedRoute element={WorkDayList} /> },
    { path: '/project/:projectID/:projectWorkDayID', element: <ProjectWork /> },
  ],
};

export default MainRoutes;
