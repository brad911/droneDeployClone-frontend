import { Grid, Box, Typography } from '@mui/material';
import AddProject from './createProjectForm';
import teamImage from '../../../../assets/images/teams.jpg';

const CreateProjectPage = () => {
  const handleSubmit = (data) => {
    console.log('Project submitted:', data);
    // handle API call or state update
  };

  return (
    <Grid container sx={{ minHeight: '80vh', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
      {/* Left Image Section */}
      <Grid
        item
        xs={12}
        md={12}
        sx={{
          backgroundImage: `url(${teamImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          color: 'white'
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        />
        {/* Text on Image */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 4
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom color="white">
            Build Your Dream Project
          </Typography>
          <Typography variant="h6" color="white">
            Invite your team, share files, and collaborate seamlessly.
          </Typography>
        </Box>
      </Grid>

      {/* Right Form Section */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AddProject onSubmit={handleSubmit} />
      </Grid>
    </Grid>
  );
};

export default CreateProjectPage;
