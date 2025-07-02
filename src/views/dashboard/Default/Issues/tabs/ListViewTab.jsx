// File: tabs/ListViewTab.jsx
import {
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  Stack,
  Tooltip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import FlagIcon from '@mui/icons-material/Flag';

export default function ListViewTab({ ticketList }) {
  const theme = useTheme();

  const getPriorityColor = (priority) => {
    if (priority === 'High') return theme.palette.error;
    if (priority === 'Medium') return theme.palette.warning;
    return theme.palette.success;
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Ticket List
      </Typography>

      <Stack spacing={2}>
        {ticketList.map((ticket) => {
          const priorityColor = getPriorityColor(ticket.priority);

          return (
            <Paper
              key={ticket.id}
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
                boxShadow: theme.shadows[3],
              }}
            >
              {/* Left: Title & Meta */}
              <Box sx={{ flexGrow: 1, minWidth: 240 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ mb: 0.5, color: theme.palette.text.primary }}
                >
                  {ticket.issue}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created At: {ticket.createdAt.toLocaleString()}
                </Typography>
              </Box>

              {/* Right: Chips */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  minWidth: 300,
                }}
              >
                <Tooltip title="Issue Type">
                  <Chip
                    icon={<CategoryIcon />}
                    label={ticket.type}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: 500,
                      borderColor: theme.palette.grey[300],
                    }}
                  />
                </Tooltip>

                <Tooltip title="Assigned To">
                  <Chip
                    icon={<PersonIcon />}
                    label={ticket.assignedTo}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  />
                </Tooltip>

                <Tooltip title="Priority">
                  <Chip
                    icon={<FlagIcon />}
                    label={ticket.priority}
                    size="small"
                    sx={{
                      bgcolor: priorityColor.light,
                      color: priorityColor.dark,
                      fontWeight: 600,
                    }}
                  />
                </Tooltip>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
