import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import ForgetPassword from '../views/pages/authentication/ForgetPassword';
import ResetPassword from '../views/pages/authentication/ResetPassword';

// maintenance routing
const LoginPage = Loadable(
  lazy(() => import('views/pages/authentication/Login')),
);
const RegisterPage = Loadable(
  lazy(() => import('views/pages/authentication/Register')),
);

const ForgetPasswordPage = Loadable(
  lazy(() => import('views/pages/authentication/ForgetPassword')),
);

const ResetPasswordPage = Loadable(
  lazy(() => import('views/pages/authentication/ResetPassword')),
);
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/register',
      element: <RegisterPage />,
    },
    {
      path: '/reset-password',
      element: <ResetPasswordPage />,
    },
    {
      path: '/forget-password',
      element: <ForgetPasswordPage />,
    },
  ],
};

export default AuthenticationRoutes;
