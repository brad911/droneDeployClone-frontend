import { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ManPower from './manPower/ManPower';
import Machinery from './machinery/Machinery';
import Material from './material/Material';
import MainCard from 'ui-component/cards/MainCard';
import {
  IconBuildingCog,
  IconDroneOff,
  IconIconsFilled,
} from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import Breadcrumbs from '../../../ui-component/extended/Breadcrumbs';

const Resources = () => {
  const [tab, setTab] = useState(0);
  const projectId = useSelector((state) => state.project.id);
  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    {
      title: 'Project Name',
      to: `/project/${projectId}/View`,
      icon: IconBuildingCog,
    },
    { title: 'Resources', icon: IconIconsFilled },
  ];
  const handleChange = (_, newValue) => setTab(newValue);

  return (
    <MainCard>
      <Box sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1" gutterBottom>
          Resource Management
        </Typography>
      </Box>
      <Box justifyContent="left">
        <Breadcrumbs links={pageLinks} card custom rightAlign={false} />
      </Box>
      <Tabs value={tab} onChange={handleChange}>
        <Tab label="Man Power" />
        <Tab label="Material" />
        <Tab label="Machinery" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && <ManPower />}
        {tab === 1 && <Material />}
        {tab === 2 && <Machinery />}
      </Box>
    </MainCard>
  );
};

export default Resources;
