import { Grid, Box, Typography } from '@mui/material';
import AddProject from './createProjectForm';
import teamImage from '../../../../assets/images/teams.jpg';

const CreateProjectPage = () => {
  const handleSubmit = (data) => {
    console.log('Project submitted:', data);
    // handle API call or state update
  };

  return (
    <Grid
      container
      sx={{
        minHeight: '80vh',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {/* Right Form Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <AddProject onSubmit={handleSubmit} />
      </Grid>
    </Grid>
  );
};

export default CreateProjectPage;
