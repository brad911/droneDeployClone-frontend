import {
  Box,
  Button,
  Fade,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import * as turf from '@turf/turf';
import { IconTrash, IconX } from '@tabler/icons-react';
import axiosInstance from '../../../../utils/axios.config';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import mapboxgl from 'mapbox-gl';

const CommentInput = ({
  commentInput,
  setCommentInput,
  addCommentLayer,
  setCommentFeatures,
  commentFeatures,
  handleDeleteComment,
  workDay,
  drawRef,
}) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const handleCommentSubmit = async (comment, geometry) => {
    try {
      const stableId = `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const baseFeature = { ...commentInput.feature };

      // Prepare the feature for backend and local state
      const commentFeature = {
        ...baseFeature,
        type: 'Feature',
        geometry: geometry || baseFeature.geometry,
        properties: {
          ...baseFeature.properties,
          id: stableId,
          workDayId: workDay.id,
          comment,
          type: 'comment',
          createdAt: new Date().toISOString(),
          createdBy: user,
        },
      };

      // Backend payload
      const payload = {
        geometry: commentFeature.geometry,
        properties: commentFeature.properties,
        featureType: commentFeature.properties.type,
        workDayId: workDay.id,
      };

      const response = await axiosInstance.post('/mapFeature', payload, {
        headers: { Authorization: token },
      });

      if (response.status === 201) {
        enqueueSnackbar('Successfully Added Comment', { variant: 'success' });
      }

      // Update state
      setCommentFeatures((prev) => [...prev, commentFeature]);

      // Add to map
      console.log(commentFeature, '<=== yeets');
      drawRef.add(commentFeature);

      // Reset comment input
      setCommentInput({
        open: false,
        feature: null,
        isEdit: false,
        position: { x: 0, y: 0 },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Fade in={commentInput.open}>
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          p: 1.5,
          width: 250,
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
            {commentInput.isEdit ? 'Edit Comment' : 'Add Comment'}
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              setCommentInput({
                open: false,
                feature: null,
                isEdit: false,
                position: { x: 0, y: 0 },
              })
            }
            sx={{ p: 0.5 }}
          >
            <IconX size={14} />
          </IconButton>
        </Box>
        <TextField
          autoFocus
          size="small"
          fullWidth
          variant="outlined"
          multiline
          rows={2}
          placeholder="Enter comment..."
          value={commentInput.feature?.properties?.comment || ''}
          onChange={(e) => {
            if (commentInput.feature) {
              const updatedFeature = {
                ...commentInput.feature,
                properties: {
                  ...commentInput.feature.properties,
                  comment: e.target.value,
                },
              };
              setCommentInput({
                ...commentInput,
                feature: updatedFeature,
              });
            }
          }}
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          {commentInput.isEdit && commentInput.feature && (
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<IconTrash size={14} />}
              onClick={() => {
                handleDeleteComment(commentInput.feature);
              }}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
            >
              Delete
            </Button>
          )}
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              handleCommentSubmit(
                commentInput.feature?.properties?.comment || '',
              )
            }
            disabled={!commentInput.feature?.properties?.comment?.trim()}
            sx={{ fontSize: '0.75rem', py: 0.5 }}
          >
            {commentInput.isEdit ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CommentInput;
