import { Box, Typography, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectTile from './ProjectTile';
import { useNavigate } from 'react-router';

const projectData = [
  {
    title: 'Road Inspection',
    description: 'Track changes over time',
    image: 'https://picsum.photos/200/300?1',
    images: 45,
    users: 2,
  },
  {
    title: 'Bridge Survey',
    description: 'High-res structural analysis',
    image: 'https://picsum.photos/200/300?2',
    images: 30,
    users: 3,
  },
  {
    title: 'Pipeline Monitoring',
    description: 'View weekly updates',
    image: 'https://picsum.photos/200/300?3',
    images: 15,
    users: 1,
  },
  {
    title: 'Agricultural Plot',
    description: 'Growth tracking with NDVI',
    image: 'https://picsum.photos/200/300?4',
    images: 50,
    users: 4,
  },
];

function Projects() {
  const navigate = useNavigate();
  return (
    <Box p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          All Projects
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/createProject')}
          startIcon={<AddIcon />}
          color="secondary"
        >
          Create New Project
        </Button>
      </Box>

      {/* Project Grid */}
      <Grid container spacing={3}>
        {projectData.map((project, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <ProjectTile project={project} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Projects;
