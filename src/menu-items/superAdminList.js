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

const superAdminList = {
  id: 'superAdminList',
  //   title: 'Utilities',
  type: 'group',
  children: [
    {
      id: 'Projects',
      title: 'Projects',
      type: 'item',
      url: '/project',
      icon: icons.IconDroneOff,
      breadcrumbs: false,
    },
    // {
    //   id: 'files',
    //   title: 'Files',
    //   type: 'item',
    //   url: '/file',
    //   icon: icons.IconPalette,
    //   breadcrumbs: false,
    // },
    // {
    //   id: 'options',
    //   title: 'Option 3',
    //   type: 'item',
    //   url: '/options4',
    //   icon: icons.IconShadow,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'option4',
    //   title: 'Option 4',
    //   type: 'item',
    //   url: '/options4',
    //   icon: icons.IconShadow,
    //   breadcrumbs: false
    // }
  ],
};

export default superAdminList;
