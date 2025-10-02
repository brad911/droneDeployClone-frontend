import { memo, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import getPlatformMenu from 'menu-items/platformList';
import AdminDashboard from 'menu-items/superAdminList';
import managementList from 'menu-items/managementList';

import { useGetMenuMaster } from 'api/menu';
import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const [selectedID, setSelectedID] = useState('');
  const lastItem = null;
  const location = useLocation();
  const selectedProjectId = useSelector((state) => state.project.id);
  const selectedProject = useSelector((state) => state.project);
  const projectName = selectedProject?.name;
  const userType = useSelector((state) => state.auth.user.type);
  const user = useSelector((state) => state.auth.user);
  // Always build items in the order: AdminDashboard, platform (conditionally), managementList
  let items = [AdminDashboard(userType)];
  if (/^\/project\/*\//.test(location.pathname)) {
    items.push(
      getPlatformMenu(selectedProjectId, projectName, user.permissions || ''),
    );
  }
  items.push(managementList);

  let lastItemIndex = items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < items.length) {
    lastItemId = items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = items.slice(lastItem - 1, items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url,
      }),
    }));
  }

  const navItems = items.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem
                item={item}
                level={1}
                isParents
                setSelectedID={() => setSelectedID('')}
              />
              {index !== 0 && <Divider sx={{ py: 0.5 }} />}
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>;
}

export default memo(MenuList);
