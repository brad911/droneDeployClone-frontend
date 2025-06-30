import React, { useState } from 'react';
import { Button, Tabs, Tab, Box, Typography, Paper, Divider, TextField, Avatar, List, ListItem, ListItemAvatar, ListItemText, ImageList, ImageListItem } from '@mui/material';
// Import your existing UI components as needed
// import MainCard from 'src/ui-component/cards/MainCard';
// import ...

const TABS = [
  { label: 'Map View', value: 'map' },
  { label: 'List View', value: 'list' },
  { label: 'Calendar View', value: 'calendar' }
];

// Sample placeholder images and comments
const placeholderImages = [
  '/src/assets/images/landing_page_industry_capture/1.jpg',
  '/src/assets/images/landing_page_industry_capture/2.jpg',
  '/src/assets/images/landing_page_industry_capture/3.jpg',
];

const sampleComments = [
  { user: 'John Smith', avatar: '/src/assets/images/users/user-round.svg', text: 'Inspected the issue. Will need additional materials to fix.', date: 'Jun 12, 10:30 AM' },
  { user: 'Sarah Johnson', avatar: '/src/assets/images/users/user-round.svg', text: 'Materials ordered. Should arrive by tomorrow.', date: 'Jun 12, 2:15 PM' },
];

function IssueReport() {
  const [tab, setTab] = useState('map');
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(sampleComments);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          user: 'You',
          avatar: '/src/assets/images/users/user-round.svg',
          text: comment,
          date: new Date().toLocaleString(),
        },
      ]);
      setComment('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4">Downtown Highrise - Issue Tagging</Typography>
          <Typography variant="subtitle1">Identify and track issues across your construction site</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined">Filter</Button>
          <Button variant="contained" onClick={() => setShowForm(true)}>+ New Issue</Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        {TABS.map(t => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left: View Panel */}
        <Paper sx={{ flex: 2, minHeight: 400, p: 2 }}>
          {tab === 'map' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Map Placeholder */}
              <Box sx={{ flex: 1, minHeight: 250, bgcolor: '#e0e0e0', borderRadius: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6">Map View (Mapbox Placeholder)</Typography>
              </Box>
              {/* Images */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Photos</Typography>
              <ImageList cols={3} rowHeight={100} sx={{ mb: 2 }}>
                {placeholderImages.map((img, idx) => (
                  <ImageListItem key={idx}>
                    <img src={img} alt={`placeholder-${idx}`} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  </ImageListItem>
                ))}
              </ImageList>
              {/* Comments */}
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Comments</Typography>
              <List sx={{ maxHeight: 150, overflow: 'auto', mb: 1 }}>
                {comments.map((c, idx) => (
                  <ListItem alignItems="flex-start" key={idx}>
                    <ListItemAvatar>
                      <Avatar src={c.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={c.user}
                      secondary={<>
                        <Typography component="span" variant="body2" color="text.primary">{c.text}</Typography>
                        <br />
                        <Typography component="span" variant="caption" color="text.secondary">{c.date}</Typography>
                      </>}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
                />
                <Button variant="contained" onClick={handleAddComment}>Post</Button>
              </Box>
            </Box>
          )}
          {tab === 'list' && <Typography>List View Placeholder</Typography>}
          {tab === 'calendar' && <Typography>Calendar View Placeholder (React Big Calendar)</Typography>}
        </Paper>
        {/* Right: Issue Details Panel */}
        <Paper sx={{ flex: 1, minWidth: 320, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6">Issue Details</Typography>
          <Divider />
          <Typography variant="subtitle2">Information about the selected issue</Typography>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mt: 2 }}>Details Placeholder</Typography>
          </Box>
          <Divider />
          <Typography variant="subtitle2">Comments</Typography>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mt: 1 }}>Comments Placeholder</Typography>
          </Box>
        </Paper>
      </Box>

      {/* Issue Creation Form Modal Placeholder */}
      {showForm && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.3)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 3, minWidth: 400 }}>
            <Typography variant="h6">New Issue Form</Typography>
            <Typography sx={{ mt: 2 }}>Form Placeholder</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="contained" sx={{ ml: 1 }}>Save Issue</Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default IssueReport; 
