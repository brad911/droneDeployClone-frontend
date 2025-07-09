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
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../utils/axios.config';
import { useEffect } from 'react';

function Projects() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth);
  const fetchProjects = async (search = '', sort = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (sort) params.sortBy = sort;
      params.email = user.user.email;
      params.status = 'active';
      const response = await axiosInstance.get('/project-members', {
        params,
        headers: { Authorization: user.token },
      });
      console.log(response.data?.data?.results, '<====');
      setFilteredProjects(response.data?.data?.results || response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = () => {
    fetchProjects(searchTerm, sortBy);
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
      {loading ? (
        <Typography variant="body1">Loading projects...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects?.map((project, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <ProjectTile
                project={project.projectId}
                count={project.memberCount}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Projects;
