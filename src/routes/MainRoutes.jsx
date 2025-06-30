import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import FilesHandler from '../views/dashboard/Default/Files/FilesHandler';
import Projects from '../views/dashboard/Default/Projects/Projects';
import CreateProjectPage from '../views/dashboard/Default/Projects/CreateProjectPage';
import ProtectedRoute from '../utils/protectedRoute';
import ProjectView from '../views/dashboard/Default/Projects/ProjectView';
import Project from '../views/dashboard/Default/Projects/Project';
import ProjectWork from '../views/dashboard/Default/ProjectWork/ProjectWork';
import CompareProject from '../views/dashboard/Default/Projects/CompareProject';
import DprForm from 'views/dashboard/Default/Projects/Project/DprForm';
import IssueReport from 'views/dashboard/Default/Projects/Project/issueReport';
import FilesTab from '../views/dashboard/Default/Projects/Project/tabs/FileTab';

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import('views/dashboard/Default')),
);

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import('views/utilities/Typography')),
);
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

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
    {
      path: '/project',
      element: <ProtectedRoute element={Projects} />,
    },
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
    
    { path: '/project/:projectID/:projectWorkDayID', element: <ProjectWork /> },
  ],
};

export default MainRoutes;
