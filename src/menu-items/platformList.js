// assets
import {
  IconLiveViewFilled,
  IconGitCompare,
  IconReport,
  IconTagStarred,
  IconView360Number,
  IconFiles,
  IconUsers,
} from '@tabler/icons-react';

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const platform = {
  id: 'platform',
  title: 'Platform',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Exterior (Map View)',
      type: 'item',
      url: '/project/1/View',
      icon: IconLiveViewFilled,
      breadcrumbs: false,
    },
    {
      id: 'util-color',
      title: 'Compare View',
      type: 'item',
      url: '/project/1/compare',
      icon: IconGitCompare,
      breadcrumbs: false,
    },
    {
      id: 'progressReport',
      title: 'Progress Report',
      type: 'item',
      url: '/project/1/dpr',
      icon: IconReport,
      breadcrumbs: false,
    },
    {
      id: 'issueTaggingAndCoordination',
      title: 'Coordination Logs',
      type: 'item',
      url: '/project/1/issue',
      icon: IconTagStarred,
      breadcrumbs: false,
    },
    {
      id: '360viewer',
      title: 'Interior (360 View) ',
      type: 'item',
      url: '/project/1/360view',
      icon: IconView360Number,
      breadcrumbs: false,
    },
    {
      id: 'projectFiles',
      title: 'Project Files',
      type: 'item',
      url: '/project/1/files',
      icon: IconFiles,
      breadcrumbs: false,
    },
    {
      id: 'projectTeam',
      title: 'Project Team',
      type: 'item',
      url: '/project/1/team',
      icon: IconUsers,
      breadcrumbs: false,
    },
  ],
};

export default platform;
