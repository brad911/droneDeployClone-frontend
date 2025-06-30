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
  Switch,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import {
  IconFile,
  IconFileSpreadsheet,
  IconFileText,
  IconFileTypePdf,
  IconFileWord,
} from '@tabler/icons-react';
import { useSnackbar } from 'notistack';

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
  const [showPdf, setShowPdf] = useState(false);
  const [showDoc, setShowDoc] = useState(false);
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

  // Filtering logic
  const filteredFiles = files.filter((file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (showPdf && showDoc) {
      return ext === 'pdf' || ext === 'doc' || ext === 'docx';
    } else if (showPdf) {
      return ext === 'pdf';
    } else if (showDoc) {
      return ext === 'doc' || ext === 'docx';
    }
    return true; // If both switches are off, show all
  });

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <FormGroup row sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={showPdf} onChange={() => setShowPdf((v) => !v)} />}
          label="Show PDF Files"
        />
        <FormControlLabel
          control={<Switch checked={showDoc} onChange={() => setShowDoc((v) => !v)} />}
          label="Show DOC/DOCX Files"
        />
      </FormGroup>
      <Typography variant="h4" mb={2}>
        Upload Files
      </Typography>

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
