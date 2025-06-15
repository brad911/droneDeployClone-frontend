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
    // {
    //   path: 'dashboard',
    //   children: [
    //     {
    //       path: 'default',
    //       element: <DashboardDefault />
    //     }
    //   ]
    // },
    {
      path: 'file',
      element: <FilesHandler />,
    },
    {
      path: 'createProject',
      element: <ProtectedRoute element={CreateProjectPage} />,
    },
    {
      path: 'typography',
      element: <UtilsTypography />,
    },
    {
      path: 'color',
      element: <UtilsColor />,
    },
    {
      path: 'shadow',
      element: <UtilsShadow />,
    },
    {
      path: '/sample-page',
      element: <SamplePage />,
    },
    { path: '/project/:projectID', element: <Project /> },
    {
      path: '/project',
      element: <ProtectedRoute element={Projects} />,
    },
    { path: '/project/:projectID/:projectWorkDayID', element: <ProjectWork /> },
  ],
};

export default MainRoutes;
