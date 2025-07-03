import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Paper,
  Stack,
  useTheme,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  IconBuildingCog,
  IconDroneOff,
  IconFile,
  IconFiles,
  IconFileSpreadsheet,
  IconFileText,
  IconFileTypePdf,
  IconFileWord,
} from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import Breadcrumbs from '../../../../../../ui-component/extended/Breadcrumbs';

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return <IconFileTypePdf size={32} color="red" />;
    case 'doc':
    case 'docx':
      return <IconFileWord size={32} color="blue" />;
    case 'xls':
    case 'xlsx':
      return <IconFileSpreadsheet size={32} color="green" />;
    case 'txt':
      return <IconFileText size={32} />;
    default:
      return <IconFile size={32} />;
  }
};

const getCurrentDateString = () =>
  new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export default function FilesTab() {
  const [files, setFiles] = useState([
    { name: 'report.pdf', uploadedAt: getCurrentDateString() },
    { name: 'site-notes.docx', uploadedAt: getCurrentDateString() },
    { name: 'data-sheet.xlsx', uploadedAt: getCurrentDateString() },
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setUploadProgress(0);
    const fakeUpload = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(fakeUpload);
          setFiles((prevFiles) => [
            ...prevFiles,
            {
              name: uploadedFile.name,
              uploadedAt: getCurrentDateString(),
            },
          ]);
        }
        return Math.min(prev + 10, 100);
      });
    }, 200);
  };

  const handleFileClick = (file) => {
    enqueueSnackbar(`Downloading "${file.name}"...`, { variant: 'info' });
    setTimeout(() => {
      enqueueSnackbar(`"${file.name}" downloaded`, { variant: 'success' });
    }, 1500);
  };

  // Filtering & Sorting
  const filteredFiles = files
    .filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      if (sortBy === 'za') return b.name.localeCompare(a.name);
      return 0; // 'latest' keeps default (most recent at end)
    });
  const pageLinks = [
    { title: 'Projects', to: '/project', icon: IconDroneOff },
    { title: 'Project Name', to: '/project/1/View', icon: IconBuildingCog },
    { title: 'Othomosaic Viewer', icon: IconFiles }, // No `to` makes it the current page
  ];

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Upload Files
      </Typography>
      <Breadcrumbs
        sx={{ mt: 3 }}
        links={pageLinks}
        card={true}
        custom={true}
        rightAlign={false}
      />
      <Divider sx={{ my: 1.5 }} />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <TextField
          label="Search files..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />

        <TextField
          select
          label="Sort By"
          variant="outlined"
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="latest">Latest</MenuItem>
          <MenuItem value="extension">Extension</MenuItem>
          <MenuItem value="az">A–Z</MenuItem>
          <MenuItem value="za">Z–A</MenuItem>
        </TextField>
      </Stack>

      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Choose File
        <input type="file" hidden onChange={handleUpload} />
      </Button>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{ mb: 3, borderRadius: 2 }}
        />
      )}

      <Typography variant="h5" gutterBottom>
        Uploaded Files
      </Typography>

      <Grid container spacing={2}>
        {filteredFiles.map((file, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper
              elevation={3}
              onClick={() => handleFileClick(file)}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                {getFileIcon(file.name)}
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Uploaded on: {file.uploadedAt}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
