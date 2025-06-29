// assets
import {
  IconLiveViewFilled,
  IconGitCompare,
  IconReport,
  IconTagStarred,
  IconView360Number,
  IconFiles,
} from '@tabler/icons-react';

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const platform = {
  id: 'platform',
  title: 'Platform',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Orthomosaic Viewer',
      type: 'item',
      url: '/project/:id/View',
      icon: IconLiveViewFilled,
      breadcrumbs: false,
    },
    {
      id: 'util-color',
      title: 'Progress Comparison',
      type: 'item',
      url: '/project/:id/comparison',
      icon: IconGitCompare,
      breadcrumbs: false,
    },
    {
      id: 'progressReport',
      title: 'Progress Report',
      type: 'item',
      url: '/project/:id/report',
      icon: IconReport,
      breadcrumbs: false,
    },
    {
      id: 'issueTaggingAndCoordination',
      title: 'Issue Tagging & CoordinationF',
      type: 'item',
      url: '/project/:id/issueTagging',
      icon: IconTagStarred,
      breadcrumbs: false,
    },
    {
      id: '360viewer',
      title: '360 Viewer (Interior)',
      type: 'item',
      url: '/project/:id/report',
      icon: IconView360Number,
      breadcrumbs: false,
    },
    {
      id: 'projectFiles',
      title: 'ProjectFiles',
      type: 'item',
      url: '/project/:id/files',
      icon: IconFiles,
      breadcrumbs: false,
    },
  ],
};

export default platform;
