import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
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
import { IconPhotoEdit } from '@tabler/icons-react';
import GenerateTilesConfirmationBox from './GenerateTilesConfirmationDialogBox';

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
  const dxfFileInputRef = useRef(null);
  const cadFileInputRef = useRef(null);
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
  const token = useSelector((state) => state.auth.token);
  const [statusLoading, setStatusLoading] = useState({});
  const fileInputRef = useRef(null);
  const [uploadContext, setUploadContext] = useState({
    type: '',
    workDay: null,
  });
  const [uploadProgress, setUploadProgress] = useState({}); // { [`${workDayId}_${type}`]: percent }
  const [uploading, setUploading] = useState({}); // { [`${workDayId}_${type}`]: boolean }
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    workDayId: null,
  });
  const [generateTilesLoading, setGenerateTilesLoading] = useState(false);

  useEffect(() => {
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
        // console.log(res, '<=== wo wow ow');
        setWorkDays(res.data.data?.results || []);
        setTotal(res.data.data?.totalResults || 0);
      } catch (err) {
        console.log(err, '<===== error fetching workdays');
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
  }, [token, page, limit, sortBy, pendingSearch, enqueueSnackbar]);

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
      (type === 'tiff' && extension !== 'tiff') ||
      (type === 'zip' && extension !== 'zip')
    ) {
      enqueueSnackbar(`Only .${type.toUpperCase()} files are allowed`, {
        variant: 'error',
      });
      return;
    }

    setUploading((prev) => ({ ...prev, [key]: true }));
    setUploadProgress((prev) => ({ ...prev, [key]: 0 }));

    try {
      // Step 1: Request multipart upload info
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
      console.log(uploadResponse, '<=== upload response');

      // Always multipart upload (regardless of size)
      const { parts, uploadId, key: s3Key, partSize } = uploadResponse;

      // Split file into chunks
      const chunks = [];
      let start = 0;
      while (start < file.size) {
        const end = Math.min(start + partSize, file.size);
        chunks.push(file.slice(start, end));
        start = end;
      }

      // Upload each part
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

      enqueueSnackbar(
        `${type.toUpperCase()} uploaded successfully (multipart)`,
        {
          variant: 'success',
        },
      );
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

  const handleGenerateTilesClick = (workDayId) => {
    // Find the workDay object to check for required files
    const workDay = workDays.find((wd) => (wd._id || wd.id) === workDayId);

    if (!workDay) {
      enqueueSnackbar('Work day not found', { variant: 'error' });
      return;
    }

    // // Check if Tiff file exists
    const hasTiffFile = workDay.tiffFile && workDay.tiffFile.trim() !== '';

    if (!hasTiffFile) {
      enqueueSnackbar(`Please upload .tiff first before generating tiles.`, {
        variant: 'warning',
      });
      return;
    }

    setConfirmDialog({
      open: true,
      workDayId,
    });
  };

  const handleConfirmGenerateTiles = async (maxzoom) => {
    const { workDayId } = confirmDialog;
    setGenerateTilesLoading(true);

    try {
      const res = await axiosInstance.get(
        `/work-day/generate-tiles/${workDayId}`,
        {
          headers: { Authorization: token },
          params: { maxzoom },
        },
      );

      if (res.data?.success) {
        enqueueSnackbar(
          'Tile generation started successfully! This process will take at least 10 minutes to complete.',
          {
            variant: 'success',
          },
        );
        setConfirmDialog({ open: false, workDayId: null });
      } else {
        enqueueSnackbar('Failed to start tile generation', {
          variant: 'error',
        });
      }
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message ||
          err.message ||
          'Failed to generate tiles',
        {
          variant: 'error',
        },
      );
    } finally {
      setGenerateTilesLoading(false);
    }
  };

  const handleCancelGenerateTiles = () => {
    setConfirmDialog({ open: false, workDayId: null });
  };

  const handleDxfFileInputClick = (workDay) => {
    // reuse your existing uploadContext pattern
    setUploadContext({ workDay, type: 'dxf' });
    if (dxfFileInputRef.current) dxfFileInputRef.current.click();
  };

  const handleCadFileInputClick = (workDay) => {
    // reuse your existing uploadContext pattern
    setUploadContext({ workDay, type: 'zip' });
    if (cadFileInputRef.current) cadFileInputRef.current.click();
  };

  const handleDxfFileChange = async () => {
    const { workDay } = uploadContext;
    const file = dxfFileInputRef.current?.files?.[0];
    if (!file) {
      enqueueSnackbar('Please select a .dxf file', { variant: 'warning' });
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'dxf') {
      enqueueSnackbar('Only .dxf files are allowed', { variant: 'error' });
      return;
    }
    enqueueSnackbar('Uploading DXF file', { variant: 'info' });
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axiosInstance.post(
        `/mapFeature/overlayUpload/${workDay._id || workDay.id}`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      enqueueSnackbar('DXF uploaded successfully!', { variant: 'success' });
      if (dxfFileInputRef.current) dxfFileInputRef.current.value = '';
    } catch (err) {
      console.error('DXF upload failed', err);
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: 'error',
      });
    }
  };
  const handleCadFileChange = async () => {
    const { workDay } = uploadContext;
    const file = cadFileInputRef.current?.files?.[0];
    console.log(file, '<=== cad file');
    if (!file) {
      enqueueSnackbar('Please select a .zip for shapes overlay upload format', {
        variant: 'warning',
      });
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    console.log(ext, '<=== ext cad');
    if (ext !== 'zip') {
      enqueueSnackbar('Only .zip files are allowed', { variant: 'error' });
      return;
    }
    enqueueSnackbar('Uploading Zip file', { variant: 'info' });
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axiosInstance.post(
        `/mapFeature/shapeOverlayUpload/${workDay._id || workDay.id}`,
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      enqueueSnackbar('Shapes uploaded successfully!', {
        variant: 'success',
      });
      if (cadFileInputRef.current) cadFileInputRef.current.value = '';
    } catch (err) {
      console.error('CAD zip file upload failed', err);
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: 'error',
      });
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
                      Project
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
                      Tiff
                    </TableCell>
                    <TableCell
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      Progress Status
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
                              ? dayjs(workDay.createdAt).format('DD/MM/YYYY')
                              : workDay.name}
                          </TableCell>
                          <TableCell>
                            {dayjs(workDay.name, 'YYYY-MM-DD', true).isValid()
                              ? dayjs(workDay.name).format('DD/MM/YYYY')
                              : workDay.name || '-'}
                          </TableCell>
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
                            {workDay.tiffFile
                              ? workDay.tiffFile.split('-')[5]
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {workDay?.comment ? workDay?.comment : '-'}
                          </TableCell>
                          <TableCell>
                            <Stack spacing={1} sx={{ minWidth: 200 }}>
                              {/* Download Button */}
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={() => handleDownload(workDay)}
                                disabled={!hasDownload && !workDay.rawFile}
                                fullWidth
                                sx={{
                                  height: 36,
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  borderWidth: 1.5,
                                  '&:hover': {
                                    borderWidth: 2,
                                  },
                                }}
                              >
                                Download
                              </Button>
                              {/* JPG Upload Button */}
                              <Box>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  startIcon={<UploadIcon />}
                                  onClick={() =>
                                    handleFileInputClick(workDay, 'jpg')
                                  }
                                  disabled={uploading[`${id}_jpg`]}
                                  fullWidth
                                  sx={{
                                    height: 36,
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    borderWidth: 1.5,
                                    '&:hover': {
                                      borderWidth: 2,
                                    },
                                  }}
                                >
                                  Upload Tiff
                                </Button>
                                {uploading[`${id}_jpg`] && (
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Uploading...{' '}
                                      {uploadProgress[`${id}_jpg`] || 0}%
                                    </Typography>
                                    <Box sx={{ width: '100%', mt: 0.5 }}>
                                      <Box
                                        sx={{
                                          height: 3,
                                          bgcolor: 'grey.200',
                                          borderRadius: 1.5,
                                          overflow: 'hidden',
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: `${uploadProgress[`${id}_jpg`] || 0}%`,
                                            height: '100%',
                                            bgcolor: 'secondary.main',
                                            transition: 'width 0.3s ease',
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<UploadIcon />}
                                onClick={() => handleDxfFileInputClick(workDay)}
                                disabled={
                                  uploading[`${workDay._id || workDay.id}_dxf`]
                                }
                                fullWidth
                                sx={{
                                  height: 36,
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  borderWidth: 1.5,
                                  '&:hover': { borderWidth: 2 },
                                }}
                              >
                                Upload DXF
                              </Button>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<UploadIcon />}
                                onClick={() => handleCadFileInputClick(workDay)}
                                disabled={
                                  uploading[`${workDay._id || workDay.id}_dxf`]
                                }
                                fullWidth
                                sx={{
                                  height: 36,
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  borderWidth: 1.5,
                                  '&:hover': { borderWidth: 2 },
                                }}
                              >
                                Upload SHP zip file
                              </Button>

                              {/* Generate Tiles Button */}
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<IconPhotoEdit />}
                                onClick={() => handleGenerateTilesClick(id)}
                                disabled={
                                  uploading[`${id}_jpg`] ||
                                  uploading[`${id}_kml`]
                                }
                                fullWidth
                                sx={{
                                  height: 36,
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  borderWidth: 1.5,
                                  '&:hover': {
                                    borderWidth: 2,
                                  },
                                }}
                              >
                                Generate Tiles
                              </Button>
                            </Stack>
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
      <input
        type="file"
        ref={dxfFileInputRef}
        style={{ display: 'none' }}
        accept=".dxf"
        onChange={handleDxfFileChange}
      />
      <input
        type="file"
        ref={cadFileInputRef}
        style={{ display: 'none' }}
        accept=".zip"
        onChange={handleCadFileChange}
      />
      <GenerateTilesConfirmationBox
        confirmDialog={confirmDialog}
        generateTilesLoading={generateTilesLoading}
        handleCancelGenerateTiles={handleCancelGenerateTiles}
        handleConfirmGenerateTiles={handleConfirmGenerateTiles}
      />
    </MainCard>
  );
};

export default WorkDayList;
