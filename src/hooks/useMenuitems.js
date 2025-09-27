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

  if (/^\/project\/\d+$/.test(location.pathname)) {
    items.push(projectList);
  }

  return items;
}
