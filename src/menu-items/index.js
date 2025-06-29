// import dashboard from './dashboard';
// import pages from './pages';
import platform from './platformList';
// import other from './other';
import AdminDashboard from './superAdminList';
import managementList from './managementList';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [AdminDashboard, platform, managementList],
};

export default menuItems;
