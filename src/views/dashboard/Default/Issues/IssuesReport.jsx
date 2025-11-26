import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  MenuItem,
} from '@mui/material';

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
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from '../../../../utils/axios.config';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';

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

export default function IssueReport() {
  const { id: projectId, name: projectName } = useSelector(
    (state) => state.project,
  );
  const user = useSelector((state) => state.auth.user);

  const [tab, setTab] = useState('map');
  const [showForm, setShowForm] = useState(false);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [selectedWorkDay, setSelectedWorkDay] = useState('');
  const [workdays, setWorkdays] = useState([]);

  const [filters, setFilters] = useState({
    category: '',
    type: '',
    priority: '',
    status: '',
    assignedTo: '',
    search: '',
    startDate: '',
    endDate: '',
  });

  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    {
      title: projectName,
      to: `/project/${projectId}/View`,
      icon: IconBuildingCog,
    },
    { title: 'Coordination Logs', icon: IconTagStarred },
  ];

  // ===============================
  // Fetch Issues
  // ===============================
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        limit: 1000,
        workDayId: selectedWorkDay?.id,
        projectId,
      };
      const res = await axiosInstance.get('/issue', {
        params: params,
      });

      const results = res.data.data?.results || [];
      console.log(results, '<===== issues');
      setIssues(results);
      setSelectedIssue(results[0] || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Fetch Work Days
  // ===============================
  const fetchWorkDays = async () => {
    try {
      const res = await axiosInstance.get('/work-day', {
        params: { limit: 1000, projectId },
      });

      const wds = res.data.data.results || [];
      setWorkdays(wds);
      setSelectedWorkDay(wds[0] || null);
    } catch (e) {
      console.error('Error fetching workdays:', e);
    }
  };

  // ===============================
  // Fetch Team Members
  // ===============================
  const fetchTeamMembers = async () => {
    try {
      const res = await axiosInstance.get('/project-members/query', {
        params: { projectId, limit: 1000 },
      });
      setTeamMembers(res.data.data.results || []);
    } catch (e) {
      console.error('Error fetching team members:', e);
    }
  };

  // ===============================
  // Fetch Comments for Selected Issue
  // ===============================
  const fetchComments = async () => {
    if (!selectedIssue?.id) return;
    setCommentsLoading(true);

    try {
      const res = await axiosInstance.get('/issueComment', {
        params: { issueId: selectedIssue.id, limit: 100 },
      });

      setComments(res.data.data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async (comment) => {
    if (!selectedIssue) return;

    try {
      const payload = {
        comment,
        createdBy: user.id,
        issueId: selectedIssue.id,
      };

      const res = await axiosInstance.post('/issueComment', payload);

      if (res.status === 201) {
        enqueueSnackbar('Successfully Added Comment', { variant: 'success' });
        fetchComments();
      }
    } catch (e) {
      console.error(e);
    }

    setComment('');
  };

  // Load team members ONCE
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Load workdays when projectId changes
  useEffect(() => {
    if (projectId) fetchWorkDays();
  }, [projectId]);

  // Load issues when projectId changes
  useEffect(() => {
    if (projectId) fetchIssues();
  }, [projectId, selectedWorkDay, filters, refresh]);

  // Load comments when selectedIssue changes
  useEffect(() => {
    fetchComments();
  }, [selectedIssue]);

  return (
    <MainCard>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1">Coordination Logs</Typography>

        <Button variant="contained" onClick={() => setShowForm(true)}>
          + New Log
        </Button>
      </Box>

      <Breadcrumbs links={pageLinks} card custom rightAlign={false} />

      {/* Workday Selector */}
      <Box sx={{ mb: 2, maxWidth: 300 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Select Work Day
        </Typography>

        <TextField
          select
          fullWidth
          size="small"
          value={selectedWorkDay?.id || ''}
          onChange={(e) => {
            const wd = workdays.find((w) => w.id === e.target.value);
            setSelectedWorkDay(wd);
          }}
        >
          {workdays.map((wd) => (
            <MenuItem key={wd.id} value={wd.id}>
              {wd.name || wd.date || 'Work Day'}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        {TABS.map((t) => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 2 }}>
          {tab === 'map' && (
            <MapViewTab
              issues={issues}
              setSelectedIssue={setSelectedIssue}
              selectedIssue={selectedIssue}
              selectedWorkDay={selectedWorkDay}
            />
          )}

          {tab === 'list' && (
            <ListViewTab
              setTab={setTab}
              ticketList={issues}
              setSelectedIssue={setSelectedIssue}
              filters={filters}
              setFilters={setFilters}
              teamMembers={teamMembers}
              setRefresh={setRefresh}
            />
          )}

          {tab === 'calendar' && (
            <CalendarViewTab
              setTab={setTab}
              calendarEvents={issues}
              setSelectedIssue={setSelectedIssue}
            />
          )}
        </Box>

        {tab === 'map' && selectedIssue && (
          <IssueDetailsPanel
            commentsLoading={commentsLoading}
            sampleIssue={selectedIssue}
            comments={comments}
            comment={comment}
            setComment={setComment}
            handleAddComment={handleAddComment}
            placeholderImages={placeholderImages}
          />
        )}
      </Box>

      <IssueForm
        teamMembers={teamMembers}
        projectId={projectId}
        selectedWorkDay={selectedWorkDay}
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={() => setShowForm(false)}
        setRefresh={setRefresh}
      />
    </MainCard>
  );
}
