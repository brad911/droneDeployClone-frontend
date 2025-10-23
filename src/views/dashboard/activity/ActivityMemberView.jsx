import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios.config';

const ActivityMemberView = ({ projectId, user }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [checklists, setChecklists] = useState({});

  // Fetch activities assigned to current member
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/activity', {
        params: { projectId },
      });
      const all = res.data.data?.results || res.data.data || [];
      const uid = user.id || user._id;
      const assigned = all.filter((a) => {
        const at = a.assignedTo;
        if (!at) return false;
        if (typeof at === 'string') return at === uid;
        return at._id === uid || at.id === uid || at.userId === uid;
      });
      setActivities(assigned);
    } catch (err) {
      console.error('Error fetching member activities:', err);
      enqueueSnackbar('Failed to fetch activities', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch checklist for a given activity
  const fetchChecklist = async (activityId) => {
    try {
      const res = await axiosInstance.get('/activity-checklist', {
        params: { activityId },
      });
      setChecklists((prev) => ({
        ...prev,
        [activityId]: res.data?.data?.results || [],
      }));
    } catch (err) {
      console.error('Error fetching checklist:', err);
      enqueueSnackbar('Failed to load checklist', { variant: 'error' });
    }
  };

  // Toggle checklist completion
  const handleToggle = async (activityId, item) => {
    try {
      await axiosInstance.patch(`/activity-checklist/${item.id}`, {
        isCompleted: !item.isCompleted,
      });
      enqueueSnackbar(
        `Checklist item marked as ${
          item.isCompleted ? 'incomplete' : 'complete'
        }`,
        { variant: 'success' },
      );
      fetchChecklist(activityId);
    } catch (err) {
      console.error('Error toggling checklist:', err);
      enqueueSnackbar('Failed to update checklist item', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (projectId && user) fetchActivities();
  }, [projectId, user]);

  const handleAccordionChange = (id) => (event, isExpanded) => {
    setExpanded(isExpanded ? id : false);
    if (isExpanded && !checklists[id]) {
      fetchChecklist(id);
    }
  };

  return (
    <Box>
      <Typography variant="h2" mb={2}>
        My Assigned Activities
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : activities.length === 0 ? (
        <Typography align="center" color="text.secondary" mt={4}>
          You have no assigned activities.
        </Typography>
      ) : (
        activities.map((activity) => (
          <Accordion
            key={activity.id || activity._id}
            expanded={expanded === (activity.id || activity._id)}
            onChange={handleAccordionChange(activity.id || activity._id)}
            sx={{ mb: 1, borderRadius: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" flexDirection="column">
                <Typography variant="h6">{activity.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {activity.quantity} | Cost: {activity.cost}
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Divider sx={{ mb: 2 }} />
              {checklists[activity.id || activity._id] ? (
                checklists[activity.id || activity._id].length > 0 ? (
                  <List dense>
                    {checklists[activity.id || activity._id].map((item) => (
                      <ListItem key={item.id}>
                        <Checkbox
                          checked={item.isCompleted}
                          onChange={() =>
                            handleToggle(activity.id || activity._id, item)
                          }
                        />
                        <ListItemText
                          primary={item.description}
                          sx={{
                            textDecoration: item.isCompleted
                              ? 'line-through'
                              : 'none',
                            color: item.isCompleted
                              ? 'text.secondary'
                              : 'inherit',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color="text.secondary" align="center">
                    No checklist items yet.
                  </Typography>
                )
              ) : (
                <Box display="flex" justifyContent="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default ActivityMemberView;
