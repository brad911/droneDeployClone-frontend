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
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../../utils/axios.config';
import DeleteDialogue from './Dialogue/DeleteDialogue';
import DuplicateDialogue from './Dialogue/DuplicateDialogue';
import EditProjectModal from './Dialogue/EditProjectModal';

function Projects() {
  const theme = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('project.createdAt:desc');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 12;

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Duplicate Dialog state
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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
      if (search) params.projectName = search;
      if (sort) params.sortBy = sort;

      const response = await axiosInstance.get('/project-members', {
        params,
        headers: { Authorization: user.token },
      });

      const data = response.data?.data;
      setFilteredProjects(data?.results || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateRequest = (project) => {
    setSelectedProject(project);
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateConfirm = async () => {
    if (!selectedProject) return;
    setDuplicating(true);
    try {
      const res = await axiosInstance.post(
        `/project/duplicate/${selectedProject._id}`,
      );
      if (res.status === 200) {
        enqueueSnackbar('Project duplicated successfully', {
          variant: 'success',
        });
        fetchProjects(searchTerm, sortBy, page);
      }
    } catch (e) {
      console.log(e);
      enqueueSnackbar('Error duplicating project', { variant: 'error' });
    } finally {
      setDuplicating(false);
      setDuplicateDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const handleEditRequest = (project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (formData) => {
    setSaving(true);
    try {
      const res = await axiosInstance.patch(
        `/project/${selectedProject._id}`,
        formData,
        { headers: { Authorization: user.token } },
      );
      if (res.status === 200) {
        enqueueSnackbar('Project updated successfully', { variant: 'success' });
        fetchProjects(searchTerm, sortBy, page);
      }
    } catch (e) {
      enqueueSnackbar('Error updating project', { variant: 'error' });
    } finally {
      setSaving(false);
      setEditModalOpen(false);
    }
  };

  useEffect(() => {
    fetchProjects(searchTerm, sortBy, page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchProjects(searchTerm, sortBy, 1);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    setDeleting(true);
    try {
      const res = await axiosInstance.delete(
        `/project/${selectedProject._id}`,
        {
          headers: { Authorization: user.token },
        },
      );

      if (res.status === 200) {
        enqueueSnackbar('Project deleted successfully', { variant: 'success' });
        // Refresh list
        fetchProjects(searchTerm, sortBy, page);
      }
    } catch (e) {
      console.log('Error deleting project:', e);
      if (e?.response?.status === 403) {
        enqueueSnackbar('You do not have permission to delete this project', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Error deleting project', { variant: 'error' });
      }
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const handleDeleteRequest = (project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
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
                  <MenuItem value="project.name:asc">
                    Project Name (A → Z)
                  </MenuItem>
                  <MenuItem value="project.name:desc">
                    Project Name (Z → A)
                  </MenuItem>
                  <MenuItem value="project.createdAt:desc">
                    Project Date (Newest)
                  </MenuItem>
                  <MenuItem value="project.createdAt:asc">
                    Project Date (Oldest)
                  </MenuItem>
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
      ) : filteredProjects.length === 0 ? (
        <Box mt={6} textAlign="center">
          <Typography variant="h6" color="text.secondary">
            No projects found. Create a project to start working.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredProjects.map((project, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <ProjectTile
                  project={project.project}
                  count={project.memberCount}
                  onDelete={handleDeleteRequest}
                  onDuplicate={handleDuplicateRequest}
                  onEdit={handleEditRequest}
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

      <DeleteDialogue
        open={deleteDialogOpen}
        deleting={deleting}
        selectedProject={selectedProject}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <DuplicateDialogue
        open={duplicateDialogOpen}
        duplicating={duplicating}
        selectedProject={selectedProject}
        onClose={() => setDuplicateDialogOpen(false)}
        onConfirm={handleDuplicateConfirm}
      />

      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        selectedProject={selectedProject}
        saving={saving}
      />
    </Box>
  );
}

export default Projects;
