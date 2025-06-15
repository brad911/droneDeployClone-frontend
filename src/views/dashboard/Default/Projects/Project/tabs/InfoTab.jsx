import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  OutlinedInput,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectWorkTile from '../../../ProjectWork/ProjectWorkTile';

const collaborators = [
  { name: 'User I', role: 'Project Manager' },
  { name: 'User II', role: 'Lead Engineer' },
  { name: 'User III', role: 'GIS Specialist' },
];

const projectData = [
  {
    title: 'Day I',
    description: 'Track changes over time',
    image: 'https://picsum.photos/200/300?1',
  },
  {
    title: 'Day II',
    description: 'High-res structural analysis',
    image: 'https://picsum.photos/200/300?2',
  },
  {
    title: 'Day III',
    description: 'Thermal imaging results',
    image: 'https://picsum.photos/200/300?3',
  },
];

export default function InfoTab() {
  const [emailInput, setEmailInput] = useState('');
  const [team, setTeam] = useState(['someone@example.com']);
  const theme = useTheme();

  const handleAddEmail = (e) => {
    if (e.key === 'Enter' && emailInput) {
      e.preventDefault();
      if (!team.includes(emailInput)) {
        setTeam([...team, emailInput]);
      }
      setEmailInput('');
    }
  };

  const handleDelete = (emailToDelete) => {
    setTeam(team.filter((email) => email !== emailToDelete));
  };

  return (
    <Box p={4}>
      {/* Project Header */}
      <Typography variant="h2" fontWeight={600} gutterBottom>
        Project I Overview
      </Typography>

      <Stack direction="row" spacing={4} mb={4}>
        <Box flex={1}>
          <Typography variant="h5" gutterBottom>
            Project Details
          </Typography>
          <Stack spacing={1}>
            <Typography>Name: Project I</Typography>
            <Typography>Status: In Progress</Typography>
            <Typography>Remarks: Site is under survey</Typography>
          </Stack>
        </Box>

        <Box flex={1}>
          <Typography variant="h5" gutterBottom>
            Collaborators
          </Typography>
          <List dense>
            {collaborators.map((person, idx) => (
              <ListItem key={idx}>
                <ListItemAvatar>
                  <Avatar>{person.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={person.name} secondary={person.role} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Stack>

      {/* Invite Section */}
      <Box mb={5}>
        <Typography variant="h6" gutterBottom>
          Invite More People
        </Typography>
        <FormControl sx={{ ...theme.typography.customInput, width: 300 }}>
          <InputLabel htmlFor="teamInvite">Email</InputLabel>
          <OutlinedInput
            id="teamInvite"
            label="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleAddEmail}
            sx={{ mb: 2 }}
          />
        </FormControl>
        <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
          {team.map((email, index) => (
            <Chip
              key={index}
              label={email}
              onDelete={() => handleDelete(email)}
              color="primary"
            />
          ))}
        </Stack>
        <Button variant="contained" color="secondary">
          Send Invite
        </Button>
      </Box>

      {/* Project Work Days Grid */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Work Days</Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
          Create New Entry
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projectData.map((project, index) => (
          <ProjectWorkTile project={project} />
        ))}
      </Grid>
    </Box>
  );
}
