import { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../../utils/axios.config';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 3,
};

const ManageChecklistModal = ({ open, onClose, activity, role, refresh }) => {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');

  // 🔹 Fetch checklist for selected activity
  const fetchChecklist = async () => {
    if (!activity?.id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/activity-checklist`, {
        params: { activityId: activity.id },
      });
      setChecklist(res.data?.data?.results || []);
    } catch (err) {
      console.error('Error fetching checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add new checklist item (owner/editor)
  const handleAddItem = async () => {
    if (!newItem.trim()) return;
    try {
      await axiosInstance.post(`/activity-checklist`, {
        activityId: activity.id,
        description: newItem,
      });
      setNewItem('');
      fetchChecklist();
      refresh();
    } catch (err) {
      console.error('Error adding checklist item:', err);
    }
  };

  // 🔹 Toggle completion (member only)
  const handleToggle = async (item) => {
    try {
      await axiosInstance.patch(`/activity-checklist/${item.id}`, {
        isCompleted: !item.isCompleted,
      });
      fetchChecklist();
      refresh();
    } catch (err) {
      console.error('Error toggling checklist item:', err);
    }
  };

  // 🔹 Delete checklist item
  const handleDelete = async (itemId) => {
    try {
      await axiosInstance.delete(`/activity-checklist/${itemId}`);
      fetchChecklist();
      refresh();
    } catch (err) {
      console.error('Error deleting checklist item:', err);
    }
  };

  // 🔹 Edit flow
  const handleEditStart = (item) => {
    setEditingItem(item.id);
    setEditText(item.description);
  };

  const handleSaveEdit = async (itemId) => {
    try {
      await axiosInstance.patch(`/activity-checklist/${itemId}`, {
        description: editText,
      });
      setEditingItem(null);
      fetchChecklist();
      refresh();
    } catch (err) {
      console.error('Error saving checklist edit:', err);
    }
  };

  useEffect(() => {
    if (open && activity) {
      fetchChecklist();
    } else {
      setChecklist([]);
    }
  }, [open, activity]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            Manage Checklist – {activity?.name || ''}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Add new item (Owner/Editor only) */}
        {(role === 'owner' || role === 'editor') && (
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add new checklist item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ textTransform: 'none' }}
            >
              Add
            </Button>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Checklist items */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={4}
          >
            <CircularProgress size={30} />
          </Box>
        ) : checklist.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No checklist items yet.
          </Typography>
        ) : (
          <List>
            {checklist.map((item) => (
              <ListItem key={item.id} dense divider>
                <Tooltip
                  title={
                    role === 'member' ? 'Mark complete/incomplete' : 'View only'
                  }
                >
                  <Checkbox
                    checked={item.isCompleted}
                    onChange={() => handleToggle(item)}
                    // disabled={role !== 'member'}
                  />
                </Tooltip>

                {editingItem === item.id ? (
                  <TextField
                    fullWidth
                    size="small"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  <ListItemText
                    primary={item.description}
                    sx={{
                      textDecoration: item.isCompleted
                        ? 'line-through'
                        : 'none',
                      color: item.isCompleted ? 'text.secondary' : 'inherit',
                    }}
                  />
                )}

                {/* Owner/Editor Actions */}
                {(role === 'owner' || role === 'editor') && (
                  <ListItemSecondaryAction>
                    {editingItem === item.id ? (
                      <IconButton
                        color="success"
                        onClick={() => handleSaveEdit(item.id)}
                      >
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="primary"
                        onClick={() => handleEditStart(item)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default ManageChecklistModal;
