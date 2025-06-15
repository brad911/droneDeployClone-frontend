import { Tabs, Tab, Box, Paper } from '@mui/material';
import InfoTab from './tabs/InfoTab';
import ViewTab from './tabs/ViewTab';
import FilesTab from './tabs/FileTab';
import PlaceholderTab from './tabs/PlaceholderTab';
import CompareMapsTab from './tabs/CompareTab';
import { useState } from 'react';

const tabList = ['Info', 'Files', 'Compare', 'DPR FORM'];

const Project = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        sx={{ mb: 2, borderBottom: '1px solid #e0e0e0' }}
      >
        {tabList.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>

      <Box>
        {value === 0 ? <InfoTab /> : null}
        {/* {value === 1 ? <ViewTab /> : null} */}
        {value === 1 ? <FilesTab /> : null}
        {value === 2 ? <CompareMapsTab /> : null}
        {value === 3 ? <PlaceholderTab /> : null}
      </Box>
    </Paper>
  );
};

export default Project;
