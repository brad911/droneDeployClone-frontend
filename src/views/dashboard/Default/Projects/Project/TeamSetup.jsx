import React, { useState } from 'react';
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

const initialMembers = [
  { id: 1, email: 'alice@example.com', permission: 'Editor', status: 'Active' },
  { id: 2, email: 'bob@example.com', permission: 'Viewer', status: 'Invited' },
];

const TeamSetup = () => {
  const theme = useTheme();
  const [members, setMembers] = useState(initialMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePermission, setInvitePermission] = useState('Viewer');

  const handleInvite = () => {
    if (!inviteEmail) return;
    setMembers([
      ...members,
      {
        id: Date.now(),
        email: inviteEmail,
        permission: invitePermission,
        status: 'Invited',
      },
    ]);
    setInviteEmail('');
    setInvitePermission('Viewer');
  };

  const handlePermissionChange = (id, newPermission) => {
    setMembers(members.map(m => m.id === id ? { ...m, permission: newPermission } : m));
  };

  const handleRemove = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 3, bgcolor: theme.palette.background.paper }}>
      <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
        Team Setup
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          label="Invite by Email"
          size="small"
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          sx={{ flex: 2 }}
        />
        <TextField
          select
          label="Permission"
          size="small"
          value={invitePermission}
          onChange={e => setInvitePermission(e.target.value)}
          sx={{ flex: 1, minWidth: 120 }}
        >
          <MenuItem value="Editor">Editor</MenuItem>
          <MenuItem value="Viewer">Viewer</MenuItem>
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
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Email</TableCell>
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Permission</TableCell>
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Status</TableCell>
              <TableCell align="center" sx={{ color: theme.palette.primary.contrastText }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={member.permission}
                    onChange={e => handlePermissionChange(member.id, e.target.value)}
                    sx={{ minWidth: 90 }}
                  >
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.status}
                    color={member.status === 'Active' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton color="error" onClick={() => handleRemove(member.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: theme.palette.text.disabled }}>
                  No team members yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TeamSetup;
