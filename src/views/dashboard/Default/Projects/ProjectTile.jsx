import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/PhotoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setSelectedProject } from '../../../../store/slices/projectSlice';
import image from '../../../../assets/images/conture-map.jpg';
import { useState } from 'react';

const ProjectTile = ({ project, count, onDelete, onDuplicate, onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // --- Menu handlers ---
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    e?.stopPropagation?.();
    setAnchorEl(null);
  };

  // --- Action handlers ---
  const handleDelete = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    onDelete?.(project);
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    onDuplicate?.(project);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    onEdit?.(project);
  };

  const handleView = (e) => {
    e?.stopPropagation?.();
    setAnchorEl(null);
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
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
      onClick={handleView}
    >
      {/* Image section */}
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
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="white"
            noWrap
            sx={{
              textShadow: '0px 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {project?.name}
          </Typography>
        </Box>
      </Box>

      {/* Project info + menu */}
      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Left side */}
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="nowrap"
          >
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <ImageIcon fontSize="small" />
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 140,
                }}
              >
                {project?.location}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonIcon fontSize="small" />
              <Typography variant="caption">{count}</Typography>
            </Stack>

            <Typography variant="caption" fontSize={10} color="text.secondary">
              {project?.createdAt
                ? new Date(project.createdAt)
                    .toLocaleDateString('en-GB') // dd/mm/yyyy
                    .replace(/\//g, '-') // convert to dd-mm-yyyy
                : 'Date unknown'}
            </Typography>
          </Stack>

          {/* Right side: 3-dot menu */}
          <Box>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                color: 'text.secondary',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
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
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleView(e);
                }}
              >
                View
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(e);
                }}
              >
                Edit
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate(e);
                }}
              >
                Duplicate
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(e);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProjectTile;
