import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Pagination,
  Stack,
  InputLabel,
  useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import MainCard from 'ui-component/cards/MainCard';
import axiosInstance from 'utils/axios.config';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const statusOptions = [
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

const sortOptions = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'createdAt:asc', label: 'Oldest' },
  { value: 'name:asc', label: 'Name (A-Z)' },
  { value: 'name:desc', label: 'Name (Z-A)' },
];

const WorkDayList = () => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [workDays, setWorkDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [pendingSearch, setPendingSearch] = useState('');
  const projectId = useSelector((state) => state.project.selectedProjectId);
  const token = useSelector((state) => state.auth.token);
  const [statusLoading, setStatusLoading] = useState({});
  const fileInputRef = useRef(null);
  const [uploadContext, setUploadContext] = useState({
    type: '',
    workDay: null,
  });
  const [uploadProgress, setUploadProgress] = useState({}); // { [`${workDayId}_${type}`]: percent }
  const [uploading, setUploading] = useState({}); // { [`${workDayId}_${type}`]: boolean }

  useEffect(() => {
    if (!projectId) return;
    const fetchWorkDays = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit,
          sortBy,
        };
        if (pendingSearch) params.name = pendingSearch;
        const res = await axiosInstance.get('/work-day', {
          params,
          headers: { Authorization: token },
        });
        setWorkDays(res.data.data?.results || []);
        setTotal(res.data.data?.totalResults || 0);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        enqueueSnackbar(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch work days',
          {
            variant: 'error',
          },
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWorkDays();
  }, [projectId, token, page, limit, sortBy, pendingSearch, enqueueSnackbar]);

  const getDownloadUrl = (resultFile) => {
    if (!resultFile) return null;
    if (resultFile.url) return resultFile.url;
    if (resultFile.Location) return resultFile.Location;
    return null;
  };

  const handleDownload = async (workDay) => {
    const fileKey = workDay.rawFile;
    if (!fileKey) {
      enqueueSnackbar('No file found to download', { variant: 'warning' });
      return;
    }
    try {
      const res = await axiosInstance.get(
        `/work-day/get-download-url/${fileKey}`,
        {
          headers: { Authorization: token },
        },
      );

      const url = res.data?.data;
      if (url) {
        window.open(url, '_blank');
        enqueueSnackbar('Download started', { variant: 'success' });
      } else {
        enqueueSnackbar('No download link available.', { variant: 'warning' });
      }
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || 'Download failed',
        {
          variant: 'error',
        },
      );
    }
  };

  const handleStatusChange = async (workDay, newStatus) => {
    setStatusLoading((prev) => ({
      ...prev,
      [workDay._id || workDay.id]: true,
    }));
    try {
      await axiosInstance.patch(
        `/work-day/${workDay._id || workDay.id}`,
        { status: newStatus },
        { headers: { Authorization: token } },
      );
      setWorkDays((prev) =>
        prev.map((wd) =>
          (wd._id || wd.id) === (workDay._id || workDay.id)
            ? { ...wd, status: newStatus }
            : wd,
        ),
      );
      enqueueSnackbar('Status updated!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || 'Failed to update status',
        {
          variant: 'error',
        },
      );
    } finally {
      setStatusLoading((prev) => ({
        ...prev,
        [workDay._id || workDay.id]: false,
      }));
    }
  };

  const handleSearch = () => {
    setPage(1);
    setPendingSearch(search);
  };

  const handleFileInputClick = (workDay, type) => {
    setUploadContext({ workDay, type });
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !uploadContext.type || !uploadContext.workDay) return;

    const { type, workDay } = uploadContext;
    const extension = file.name.split('.').pop().toLowerCase();
    const key = `${workDay.id || workDay._id}_${type}`;

    if (
      (type === 'kml' && extension !== 'kml') ||
      (type === 'jpg' && extension !== 'jpg' && extension !== 'jpeg')
    ) {
      enqueueSnackbar(`Only .${type.toUpperCase()} files are allowed`, {
        variant: 'error',
      });
      return;
    }

    setUploading((prev) => ({ ...prev, [key]: true }));
    setUploadProgress((prev) => ({ ...prev, [key]: 0 }));

    try {
      // 60MB in bytes
      const MAX_SINGLE_UPLOAD = 20 * 1024 * 1024;
      // Step 1: Get upload URL(s)
      const res = await axiosInstance.post(
        '/work-day/upload-resultFile',
        {
          workDayId: workDay.id || workDay._id,
          type,
          filename: file.name,
          contentType: file.type,
          size: file.size,
        },
        {
          headers: { Authorization: token },
        },
      );
      const uploadResponse = res.data.data;

      if (
        type === 'kml' ||
        (type === 'jpg' && file.size <= MAX_SINGLE_UPLOAD)
      ) {
        // Single PUT upload
        await axiosInstance.put(uploadResponse.url, file, {
          headers: {
            'Content-Type': file.type,
          },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress((prev) => ({ ...prev, [key]: percent }));
          },
        });
        enqueueSnackbar(`${type.toUpperCase()} uploaded successfully`, {
          variant: 'success',
        });
      } else if (type === 'jpg' && file.size > MAX_SINGLE_UPLOAD) {
        // Multipart upload
        const { parts, uploadId, key: s3Key, partSize } = uploadResponse;
        const chunks = [];
        let start = 0;
        while (start < file.size) {
          const end = Math.min(start + partSize, file.size);
          chunks.push(file.slice(start, end));
          start = end;
        }
        const etags = [];
        for (let i = 0; i < parts.length; i++) {
          const partRes = await fetch(parts[i].url, {
            method: 'PUT',
            body: chunks[i],
          });
          const etag = partRes.headers.get('ETag')?.replace(/"/g, '');
          etags.push({ PartNumber: parts[i].partNumber, ETag: etag });
          const percent = Math.round(((i + 1) / parts.length) * 100);
          setUploadProgress((prev) => ({ ...prev, [key]: percent }));
        }
        // Complete upload
        await axiosInstance.post(
          '/work-day/complete-upload',
          {
            workDayId: workDay.id || workDay._id,
            type,
            key: s3Key,
            uploadId,
            parts: etags,
          },
          {
            headers: { Authorization: token },
          },
        );
        enqueueSnackbar('JPG uploaded successfully (multipart)', {
          variant: 'success',
        });
      }
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || err.message || 'Upload failed',
        {
          variant: 'error',
        },
      );
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [key]: 0 }));
      }, 2000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadContext({ type: '', workDay: null });
    }
  };

  return (
    <MainCard>
      <Box>
        <Typography variant="h2" mb={2} gutterBottom>
          Historical Work Days
        </Typography>
      </Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        mb={2}
        alignItems="center"
      >
        <TextField
          label="Search by Project"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{ minWidth: 100 }}
        >
          Search
        </Button>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <Typography variant="body1">Loading work days...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Paper sx={{ p: 3, mx: 'auto', mt: 3 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Time Stamp
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Historical Date
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Project Name
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Project Location
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Owner
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      OrthoImage
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      KML File
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workDays.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No work days found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    workDays.map((workDay) => {
                      const file = workDay.resultFiles?.[0];
                      const hasDownload = !!getDownloadUrl(file);
                      const id = workDay._id || workDay.id;
                      const project = workDay.projectId || {};
                      const owner = project.owner || {};

                      return (
                        <TableRow key={id}>
                          <TableCell>
                            {workDay.createdAt
                              ? new Date(workDay.createdAt).toLocaleDateString()
                              : workDay.name}
                          </TableCell>
                          <TableCell>{workDay.name || '-'}</TableCell>
                          <TableCell>{project.name || '-'}</TableCell>
                          <TableCell>{project.location || '-'}</TableCell>
                          <TableCell>
                            {owner.firstName || owner.lastName
                              ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim()
                              : owner.email || '-'}
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={workDay.status || ''}
                                onChange={(e) =>
                                  handleStatusChange(workDay, e.target.value)
                                }
                                disabled={statusLoading[id]}
                              >
                                {statusOptions.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            {workDay.orthoImage
                              ? workDay.orthoImage.split('-')[5]
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {' '}
                            {workDay.kmlFile
                              ? workDay.kmlFile.split('-')[5]
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload(workDay)}
                                disabled={!hasDownload && !workDay.rawFile}
                                sx={{ mr: 1, mb: 1, minWidth: 20 }}
                              >
                                Download
                              </Button>
                              <Box
                                sx={{ display: 'inline-block', mr: 1, mb: 1 }}
                              >
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  startIcon={<UploadIcon />}
                                  sx={{
                                    mr: 0,
                                    minWidth: 110,
                                    justifyContent: 'left',
                                  }}
                                  onClick={() =>
                                    handleFileInputClick(workDay, 'kml')
                                  }
                                  disabled={uploading[`${id}_kml`]}
                                >
                                  KML
                                </Button>
                                {uploading[`${id}_kml`] && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption">
                                      Uploading...{' '}
                                      {uploadProgress[`${id}_kml`] || 0}%
                                    </Typography>
                                    <Box sx={{ width: 80 }}>
                                      <Stack spacing={1}>
                                        <Box sx={{ width: '100%' }}>
                                          <Box
                                            sx={{
                                              height: 4,
                                              bgcolor: '#eee',
                                              borderRadius: 2,
                                              overflow: 'hidden',
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                width: `${uploadProgress[`${id}_kml`] || 0}%`,
                                                height: '100%',
                                                bgcolor: 'primary.main',
                                                transition: 'width 0.2s',
                                              }}
                                            />
                                          </Box>
                                        </Box>
                                      </Stack>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                              <Box sx={{ display: 'inline-block' }}>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  startIcon={<UploadIcon />}
                                  onClick={() =>
                                    handleFileInputClick(workDay, 'jpg')
                                  }
                                  sx={{ minWidth: 110, justifyContent: 'left' }}
                                  disabled={uploading[`${id}_jpg`]}
                                >
                                  JPG
                                </Button>
                                {uploading[`${id}_jpg`] && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption">
                                      Uploading...{' '}
                                      {uploadProgress[`${id}_jpg`] || 0}%
                                    </Typography>
                                    <Box sx={{ width: 80 }}>
                                      <Stack spacing={1}>
                                        <Box sx={{ width: '100%' }}>
                                          <Box
                                            sx={{
                                              height: 4,
                                              bgcolor: '#eee',
                                              borderRadius: 2,
                                              overflow: 'hidden',
                                            }}
                                          >
                                            <Box
                                              sx={{
                                                width: `${uploadProgress[`${id}_jpg`] || 0}%`,
                                                height: '100%',
                                                bgcolor: 'secondary.main',
                                                transition: 'width 0.2s',
                                              }}
                                            />
                                          </Box>
                                        </Box>
                                      </Stack>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Paper>
        </>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </MainCard>
  );
};

export default WorkDayList;
