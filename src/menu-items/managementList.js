// assets
import { IconSettingsFilled } from '@tabler/icons-react';



// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const management = {
  id: 'pages',
  title: '',
  caption: '',
  icon: IconSettingsFilled,
  type: 'group',
  children: [
    {
      id: 'Settings',
      title: 'Settings',
      type: 'collapse',
      icon: IconSettingsFilled,
      children: [
        {
          id: 'Account',
          title: 'Account',
          type: 'item',
          url: '/pages/login',
          target: true,
        },
        {
          id: 'Privacy',
          title: 'Privacy',
          type: 'item',
          url: '/pages/login',
          target: true,
        },
        {
          id: 'Security',
          title: 'Security',
          type: 'item',
          url: '/pages/register',
          target: true,
        },
      ],
    },
  ],
};

export default management;
