import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { IconCloudUpload } from '@tabler/icons-react';
import axiosInstance from '../../../../utils/axios.config';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const CreateWorkDayModal = ({ open = false, onClose, onSave }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    file: null,
  });
  const { enqueueSnackbar } = useSnackbar();
  const userToken = useSelector((state) => state.auth.token);
  const projectId = useSelector((state) => state.project.selectedProjectId);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setUploading(false);
      setProgress(0);
      setForm({ date: new Date().toISOString().split('T')[0], file: null });
    }
  }, [open]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      handleFormChange('file', acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/zip': ['.zip'],
    },
  });

  const handleSubmit = async () => {
    if (!form.file) {
      enqueueSnackbar('Please select a file to upload.', {
        variant: 'warning',
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const res = await axiosInstance.post(
        '/work-day/get-url',
        {
          projectId: projectId,
          name: form.date,
          filename: form.file.name,
          contentType: form.file.type,
          size: form.file.size,
        },
        {
          headers: {
            Authorization: userToken,
          },
        },
      );
      const uploadResponse = res.data.data;
      console.log(uploadResponse);
      if (uploadResponse.uploadType === 'single') {
        await axiosInstance.put(uploadResponse.url, form.file, {
          headers: {
            'Content-Type': form.file.type,
          },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          },
        });
      } else if (uploadResponse.uploadType === 'multipart') {
        const { parts, uploadId, key, partSize } = uploadResponse;
        const chunks = [];
        let start = 0;
        while (start < form.file.size) {
          const end = Math.min(start + partSize, form.file.size);
          chunks.push(form.file.slice(start, end));
          start = end;
        }
        const etags = [];
        for (let i = 0; i < parts.length; i++) {
          const res = await fetch(parts[i].url, {
            method: 'PUT',
            body: chunks[i],
          });
          const etag = res.headers.get('ETag')?.replace(/"/g, '');
          etags.push({ PartNumber: parts[i].partNumber, ETag: etag });
          const percent = Math.round(((i + 1) / parts.length) * 100);
          setProgress(percent);
        }
        await axiosInstance.post(
          '/work-day/complete-upload',
          {
            projectId: projectId,
            name: form.date,
            key,
            uploadId,
            parts: etags,
          },
          {
            headers: {
              Authorization: userToken,
            },
          },
        );
      }
      enqueueSnackbar('Upload successful!', { variant: 'success' });
      if (uploadResponse.uploadType === 'single') {
        enqueueSnackbar('SuccessFully Created Historical Data', {
          variant: 'success',
        });
      }
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        error?.response?.data?.message || error.message || 'Upload failed.',
        { variant: 'error' },
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          outline: 'none',
          width: 400,
          maxWidth: '90vw',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          mx: 'auto',
          mt: '10vh',
          p: 3,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Create New Historical Data
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => handleFormChange('date', e.target.value)}
            fullWidth
            size="small"
            disabled={uploading}
            InputLabelProps={{ shrink: true }}
          />
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: 4,
              textAlign: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
              mb: 2,
              opacity: uploading ? 0.5 : 1,
              pointerEvents: uploading ? 'none' : 'auto',
            }}
          >
            <input {...getInputProps()} />
            <IconCloudUpload size={32} />
            <Typography variant="h6" gutterBottom>
              Upload Zip File
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Drag & drop your .zip file or click below to browse
            </Typography>
            <Button variant="outlined" disabled={uploading}>
              Browse Files
            </Button>
            {file && (
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Box>
          {uploading && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Uploading... {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!form.file || uploading}
              startIcon={uploading && <CircularProgress size={16} />}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateWorkDayModal;
