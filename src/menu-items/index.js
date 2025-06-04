import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import AdminDashboard from './superAdminList';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [AdminDashboard, other, utilities],
};

export default menuItems;
