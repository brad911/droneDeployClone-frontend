import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Tabs, Tab, Divider } from '@mui/material';

import MapViewTab from './tabs/MapViewTab';
import ListViewTab from './tabs/ListViewTab';
import CalendarViewTab from './tabs/CalenderViewTab';
import IssueDetailsPanel from './tabs/IssueDetailsPanel';
import IssueForm from './IssueForm';
import Breadcrumbs from '../../../../ui-component/extended/Breadcrumbs';
import {
  IconBuildingCog,
  IconDroneOff,
  IconTagStarred,
} from '@tabler/icons-react';

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

export default function IssueReport() {
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

  const calendarEvents = useMemo(() => {
    return ticketList.map((ticket) => ({
      title: `${ticket.issue} (${ticket.assignedTo})`,
      start: ticket.createdAt,
      end: new Date(ticket.createdAt.getTime() + 60 * 60 * 1000),
    }));
  }, []);
  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    { title: 'Project Name', to: '/project/1/View', icon: IconBuildingCog },
    { title: 'Coordination Logs', icon: IconTagStarred }, // No `to` makes it the current page
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h1" gutterBottom>
            Coordination Logs
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            + New Issue
          </Button>
        </Box>
      </Box>
      <Breadcrumbs
        sx={{ mt: 2 }}
        links={pageLinks}
        card={true}
        custom={true}
        rightAlign={false}
      />

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        {TABS.map((t) => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      {/* Main View */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 2 }}>
          {tab === 'map' && <MapViewTab />}
          {tab === 'list' && <ListViewTab ticketList={ticketList} />}
          {tab === 'calendar' && (
            <CalendarViewTab calendarEvents={calendarEvents} />
          )}
        </Box>

        {tab === 'map' && (
          <IssueDetailsPanel
            sampleIssue={sampleIssue}
            comments={comments}
            comment={comment}
            setComment={setComment}
            handleAddComment={handleAddComment}
            placeholderImages={placeholderImages}
          />
        )}
      </Box>

      {/* Modal Form */}
      <IssueForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={(data) => {
          console.log('Form submitted:', data);
          setShowForm(false);
        }}
      />
    </Box>
  );
}
