// import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/PhotoLibrary';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import { setSelectedProject } from '../../../../store/slices/projectSlice';
import image from '../../../../assets/images/conture-map.jpg';
const ProjectTile = ({ project, count }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      {/* Image with overlay */}
      <Box sx={{ position: 'relative', height: 140 }}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={project?.name}
          sx={{
            objectFit: 'cover',
            filter: 'brightness(60%)',
          }}
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
      </Box>

      {/* Progress Bar */}
      {/* <Box px={2} py={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Typography variant="caption" color="text.secondary">
            {project.progress}%
          </Typography>
          <Typography variant="caption" color="text.secondary"></Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={project.progress}
          sx={{ height: 6, borderRadius: 10 }}
        />
      </Box> */}

      {/* Footer with Icons and View Button */}
      <CardContent sx={{ pt: 1, pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ImageIcon fontSize="small" />
              <Typography variant="caption">{project.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PersonIcon fontSize="small" />
              <Typography variant="caption">{count}</Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" fontSize={8} color="text.secondary">
                {project.createdAt
                  ? `${formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}`
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
