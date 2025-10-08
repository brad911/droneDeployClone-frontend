import { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios.config';
import ActivityModal from './ActivityModal';
import MainCard from 'ui-component/cards/MainCard';
import Breadcrumbs from '../../ui-component/extended/Breadcrumbs';
import {
  IconBuildingCog,
  IconDroneOff,
  IconIconsFilled,
} from '@tabler/icons-react';
import ManageChecklistModal from './ManageChecklistModal';
import ActivityMemberView from './ActivityMemberView'; // ✅ make sure this path is correct

const Activity = () => {
  const { user } = useSelector((state) => state.auth);
  const { id: projectId, name: projectName } = useSelector(
    (state) => state.project,
  );

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [checklistModal, setChecklistModal] = useState({
    open: false,
    activity: null,
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // helper: check if activity assigned to current user
  const isAssignedToUser = (activity) => {
    const assigned = activity.assignedTo;
    const uid = user?.id || user?._id;
    if (!assigned || !uid) return false;
    if (typeof assigned === 'string')
      return assigned === uid || assigned === user?._id;
    return (
      assigned._id === uid ||
      assigned.id === uid ||
      assigned.userId === uid ||
      assigned.userId?._id === uid
    );
  };

  // 🔹 Fetch user role
  const fetchUserRole = async () => {
    try {
      const res = await axiosInstance.get(
        `/project-members/getProjectMemberByIDandProjectID/${user.id}/${projectId}`,
      );
      const roleValue = res.data.data?.role;
      setRole(roleValue);
    } catch (err) {
      console.error('Error fetching role:', err);
    }
  };

  // 🔹 Fetch activities
  const fetchActivities = async () => {
    if (!projectId) return;
    setLoading(true);

    try {
      const res = await axiosInstance.get('/activity', {
        params: { projectId, page, limit },
      });

      let list = res.data.data?.results || res.data.data || [];
      const totalItems = res.data.data?.total || list.length;

      if (role === 'member') {
        list = list.filter((a) => isAssignedToUser(a));
      }

      setActivities(list);
      setTotal(totalItems);
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && user?.id) fetchUserRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, user]);

  useEffect(() => {
    if (role) fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleManageChecklist = (activity) => {
    setChecklistModal({ open: true, activity });
  };

  const handleDeleteActivity = async (activityId) => {
    const ok = window.confirm('Delete this activity? This cannot be undone.');
    if (!ok) return;
    try {
      await axiosInstance.delete(`/activity/${activityId}`);
      fetchActivities();
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setOpenModal(true);
  };

  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    {
      title: projectName,
      to: `/project/${projectId}/View`,
      icon: IconBuildingCog,
    },
    { title: 'Activity', icon: IconIconsFilled },
  ];

  // ✅ CLEAN RENDER
  return (
    <>
      {role === 'viewer' ? (
        <ActivityMemberView projectId={projectId} user={user} />
      ) : (
        <MainCard container spacing={3} flexDirection={'column'}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h1" gutterBottom>
              Activity Management
            </Typography>

            {(role === 'owner' || role === 'editor') && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingActivity(null);
                  setOpenModal(true);
                }}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Add Activity
              </Button>
            )}
          </Box>

          {/* Breadcrumbs */}
          <Box justifyContent="left" mb={2}>
            <Breadcrumbs links={pageLinks} card custom rightAlign={false} />
          </Box>

          {/* Table */}
          <Grid item xs={12}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : activities.length > 0 ? (
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 2, boxShadow: 2 }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                    <TableRow>
                      <TableCell>
                        <strong>#</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Quantity</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Unit</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Cost</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Started At</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Ended At</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Assigned To</strong>
                      </TableCell>

                      {(role === 'owner' || role === 'editor') && (
                        <TableCell align="center">
                          <strong>Actions</strong>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {activities.map((activity, index) => {
                      const assignedName = activity.assignedTo
                        ? activity.assignedTo.firstName
                          ? `${activity.assignedTo.firstName} ${activity.assignedTo.lastName}`
                          : activity.assignedTo.name ||
                            activity.assignedTo.userId?.name ||
                            activity.assignedTo._id ||
                            '—'
                        : '—';

                      return (
                        <TableRow key={activity._id || activity.id} hover>
                          <TableCell>
                            {(page - 1) * limit + index + 1}
                          </TableCell>
                          <TableCell>{activity.name}</TableCell>
                          <TableCell>{activity.quantity}</TableCell>
                          <TableCell>{activity.unit}</TableCell>
                          <TableCell>{activity.cost}</TableCell>
                          <TableCell>
                            {new Date(activity.startedAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(activity.endedAt).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </TableCell>

                          <TableCell>{assignedName}</TableCell>

                          {(role === 'owner' || role === 'editor') && (
                            <TableCell align="center">
                              <Box
                                display="flex"
                                gap={1}
                                justifyContent="center"
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<ListAltIcon />}
                                  onClick={() =>
                                    handleManageChecklist(activity)
                                  }
                                >
                                  Checklist
                                </Button>

                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditActivity(activity)}
                                  title="Edit activity"
                                >
                                  <EditIcon />
                                </IconButton>

                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() =>
                                    handleDeleteActivity(activity._id)
                                  }
                                  title="Delete activity"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Divider />
                <Box display="flex" justifyContent="center" p={2}>
                  <Pagination
                    count={Math.ceil(total / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              </TableContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ mt: 4 }}>
                No activities found.
              </Typography>
            )}
          </Grid>

          {/* Modals */}
          <ActivityModal
            open={openModal}
            onClose={() => {
              setOpenModal(false);
              setEditingActivity(null);
            }}
            projectId={projectId}
            user={user}
            activity={editingActivity}
            onCreated={fetchActivities}
            onUpdated={fetchActivities}
          />

          <ManageChecklistModal
            open={checklistModal.open}
            onClose={() => setChecklistModal({ open: false, activity: null })}
            activity={checklistModal.activity}
            role={role}
            refresh={fetchActivities}
          />
        </MainCard>
      )}
    </>
  );
};

export default Activity;
