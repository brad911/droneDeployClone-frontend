import React, { useState, useMemo } from 'react';
import {
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ImageList,
  ImageListItem,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import enUS from 'date-fns/locale/en-US';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const TABS = [
  { label: 'Map View', value: 'map' },
  { label: 'List View', value: 'list' },
  { label: 'Calendar View', value: 'calendar' },
];

const placeholderImages = [
  '/src/assets/images/landing_page_industry_capture/1.jpg',
  '/src/assets/images/landing_page_industry_capture/2.jpg',
  '/src/assets/images/landing_page_industry_capture/3.jpg',
];

const sampleComments = [
  {
    user: 'John Smith',
    avatar: '/src/assets/images/users/user-round.svg',
    text: 'Inspected the issue.',
    date: 'Jun 12, 10:30 AM',
  },
  {
    user: 'Sarah Johnson',
    avatar: '/src/assets/images/users/user-round.svg',
    text: 'Materials ordered.',
    date: 'Jun 12, 2:15 PM',
  },
];

const sampleIssue = {
  title: 'Structural alignment issue',
  description: 'Column alignment shows 2.5cm deviation.',
  priority: 'High',
  category: 'Structural',
  assignee: 'John Smith',
  createdAt: new Date('2023-06-12T10:00:00'),
  status: 'Open',
};

const ticketList = [
  {
    id: 1,
    issue: 'Alignment issue',
    type: 'Structural',
    assignedTo: 'John Smith',
    priority: 'High',
    createdAt: new Date(2023, 5, 12, 10, 0),
  },
  {
    id: 2,
    issue: 'Wiring incomplete',
    type: 'Electrical',
    assignedTo: 'Sarah Johnson',
    priority: 'Medium',
    createdAt: new Date(2023, 5, 13, 15, 0),
  },
];

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

  const calendarEvents = useMemo(() => {
    return ticketList.map((ticket) => ({
      title: `${ticket.issue} (${ticket.assignedTo})`,
      start: ticket.createdAt,
      end: new Date(ticket.createdAt.getTime() + 60 * 60 * 1000),
    }));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4">
            Downtown Highrise - Issue Tagging
          </Typography>
          <Typography variant="subtitle1">
            Identify and track issues across your construction site
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined">Filter</Button>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            + New Issue
          </Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        {TABS.map((t) => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Paper
          sx={{
            flex: 2,
            minHeight: 400,
            p: 2,
            width: tab === 'map' ? undefined : '100%',
          }}
        >
          {tab === 'map' && (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <Box
                sx={{
                  flex: 1,
                  minHeight: 250,
                  bgcolor: '#e0e0e0',
                  borderRadius: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6">
                  Map View (Mapbox Placeholder)
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Photos
              </Typography>
              <ImageList cols={3} rowHeight={100} sx={{ mb: 2 }}>
                {placeholderImages.map((img, idx) => (
                  <ImageListItem key={idx}>
                    <img
                      src={img}
                      alt={`placeholder-${idx}`}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Comments
              </Typography>
              <List sx={{ maxHeight: 150, overflow: 'auto', mb: 1 }}>
                {comments.map((c, idx) => (
                  <ListItem alignItems="flex-start" key={idx}>
                    <ListItemAvatar>
                      <Avatar src={c.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={c.user}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {c.text}
                          </Typography>
                          <br />
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {c.date}
                          </Typography>
                        </>
                      }
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
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                />
                <Button variant="contained" onClick={handleAddComment}>
                  Post
                </Button>
              </Box>
            </Box>
          )}

          {tab === 'list' && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Issue</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticketList.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.issue}</TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>{ticket.assignedTo}</TableCell>
                    <TableCell>{ticket.priority}</TableCell>
                    <TableCell>{ticket.createdAt.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {tab === 'calendar' && (
            <Box sx={{ height: 500 }}>
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
              />
            </Box>
          )}
        </Paper>

        {tab === 'map' && (
          <Paper
            sx={{
              flex: 1,
              minWidth: 320,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6">Issue Details</Typography>
            <Divider />
            <Typography variant="subtitle2">
              Information about the selected issue
            </Typography>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {sampleIssue.title}
              </Typography>
              <Typography sx={{ mb: 1 }}>{sampleIssue.description}</Typography>
              <Typography>
                <b>Priority:</b>{' '}
                <span
                  style={{
                    color:
                      sampleIssue.priority === 'High'
                        ? 'red'
                        : sampleIssue.priority === 'Medium'
                          ? 'orange'
                          : 'green',
                  }}
                >
                  {sampleIssue.priority}
                </span>
              </Typography>
              <Typography>
                <b>Category:</b> {sampleIssue.category}
              </Typography>
              <Typography>
                <b>Assignee:</b> {sampleIssue.assignee}
              </Typography>
              <Typography>
                <b>Created:</b> {sampleIssue.createdAt.toLocaleDateString()}
              </Typography>
              <Typography>
                <b>Status:</b> {sampleIssue.status}
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>

      {showForm && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.3)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper sx={{ p: 3, minWidth: 400, maxWidth: 500 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              New Issue
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Issue Title"
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) =>
                  handleFormChange('description', e.target.value)
                }
                fullWidth
                size="small"
                multiline
                minRows={2}
              />
              <TextField
                select
                label="Priority"
                value={form.priority}
                onChange={(e) => handleFormChange('priority', e.target.value)}
                fullWidth
                size="small"
              >
                {priorities.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Category"
                value={form.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                fullWidth
                size="small"
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Assign To"
                value={form.assignee}
                onChange={(e) => handleFormChange('assignee', e.target.value)}
                fullWidth
                size="small"
              >
                {teamMembers.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="outlined" component="label">
                Attach Photos
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handlePhotoUpload}
                />
              </Button>
              {form.photos.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.photos.map((file, idx) => (
                    <Typography key={idx} variant="caption">
                      {file.name}
                    </Typography>
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
