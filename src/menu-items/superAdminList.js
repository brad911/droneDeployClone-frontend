// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconDroneOff,
} from '@tabler/icons-react';

// constant
const icons = {
  IconDroneOff,
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
};
// ==============================|| UTILITIES MENU ITEMS ||============================== //

const getSuperAdminList = (userRole) => {
  const children = [
    {
      id: 'Projects',
      title: 'Projects',
      type: 'item',
      url: '/project',
      icon: icons.IconDroneOff,
      breadcrumbs: false,
    },
  ];
  if (userRole === 'admin') {
    children.push({
      id: 'UserControlPanel',
      title: 'User Control Panel',
      type: 'item',
      url: '/user-control-panel',
      icon: icons.IconWindmill,
      breadcrumbs: false,
    });
    children.push({
      id: 'WorkDayList',
      title: 'Work Days',
      type: 'item',
      url: '/work-days',
      icon: icons.IconPalette,
      breadcrumbs: false,
    });
  }
  return {
    id: 'superAdminList',
    type: 'group',
    children,
  };
};

export default getSuperAdminList;
