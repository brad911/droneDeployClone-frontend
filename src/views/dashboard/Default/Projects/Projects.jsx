import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectTile from './ProjectTile';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { progress } from 'framer-motion';
import { IconBuildingCog, IconDroneOff } from '@tabler/icons-react';

const projectData = [
  {
    id: 1,
    title: 'Road Inspection',
    description: 'Track changes over time',
    image: 'https://picsum.photos/200/300?1',
    images: 45,
    users: 2,
    progress: 70,
    createdAt: '2025-06-28T12:00:00Z',
  },
  {
    id: 2,
    title: 'Bridge Survey',
    description: 'High-res structural analysis',
    image: 'https://picsum.photos/200/300?2',
    images: 30,
    users: 3,
    progress: 10,
    createdAt: '2025-05-27T12:00:00Z',
  },
  {
    id: 3,
    title: 'Pipeline Monitoring',
    description: 'View weekly updates',
    image: 'https://picsum.photos/200/300?3',
    images: 15,
    users: 1,
    progress: 50,
    createdAt: '2024-06-28T12:00:00Z',
  },
  {
    id: 4,
    title: 'Agricultural Plot',
    description: 'Growth tracking with NDVI',
    image: 'https://picsum.photos/200/300?4',
    images: 50,
    users: 4,
    progress: 90,
    createdAt: '2025-06-28T12:00:00Z',
  },
];

function Projects() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projectData);

  const handleSearch = () => {
    let result = [...projectData];

    if (searchTerm) {
      result = result.filter((proj) =>
        proj.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'images') {
      result.sort((a, b) => b.images - a.images);
    }

    setFilteredProjects(result);
  };

  return (
    <Box p={3}>
      {/* Header and Controls */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Grid item xs={12} md={3}>
          <Typography variant="h2" fontWeight={600}>
            All Projects
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                label="Search by Name"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                sx={{ ...theme.typography.customSelect2, minWidth: '100px' }}
                fullWidth
              >
                <InputLabel>Sort By</InputLabel>
                <Select
                  size="small"
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="images">Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" fullWidth onClick={handleSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3} textAlign={{ xs: 'left', md: 'right' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/createProject')}
            startIcon={<AddIcon />}
            color="primary"
          >
            Create New Project
          </Button>
        </Grid>
      </Grid>

      {/* Project Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <ProjectTile project={project} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Projects;
