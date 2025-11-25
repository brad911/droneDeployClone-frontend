// File: tabs/ListViewTab.jsx
import {
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  Stack,
  Tooltip,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import FlagIcon from '@mui/icons-material/Flag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';
import { keyframes } from '@mui/system';
import { useState } from 'react';
import ResolveIssueModal from '../ResolveIssueModal';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from '../../../../../utils/axios.config';

export default function ListViewTab({
  ticketList,
  setSelectedIssue,
  setTab,
  filters,
  setFilters,
  teamMembers,
  setRefresh,
}) {
  const theme = useTheme();

  const [openResolveModal, setOpenResolveModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);

  const handleUpdateStatus = async (updatedData) => {
    try {
      const response = await axiosInstance.patch(
        `/issue/${updatedData.id}`,
        updatedData,
      );
      if (response.status === 200) {
        enqueueSnackbar('Issue status has been changed!', {
          variant: 'success',
        });
      }
      setRefresh((p) => !p);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update issue status', { variant: 'error' });
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return theme.palette.grey;
    if (priority.toLowerCase() === 'high') return theme.palette.error;
    if (priority.toLowerCase() === 'medium') return theme.palette.warning;
    return theme.palette.success;
  };

  const pulse = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
    70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
  `;
  const blink = keyframes`
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  `;

  return (
    <Box>
      {/* FILTER BAR */}
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* TITLE */}
        <TextField
          label="Title"
          size="small"
          value={filters.title}
          onChange={(e) => setFilters((p) => ({ ...p, title: e.target.value }))}
          sx={{ minWidth: 200 }}
        />

        {/* CATEGORY */}
        <TextField
          select
          label="Category"
          size="small"
          value={filters.category}
          onChange={(e) =>
            setFilters((p) => ({ ...p, category: e.target.value }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="architecture">Architecture</MenuItem>
          <MenuItem value="structure">Structure</MenuItem>
          <MenuItem value="MEPF">MEPF</MenuItem>
          <MenuItem value="safety">Safety</MenuItem>
          <MenuItem value="quality">Quality</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        {/* TYPE */}
        <TextField
          select
          label="Type"
          size="small"
          value={filters.type}
          onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="issue">Issue</MenuItem>
          <MenuItem value="task">Task</MenuItem>
        </TextField>

        {/* PRIORITY */}
        <TextField
          select
          label="Priority"
          size="small"
          value={filters.priority}
          onChange={(e) =>
            setFilters((p) => ({ ...p, priority: e.target.value }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </TextField>

        {/* STATUS */}
        <TextField
          select
          label="Status"
          size="small"
          value={filters.status}
          onChange={(e) =>
            setFilters((p) => ({ ...p, status: e.target.value }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="inProgress">In Progress</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </TextField>

        {/* ASSIGNED TO */}
        <TextField
          select
          label="Assigned To"
          size="small"
          value={filters.assignedTo}
          onChange={(e) =>
            setFilters((p) => ({ ...p, assignedTo: e.target.value }))
          }
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {teamMembers?.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.userId.firstName} {m.userId.lastName}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      {/* LIST VIEW */}
      <Stack spacing={2}>
        {ticketList.map((ticket) => {
          const priorityColor = getPriorityColor(ticket.priority);

          return (
            <Paper
              key={ticket.id}
              onClick={() => {
                setTab('map');
                setSelectedIssue(ticket);
              }}
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                cursor: 'pointer',
                borderLeft: `6px solid ${ticket?.pinColor || '#bbb'}`,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              {/* TITLE & DESCRIPTION */}
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                  {ticket.title || ticket.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ticket.description}
                </Typography>
              </Box>

              {/* CHIPS + BUTTON */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                {/* LEFT: CHIPS */}
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ rowGap: 1 }}
                >
                  <Chip
                    icon={<CategoryIcon />}
                    label={ticket.category || ticket.type}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                  {ticket.assignedTo && (
                    <Chip
                      icon={<PersonIcon />}
                      label={`${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`}
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                  {ticket.priority && (
                    <Chip
                      icon={<FlagIcon />}
                      label={ticket.priority}
                      size="small"
                      sx={{
                        bgcolor: priorityColor.light,
                        color: priorityColor.dark,
                        border: `1px solid ${priorityColor.main}`,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {ticket.dueDate && (
                    <Chip
                      icon={<CalendarTodayIcon />}
                      label={dayjs(ticket.dueDate).format('DD-MM-YYYY')}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor: '#e53935',
                        color: 'white',
                      }}
                    />
                  )}
                  {ticket.status && (
                    <Chip
                      icon={<InfoIcon />}
                      label={ticket.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        ...(ticket.status === 'resolved' && {
                          animation: `${pulse} 2s infinite`,
                          bgcolor: '#4caf50',
                          color: 'white',
                        }),
                        ...(ticket.status === 'inProgress' && {
                          animation: `${blink} 1.2s infinite`,
                          bgcolor: '#fb8c00',
                          color: 'white',
                        }),
                        ...(ticket.status === 'open' && {
                          animation: `${blink} 1.5s infinite`,
                          bgcolor: '#e53935',
                          color: 'white',
                        }),
                      }}
                    />
                  )}
                </Stack>

                {/* RIGHT: BUTTON */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTicket(ticket);
                    setOpenResolveModal(true);
                  }}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Resolve Issue
                </Button>
              </Box>
            </Paper>
          );
        })}
      </Stack>

      {/* RESOLVE MODAL */}
      <ResolveIssueModal
        open={openResolveModal}
        onClose={() => setOpenResolveModal(false)}
        issue={currentTicket}
        onUpdateStatus={handleUpdateStatus}
      />
    </Box>
  );
}
