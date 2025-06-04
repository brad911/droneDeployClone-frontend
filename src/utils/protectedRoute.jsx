import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const data = localStorage.getItem('token');
  if (!data) {
    return false;
  }
  return true;
};

const ProtectedRoute = ({ element: Component, isBoth = false, ...rest }) => {
  const access = isAuthenticated();
  console.log(access, '<==== access');
  return access || isBoth ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
