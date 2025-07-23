import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MainCard from 'ui-component/cards/MainCard';
import Breadcrumbs from '../../../../../ui-component/extended/Breadcrumbs';
import { IconBuildingCog, IconDroneOff, IconUsers } from '@tabler/icons-react';
import axiosInstance from 'utils/axios.config';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const TeamSetup = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [members, setMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState('viewer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const projectId = useSelector((state) => state.project.selectedProjectId);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!projectId) return;
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/project-members', {
          params: { projectId },
          headers: { Authorization: token },
        });
        setMembers(res.data.data?.results || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [projectId, token]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    let email = inviteEmail.trim();
    setInviteEmail('');
    try {
      const res = await axiosInstance.post(
        '/project-members',
        {
          projectId,
          email: email,
          role: invitePermission,
          status: 'invited',
        },
        { headers: { Authorization: token } },
      );
      setMembers((prev) => [...prev, res.data.data]);
      setInvitePermission('viewer');
      enqueueSnackbar('Team member invited successfully!', {
        variant: 'success',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      enqueueSnackbar(
        err.response?.data?.message || err.message || 'Failed to invite member',
        { variant: 'error' },
      );
    }
  };

  const handlePermissionChange = async (id, newPermission) => {
    try {
      await axiosInstance.patch(
        `/project-members/${id}`,
        { role: newPermission },
        { headers: { Authorization: token } },
      );
      setMembers((prev) =>
        prev.map((m) =>
          m._id === id || m.id === id ? { ...m, role: newPermission } : m,
        ),
      );
      enqueueSnackbar('Role updated successfully!', { variant: 'success' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      enqueueSnackbar(
        err.response?.data?.message || err.message || 'Failed to update role',
        { variant: 'error' },
      );
    }
  };

  const handleRemove = async (id) => {
    try {
      await axiosInstance.delete(`/project-members/${id}`, {
        headers: { Authorization: token },
      });
      setMembers(members.filter((m) => m._id !== id));
      enqueueSnackbar('Team member removed successfully!', {
        variant: 'success',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      enqueueSnackbar(
        err.response?.data?.message || err.message || 'Failed to remove member',
        { variant: 'error' },
      );
    }
  };
  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    { title: 'Project Name', to: '/project/1/View', icon: IconBuildingCog },
    { title: 'Project Files', icon: IconUsers }, // No `to` makes it the current page
  ];

  return (
    <MainCard>
      <Box>
        <Typography variant="h1" gutterBottom>
          Project Team
        </Typography>
        <Breadcrumbs
          links={pageLinks}
          card={true}
          custom={true}
          rightAlign={false}
        />
      </Box>
      {loading ? (
        <Typography variant="body1">Loading team members...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper
          sx={{
            p: 3,
            mx: 'auto',
            mt: 3,
            boxShadow: 4,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
            <TextField
              label="Invite by Email"
              size="small"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              select
              label="Permission"
              size="small"
              value={invitePermission}
              onChange={(e) => setInvitePermission(e.target.value)}
              sx={{ flex: 1, minWidth: 120 }}
            >
              <MenuItem value="editor">editor</MenuItem>
              <MenuItem value="viewer">viewer</MenuItem>
            </TextField>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleInvite}
              disabled={!inviteEmail}
            >
              Invite
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
                  <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                    Organization
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                    Designation
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                    Permission
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.primary.contrastText }}>
                    Status
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: theme.palette.primary.contrastText }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      {member.userId
                        ? member.userId.firstName + ' ' + member.userId.lastName
                        : 'Not Registered'}
                    </TableCell>
                    <TableCell>
                      {member.userId?.organization
                        ? member.userId?.organization
                        : 'Not Registered'}
                    </TableCell>
                    <TableCell>
                      {member.userId?.designation
                        ? member.userId?.designation
                        : 'Not Registered'}
                    </TableCell>

                    <TableCell>
                      <Select
                        size="small"
                        value={member.role}
                        onChange={(e) =>
                          handlePermissionChange(member._id, e.target.value)
                        }
                        sx={{ minWidth: 90 }}
                        disabled={member.role === 'owner'}
                      >
                        <MenuItem value="editor">editor</MenuItem>
                        <MenuItem value="viewer">viewer</MenuItem>
                        {member.role === 'owner' ? (
                          <MenuItem value="owner">owner</MenuItem>
                        ) : null}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.status}
                        color={
                          member.status === 'active' ? 'success' : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => handleRemove(member._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ color: theme.palette.text.disabled }}
                    >
                      No team members yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </MainCard>
  );
};

export default TeamSetup;
