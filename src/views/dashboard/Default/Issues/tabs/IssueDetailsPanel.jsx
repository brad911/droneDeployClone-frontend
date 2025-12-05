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
  CircularProgress,
} from '@mui/material';
import { keyframes } from '@mui/system';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import UploadImageModal from '../UploadImageModal';
import axiosInstance from '../../../../../utils/axios.config';
import { enqueueSnackbar } from 'notistack';
import SingleImageViewer from '../../../../../ui-component/SingleImageViewer';
import { useSelector } from 'react-redux';

const MAX_PHOTOS = 5;

// Helper to format timestamp
function formatTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleString();
}

export default function IssueDetailsPanel({
  sampleIssue,
  handleAddComment,
  comments,
  commentsLoading,
}) {
  const userId = useSelector((state) => state.auth.user?.id);
  const [newComment, setNewComment] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [photoUrls, setPhotoUrls] = useState(sampleIssue?.photos || []);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setViewerOpen(true);
  };
  useEffect(() => {
    if (!sampleIssue?.photos?.length) {
      setPhotoUrls([]);
      return;
    }

    const fetchUrls = async () => {
      try {
        const urls = await Promise.all(
          sampleIssue.photos.map(async (key) => {
            const res = await axiosInstance.post(`/issue/getUrl`, { Key: key });
            console.log('Fetched URL response:', res);
            return res.data.data; // assuming API returns { url: "signed_url_here" }
          }),
        );
        setPhotoUrls(urls);
      } catch (err) {
        console.error('Failed to fetch photo URLs', err);
        setPhotoUrls([]); // fallback
      }
    };

    fetchUrls();
  }, [sampleIssue]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photoUrls.length > MAX_PHOTOS) {
      enqueueSnackbar(`Max ${MAX_PHOTOS} photos allowed`, {
        variant: 'warning',
      });
      return;
    }
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('photos', file));
      formData.append('workDayId', sampleIssue.workDayId);
      formData.append('projectId', sampleIssue.projectId);

      const res = await axiosInstance.post(
        `/issue/image/${sampleIssue.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (res.status === 200) {
        const updatedPhotos = res.data.photos || [];
        setPhotoUrls(updatedPhotos);
        enqueueSnackbar('Images uploaded successfully', { variant: 'success' });
      }

      setSelectedFiles([]);
      setOpen(false);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to upload images', { variant: 'error' });
    }
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
  const deleteIssueImage = async (key) => {
    console.log(key, '<==== wow');
    if (!key || !sampleIssue?.id) return;
    const wow = selectedImage.split('.com/')[1].split('?')[0];
    try {
      const res = await axiosInstance.post(
        `/issue/image/delete/${sampleIssue?.id}`,
        {
          key: wow,
        },
      );

      if (res.status === 200) {
        enqueueSnackbar('Image deleted successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to delete image', { variant: 'error' });
      }
    } catch (err) {
      console.error('Delete image failed:', err);
      enqueueSnackbar('Failed to delete image', { variant: 'error' });
      throw err;
    }
  };
  return (
    <Paper
      sx={{
        flex: 1,
        minWidth: 280,
        maxWidth: 320,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        borderRadius: 2,
        boxShadow: 1,
        border: '1px solid #f0f0f0',
        minHeight: '60vh',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h3" fontWeight={600}>
          Log Details
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {sampleIssue?.createdAt
            ? dayjs(sampleIssue.createdAt).format('DD-MM-YYYY')
            : ''}
        </Typography>
      </Box>

      {/* Title & Status */}
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
            }),
            ...(sampleIssue?.status === 'inProgress' && {
              animation: `${blink} 1.2s infinite`,
              bgcolor: '#fb8c00',
            }),
            ...(sampleIssue?.status === 'open' && {
              animation: `${blink} 1.5s infinite`,
              bgcolor: '#e53935',
            }),
            color: '#fff',
            fontWeight: 600,
            ml: 0.5,
            textTransform: 'capitalize',
            fontSize: '0.7rem',
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {sampleIssue?.description}
      </Typography>

      {/* Meta Info */}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <PriorityHighIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
            <Typography
              variant="caption"
              fontWeight={500}
              color={
                sampleIssue?.priority === 'High' ? 'error.main' : 'text.primary'
              }
            >
              {sampleIssue?.priority}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{sampleIssue?.category}</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <PersonIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="caption">
              {sampleIssue?.assignedTo?.firstName +
                ' ' +
                sampleIssue?.assignedTo?.lastName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon
              fontSize="small"
              color="action"
              sx={{ mr: 0.5 }}
            />
            <Typography variant="caption">
              {sampleIssue?.dueDate
                ? dayjs(sampleIssue.dueDate).format('DD-MM-YYYY')
                : dayjs().format('DD-MM-YYYY')}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Photos */}
      <Typography variant="caption" fontWeight={600} sx={{ mt: 1 }}>
        Photos
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          overflowX: 'auto',
          minHeight: 40,
        }}
      >
        {photoUrls.map((img, idx) => (
          <Box
            onClick={() => handleImageClick(img)}
            key={idx}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 0.5,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={img}
              alt={`photo-${idx}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ))}

        {photoUrls.length < MAX_PHOTOS && sampleIssue?.createdBy === userId && (
          <Box
            onClick={() => setOpen(true)}
            sx={{
              minWidth: 40,
              height: 40,
              bgcolor: '#e0e0e0',
              borderRadius: 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            +
          </Box>
        )}
      </Box>

      {/* Comments */}
      {commentsLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 1,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Typography variant="h5" fontWeight={600}>
            Comments ({comments.length})
          </Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
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
                      {comment?.createdBy?.firstName?.[0] +
                        comment?.createdBy?.lastName?.[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <Box
                    sx={{
                      bgcolor: '#f0f2f5',
                      borderRadius: 2,
                      boxShadow: 1,
                      px: 1.5,
                      py: 1,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ fontSize: '0.85rem' }}
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
      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
        <TextField
          size="small"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            flex: 1,
            '& .MuiInputBase-root': { fontSize: '0.7rem', height: 32 },
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
        >
          <SendIcon sx={{ fontSize: '0.8rem' }} />
        </Button>
      </Box>

      {/* Upload Modal */}
      <UploadImageModal
        open={open}
        onClose={() => {
          setSelectedFiles([]);
          setOpen(false);
        }}
        onFilesSelected={handleFileSelect}
        onUpload={handleUpload}
        selectedFiles={selectedFiles}
      />
      <SingleImageViewer
        onDelete={deleteIssueImage}
        open={viewerOpen}
        image={selectedImage}
        onClose={() => setViewerOpen(false)}
      />
    </Paper>
  );
}
