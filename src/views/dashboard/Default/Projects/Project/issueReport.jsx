import React, { useState } from 'react';
import { Button, Tabs, Tab, Box, Typography, Paper, Divider, TextField, Avatar, List, ListItem, ListItemAvatar, ListItemText, ImageList, ImageListItem, MenuItem } from '@mui/material';
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

const sampleIssue = {
  title: 'Structural alignment issue',
  description: 'Column alignment shows 2.5cm deviation from specifications. Requires immediate attention before proceeding with next phase.',
  priority: 'High',
  category: 'Structural',
  assignee: 'John Smith',
  createdAt: '2023-06-12',
  status: 'Open',
};
const teamMembers = ['John Smith', 'Sarah Johnson', 'Alex Lee', 'Priya Patel'];
const categories = ['Architecture', 'Structure', 'MEPF', 'Safety', 'Quality'];
const priorities = ['Low', 'Medium', 'High'];

function IssueReport() {
  const [tab, setTab] = useState('map');
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(sampleComments);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '',
    category: '',
    assignee: '',
    photos: [],
  });

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

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    setForm((prev) => ({ ...prev, photos: Array.from(e.target.files) }));
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
        <Paper sx={{ flex: 2, minHeight: 400, p: 2, width: tab === 'map' ? undefined : '100%' }}>
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
        {/* Right: Issue Details Panel - Only show in Map View */}
        {tab === 'map' && (
          <Paper sx={{ flex: 1, minWidth: 320, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Issue Details</Typography>
            <Divider />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Information about the selected issue</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{sampleIssue.title}</Typography>
              <Typography sx={{ mb: 1 }}>{sampleIssue.description}</Typography>
              <Typography><b>Priority:</b> <span style={{ color: sampleIssue.priority === 'High' ? 'red' : sampleIssue.priority === 'Medium' ? 'orange' : 'green' }}>{sampleIssue.priority}</span></Typography>
              <Typography><b>Category:</b> {sampleIssue.category}</Typography>
              <Typography><b>Assignee:</b> {sampleIssue.assignee}</Typography>
              <Typography><b>Created:</b> {sampleIssue.createdAt}</Typography>
              <Typography><b>Status:</b> {sampleIssue.status}</Typography>
            </Box>
            <Divider />
            <Typography variant="subtitle2">Comments</Typography>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ mt: 1 }}>Comments Placeholder</Typography>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Issue Creation Form Modal */}
      {showForm && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.3)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Paper sx={{ p: 3, minWidth: 400, maxWidth: 500 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>New Issue</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Issue Title" value={form.title} onChange={e => handleFormChange('title', e.target.value)} fullWidth size="small" />
              <TextField label="Description" value={form.description} onChange={e => handleFormChange('description', e.target.value)} fullWidth size="small" multiline minRows={2} />
              <TextField select label="Priority" value={form.priority} onChange={e => handleFormChange('priority', e.target.value)} fullWidth size="small">
                {priorities.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField select label="Category" value={form.category} onChange={e => handleFormChange('category', e.target.value)} fullWidth size="small">
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
              <TextField select label="Assign To" value={form.assignee} onChange={e => handleFormChange('assignee', e.target.value)} fullWidth size="small">
                {teamMembers.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
              <Button variant="outlined" component="label">
                Attach Photos
                <input type="file" hidden multiple onChange={handlePhotoUpload} />
              </Button>
              {form.photos.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.photos.map((file, idx) => (
                    <Typography key={idx} variant="caption">{file.name}</Typography>
                  ))}
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                <Button variant="contained">Save Issue</Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default IssueReport;
