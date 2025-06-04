import { createBrowserRouter } from 'react-router-dom';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import MainRoutes from './MainRoutes';
import LandingPage from '../views/LandingPage';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <LandingPage />,
    },
    AuthenticationRoutes,
    MainRoutes,
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME,
  },
);

export default router;
