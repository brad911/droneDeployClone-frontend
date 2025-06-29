import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import anasList from '../menu-items/anasList';
import userList from '../menu-items/userList';
import projectList from '../menu-items/projectList';

export default function useMenuItems() {
  const user = useSelector((state) => state?.user?.user?.role);
  const location = useLocation();

  if (!user) {
    return [];
  }

  //   const isAnas = user === 'anas';
  //   const isUser = user === 'user';

  //   const items = [];

  //   if (isAnas) {
  //     items.push(anasList);
  //   }

  //   if (isUser) {
  //     items.push(userList);
  //   }

  // Conditionally add projectList if on specific path
  if (/^\/project\/\d+$/.test(location.pathname)) {
    items.push(projectList);
  }

  return items;
}
