import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/PhotoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import { setSelectedProject } from '../../../../store/slices/projectSlice';
import image from '../../../../assets/images/conture-map.jpg';
import { useState } from 'react';

const ProjectTile = ({ project, count, onDelete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    if (onDelete) onDelete(project);
  };

  const handleView = () => {
    const id = project._id || project.id;
    dispatch(setSelectedProject({ id, name: project.name }));
    navigate(`/project/${id}/View`);
  };

  return (
    <Card
      elevation={4}
      sx={{
        maxHeight: 220,
        position: 'relative',
        width: 320,
        maxWidth: 320,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
      onClick={handleView}
    >
      {/* Image + overlay */}
      <Box sx={{ position: 'relative', height: 140 }}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={project?.name}
          sx={{ objectFit: 'cover', filter: 'brightness(60%)' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} color="white" noWrap>
            {project?.name}
          </Typography>
        </Box>

        {/* 3-dot menu */}
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.4)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleDelete}>Delete Project</MenuItem>
        </Menu>
      </Box>

      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ImageIcon fontSize="small" />
              <Typography variant="caption">{project?.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonIcon fontSize="small" />
              <Typography variant="caption">{count}</Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" fontSize={8} color="text.secondary">
                {project?.createdAt
                  ? `${formatDistanceToNow(new Date(project?.createdAt), {
                      addSuffix: true,
                    })}`
                  : 'Time unknown'}
              </Typography>
            </Stack>
          </Stack>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
          >
            View
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectTile;
