import {
  Box,
  Divider,
  Typography,
  Paper,
  ImageList,
  ImageListItem,
  Grid,
  Chip,
} from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';

export default function IssueDetailsPanel({
  sampleIssue,
  placeholderImages,
}) {
  return (
    <Paper
      sx={{
        flex: 1,
        minWidth: 320,
        maxWidth: 400,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 3,
        boxShadow: 2,
        border: '1px solid #f0f0f0',
      }}
    >
      <Typography variant="h2" fontWeight={600} sx={{ mb: 0.5 }}>
        Issue Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Information about the selected issue
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
          {sampleIssue.title}
        </Typography>
        <Chip
          label={sampleIssue.status}
          size="small"
          sx={{
            bgcolor: sampleIssue.status === 'Open' ? '#f44336' : '#4caf50',
            color: '#fff',
            fontWeight: 600,
            ml: 1,
            textTransform: 'capitalize',
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {sampleIssue.description}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PriorityHighIcon fontSize="small" color="error" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Priority
            </Typography>
            <Typography variant="body2" fontWeight={500} color={sampleIssue.priority === 'High' ? 'error.main' : 'text.primary'}>
              {sampleIssue.priority}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CategoryIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Category
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {sampleIssue.category}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Assignee
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {sampleIssue.assignee}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              Created
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {sampleIssue.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarTodayIcon fontSize="small" color="action" sx={{ mr: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
          Due Date
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {sampleIssue.dueDate||"N/A"}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
        Linked to Scheduled Work
      </Typography>
      <Typography variant="body2" fontWeight={500} sx={{ mb: 2 }}>
        {sampleIssue.linkedWork}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Photos
      </Typography>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {placeholderImages.map((img, idx) => (
          <Grid item xs={4} key={idx}>
            <Box
              sx={{
                width: '100%',
                height: 60,
                bgcolor: '#f3f3f3',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <img
                src={img}
                alt={`placeholder-${idx}`}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
