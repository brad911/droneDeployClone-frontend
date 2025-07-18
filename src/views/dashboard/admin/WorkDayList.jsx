import { useState, useEffect } from 'react';
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
  IconButton,
  useTheme,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Pagination,
  Stack,
  InputLabel,
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

  useEffect(() => {
    if (!projectId) return;
    const fetchWorkDays = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          //   projectId,
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
          { variant: 'error' },
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
    const file = workDay.resultFiles && workDay.resultFiles[0];
    console.log(file.Key, '<=== =file');
    if (!file?.key && !file.Key) {
      enqueueSnackbar('No file found to download', { variant: 'warning' });
      return;
    }
    try {
      const res = await axiosInstance.get(
        `/work-day/get-download-url/${file.key || file.Key}`,
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
        { variant: 'error' },
      );
    }
  };

  const handleUpload = (workDay) => {
    enqueueSnackbar('Upload action for ' + (workDay.name || workDay.id), {
      variant: 'info',
    });
    // Implement upload logic/modal as needed
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
        { variant: 'error' },
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
          label="Search by Date"
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
                      Date
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
                      const file =
                        workDay.resultFiles && workDay.resultFiles[0];
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
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownload(workDay)}
                              disabled={
                                !hasDownload &&
                                (!workDay.resultFiles ||
                                  workDay.resultFiles.length === 0)
                              }
                              sx={{ mr: 1 }}
                            >
                              Download
                            </Button>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<UploadIcon />}
                              onClick={() => handleUpload(workDay)}
                            >
                              Upload
                            </Button>
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
    </MainCard>
  );
};

export default WorkDayList;
