import {
  Box,
  Divider,
  Typography,
  Paper,
  Grid,
  Chip,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
} from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import dayjs from 'dayjs';
import { CircularProgress } from '@mui/material';
import { keyframes } from '@mui/system';
// Helper to format timestamp
function formatTimeAgo(date) {
  date = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleString();
}

export default function IssueDetailsPanel({
  sampleIssue,
  placeholderImages,
  handleAddComment,
  comments,
  commentsLoading,
}) {
  const [newComment, setNewComment] = useState('');

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
    <Paper
      sx={{
        flex: 1,
        minWidth: 280,
        maxWidth: 320,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        borderRadius: 2,
        boxShadow: 1,
        border: '1px solid #f0f0f0',
        maxHeight: '60vh',
      }}
    >
      {/* Breadcrumbs */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.5,
        }}
      >
        <Typography variant="h3" fontWeight={600}>
          Log Details
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          {sampleIssue?.createdAt
            ? dayjs(sampleIssue.createdAt).format('DD-MM-YYYY')
            : ''}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
        Information about the selected Log
      </Typography>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={600} sx={{ flex: 1 }}>
          {sampleIssue?.title}
        </Typography>
        <Chip
          label={sampleIssue?.status}
          size="small"
          sx={{
            ...(sampleIssue?.status === 'resolved' && {
              animation: `${pulse} 2s infinite`,
              bgcolor: '#4caf50',
              color: 'white',
            }),

            ...(sampleIssue?.status === 'inProgress' && {
              animation: `${blink} 1.2s infinite`,
              bgcolor: '#fb8c00',
              color: 'white',
            }),

            ...(sampleIssue?.status === 'open' && {
              animation: `${blink} 1.5s infinite`,
              bgcolor: '#e53935',
              color: 'white',
            }),
            color: '#fff',
            fontWeight: 600,
            ml: 0.5,
            textTransform: 'capitalize',
            fontSize: '0.7rem',
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ mb: 1, lineHeight: 1.3 }}>
        {sampleIssue?.description}
      </Typography>
      <Grid container direction="column" gap={1}>
        {/* Row 1 */}
        <Grid container item spacing={2} justifyContent={'space-evenly'}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <PriorityHighIcon
                fontSize="small"
                color="error"
                sx={{ mr: 0.5 }}
              />
              <Typography
                variant="caption"
                fontWeight={500}
                color={
                  sampleIssue?.priority === 'High'
                    ? 'error.main'
                    : 'text.primary'
                }
              >
                {sampleIssue?.priority}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <CategoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="caption" fontWeight={500}>
                {sampleIssue?.category}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <PersonIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="caption" fontWeight={500}>
                {sampleIssue?.assignedTo?.firstName +
                  ' ' +
                  sampleIssue?.assignedTo?.lastName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarTodayIcon
                fontSize="small"
                color="action"
                sx={{ mr: 0.5 }}
              />
              <Typography variant="caption" fontWeight={500}>
                {sampleIssue?.dueDate
                  ? dayjs(sampleIssue.dueDate).format('DD-MM-YYYY')
                  : dayjs().format('DD-MM-YYYY')}
              </Typography>
            </Box>
            {/* Removed createdAt from here */}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 0.5 }} />
      <Typography variant="caption" fontWeight={600}>
        Photos
      </Typography>
      {/* Images in a horizontal scrollable row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          overflowX: 'auto',
          minHeight: 50,
        }}
      >
        {placeholderImages.map((img, idx) => (
          <Box
            key={idx}
            sx={{
              minWidth: 60,
              height: 40,
              bgcolor: '#f3f3f3',
              borderRadius: 0.5,
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
        ))}
      </Box>

      {commentsLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Comments Section */}
          <Divider sx={{ mb: 1 }} />
          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            Comments ({comments.length})
          </Typography>
          {/* Comments List */}
          <Box sx={{ maxHeight: 200, minHeight: 160, overflow: 'auto', mb: 1 }}>
            <List dense sx={{ p: 0 }}>
              {comments.map((comment) => (
                <ListItem
                  key={comment.id}
                  disableGutters
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 1,
                    px: 0,
                    py: 0,
                    bgcolor: 'transparent',
                    minHeight: 36,
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 32, mr: 1, mt: 0.5 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: '0.9rem',
                        bgcolor: 'primary.main',
                        color: '#fff',
                      }}
                    >
                      {`${comment?.createdBy?.firstName?.[0] || ''}${
                        comment?.createdBy?.lastName?.[0] || ''
                      }`}
                    </Avatar>
                  </ListItemAvatar>
                  <Box
                    sx={{
                      bgcolor: '#f0f2f5',
                      borderRadius: 2,
                      boxShadow: 1,
                      px: 1.5,
                      py: 1,
                      minWidth: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                          fontSize: '0.85rem',
                          color: 'text.primary',
                          mr: 1,
                        }}
                      >
                        {comment?.createdBy?.firstName +
                          ' ' +
                          comment?.createdBy?.lastName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem', mt: '2px' }}
                      >
                        {formatTimeAgo(comment?.createdAt)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.85rem',
                        color: 'text.primary',
                        mt: 0.5,
                        wordBreak: 'break-word',
                      }}
                    >
                      {comment?.comment}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}

      {/* Add Comment */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <TextField
          size="small"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              fontSize: '0.7rem',
              height: 32,
            },
          }}
        />
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            handleAddComment(newComment);
            setNewComment('');
          }}
          disabled={!newComment.trim()}
          sx={{
            minWidth: 32,
            height: 32,
            px: 1,
            '& .MuiButton-startIcon': {
              margin: 0,
            },
          }}
        >
          <SendIcon sx={{ fontSize: '0.8rem' }} />
        </Button>
      </Box>
    </Paper>
  );
}
