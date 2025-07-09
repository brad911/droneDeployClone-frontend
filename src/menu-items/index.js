// import dashboard from './dashboard';
// import pages from './pages';
import getPlatformMenu from './platformList';
// import other from './other';
import AdminDashboard from './superAdminList';
import managementList from './managementList';
// ==============================|| MENU ITEMS ||============================== //
const menuItems = {
  items: [AdminDashboard, getPlatformMenu(), managementList],
};

export default menuItems;
