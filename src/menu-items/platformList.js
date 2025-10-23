// assets
import {
  IconLiveViewFilled,
  IconGitCompare,
  IconReport,
  IconTagStarred,
  IconView360Number,
  IconFiles,
  IconUsers,
  IconIconsFilled,
  IconReorder,
} from '@tabler/icons-react';

const getPlatformMenu = (projectId, projectName, permissions = {}) => {
  const children = [];

  if (permissions.mapView) {
    children.push({
      id: 'util-typography',
      title: 'Exterior (Map View)',
      type: 'item',
      url: `/project/${projectId}/View`,
      icon: IconLiveViewFilled,
      breadcrumbs: false,
    });
  }

  if (permissions.compareView) {
    children.push({
      id: 'util-color',
      title: 'Compare View',
      type: 'item',
      url: `/project/${projectId}/compare`,
      icon: IconGitCompare,
      breadcrumbs: false,
    });
  }
  if (permissions.resourceManagement) {
    children.push({
      id: 'activityManagement',
      title: 'Activity',
      type: 'item',
      url: `/project/${projectId}/activity`,
      icon: IconIconsFilled,
      breadcrumbs: false,
    });
  }
  if (permissions.resourceManagement) {
    children.push({
      id: 'resourceManagement',
      title: 'Resources',
      type: 'item',
      url: `/project/${projectId}/resources`,
      icon: IconReorder,
      breadcrumbs: false,
    });
  }

  if (permissions.ProgressReport) {
    children.push({
      id: 'progressReport',
      title: 'Progress Report',
      type: 'item',
      url: `/project/${projectId}/dpr`,
      icon: IconReport,
      breadcrumbs: false,
    });
  }

  if (permissions.coordinationLogs) {
    children.push({
      id: 'issueTaggingAndCoordination',
      title: 'Coordination Logs',
      type: 'item',
      url: `/project/${projectId}/issue`,
      icon: IconTagStarred,
      breadcrumbs: false,
    });
  }

  if (permissions.interiorView) {
    children.push({
      id: '360viewer',
      title: 'Interior (360 View)',
      type: 'item',
      url: `/project/${projectId}/360view`,
      icon: IconView360Number,
      breadcrumbs: false,
    });
  }

  if (permissions.projectFiles) {
    children.push({
      id: 'projectFiles',
      title: 'Project Files',
      type: 'item',
      url: `/project/${projectId}/files`,
      icon: IconFiles,
      breadcrumbs: false,
    });
  }

  if (permissions.projectTeam) {
    children.push({
      id: 'projectTeam',
      title: 'Project Team',
      type: 'item',
      url: `/project/${projectId}/team`,
      icon: IconUsers,
      breadcrumbs: false,
    });
  }

  return {
    id: 'platform',
    title: projectName || 'Platform',
    type: 'group',
    children,
  };
};

export default getPlatformMenu;
