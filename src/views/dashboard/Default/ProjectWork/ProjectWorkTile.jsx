import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router';

const ProjectWorkTile = ({ project }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const viewProject = () => {
    navigate('1');
  };
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
        '&:hover': { boxShadow: 6 },
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        height="140"
        image={project.image}
        alt={project.title}
        sx={{ objectFit: 'cover' }}
      />

      {/* Content */}
      <CardContent sx={{ paddingBottom: '8px !important' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
      </CardContent>

      {/* 3-dot menu */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
        }}
      >
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={viewProject}>View</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </Box>
    </Card>
  );
};

export default ProjectWorkTile;
