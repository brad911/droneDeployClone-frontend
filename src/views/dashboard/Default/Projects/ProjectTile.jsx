import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Box, Menu, MenuItem, Stack, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageIcon from '@mui/icons-material/PhotoLibrary';
import PersonIcon from '@mui/icons-material/Person';

const ProjectTile = ({ project }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Card
      elevation={3}
      sx={{
        position: 'relative',
        width: 250,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': { boxShadow: 6 }
      }}
    >
      {/* Status Bubble */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: '#eee',
          color: '#2D2F31',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <Tooltip title="Example Project">
          <ImageIcon fontSize="small" />
        </Tooltip>
      </Box>

      {/* Image */}
      <CardMedia component="img" height="140" image={project.image} alt={project.title} sx={{ objectFit: 'cover' }} />

      {/* Content */}
      <CardContent sx={{ paddingBottom: '8px !important' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>

        {/* Icons and counts */}
        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ImageIcon fontSize="small" />
            <Typography variant="caption">{project.images}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PersonIcon fontSize="small" />
            <Typography variant="caption">{project.users}</Typography>
          </Stack>
        </Stack>
      </CardContent>

      {/* 3-dot menu */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8
        }}
      >
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>View</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </Box>
    </Card>
  );
};

export default ProjectTile;
