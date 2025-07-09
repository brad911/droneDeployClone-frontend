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
import { useSelector } from 'react-redux';

// ==============================|| UTILITIES MENU ITEMS ||============================== //
const getPlatformMenu = (projectId) => ({
  id: 'platform',
  title: 'Platform',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Exterior (Map View)',
      type: 'item',
      url: `/project/${projectId}/View`,
      icon: IconLiveViewFilled,
      breadcrumbs: false,
    },
    {
      id: 'util-color',
      title: 'Compare View',
      type: 'item',
      url: `/project/${projectId}/compare`,
      icon: IconGitCompare,
      breadcrumbs: false,
    },
    {
      id: 'progressReport',
      title: 'Progress Report',
      type: 'item',
      url: `/project/${projectId}/dpr`,
      icon: IconReport,
      breadcrumbs: false,
    },
    {
      id: 'issueTaggingAndCoordination',
      title: 'Coordination Logs',
      type: 'item',
      url: `/project/${projectId}/issue`,
      icon: IconTagStarred,
      breadcrumbs: false,
    },
    {
      id: '360viewer',
      title: 'Interior (360 View) ',
      type: 'item',
      url: `/project/${projectId}/360view`,
      icon: IconView360Number,
      breadcrumbs: false,
    },
    {
      id: 'projectFiles',
      title: 'Project Files',
      type: 'item',
      url: `/project/${projectId}/files`,
      icon: IconFiles,
      breadcrumbs: false,
    },
    {
      id: 'projectTeam',
      title: 'Project Team',
      type: 'item',
      url: `/project/${projectId}/team`,
      icon: IconUsers,
      breadcrumbs: false,
    },
  ],
});

export default getPlatformMenu;