import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGlyYWtyYWoiLCJhIjoiY21icXd5eHRnMDNtaTJxczcxd2RmbTZwOCJ9.P6kpsuLMDdeK2DIMJZMrmw';

export default function ViewTab() {
  const mapContainer = useRef(null);
  const theme = useTheme();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { user: 'User I', text: 'Initial survey completed.', time: 'Just now' },
    { user: 'User II', text: 'Awaiting GIS data upload.', time: '2 hours ago' },
  ]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [72.5714, 23.0225],
      zoom: 10,
    });

    return () => map.remove();
  }, []);

  const handlePost = () => {
    if (!comment.trim()) return;
    const newComment = {
      user: 'You',
      text: comment.trim(),
      time: 'Just now',
    };
    setComments([newComment, ...comments]);
    setComment('');
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h4" mb={2}>
        Project Map View
      </Typography>

      <Box
        ref={mapContainer}
        sx={{ height: '60vh', borderRadius: 2, overflow: 'hidden', mb: 4 }}
      />

      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>

      <Stack
        direction="row"
        justifyContent={'center'}
        spacing={2}
        alignItems="center"
        mb={2}
      >
        <TextField
          fullWidth
          multiline
          minRows={1}
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
          }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePost}
          sx={{ height: 'fit-content', mt: 1 }}
        >
          Post
        </Button>
      </Stack>

      <Stack spacing={2}>
        {comments.map((c, i) => (
          <Card key={i} elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Avatar>{c.user.charAt(0)}</Avatar>
                <Stack>
                  <Typography fontWeight={600}>{c.user}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.time}
                  </Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography color="text.primary">{c.text}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
