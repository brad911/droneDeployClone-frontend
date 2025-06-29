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
const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Sample Page',
      type: 'item',
      url: '/sample-page',
      icon: icons.IconBrandChrome,
      breadcrumbs: false,
    },
    // {
    //   id: 'documentation',
    //   title: 'Documentation',
    //   type: 'item',
    //   url: 'https://codedthemes.gitbook.io/berry/',
    //   icon: icons.IconHelp,
    //   external: true,
    //   target: true
    // }
  ],
};

export default other;
