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
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectTile from './ProjectTile';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../../utils/axios.config';

function Projects() {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 12;

  const fetchProjects = async (search = '', sort = '', pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        email: user.user.email,
        status: 'active',
        page: pageNumber,
        limit: LIMIT,
      };
      if (search) params.search = search;
      if (sort) params.sortBy = sort;

      const response = await axiosInstance.get('/project-members', {
        params,
        headers: { Authorization: user.token },
      });

      const data = response.data?.data;
      setFilteredProjects(data?.results || []);
      setTotalPages(data?.totalPages || 1); // assumes backend returns totalPages
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(searchTerm, sortBy, page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchProjects(searchTerm, sortBy, 1);
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
            justifyContent="center"
            alignItems="center"
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
        <>
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

          {totalPages > 1 && (
            <Box mt={4} display="flex" justifyContent="center">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default Projects;
