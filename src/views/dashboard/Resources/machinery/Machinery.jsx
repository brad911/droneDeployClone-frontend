import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import axiosInstance from '../../../../utils/axios.config';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MachineryModal from './MachineryModal';
import { format } from 'date-fns';

const Machinery = () => {
  const projectId = useSelector((state) => state.project.id);
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 🔍 Filters
  const [filters, setFilters] = useState({
    category: '',
    supplier: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetFilters = () => {
    setFilters({
      machinery: '',
      supplier: '',
      status: '',
      startDate: '',
      endDate: '',
    });
    setPage(1);
  };

  const fetchData = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const params = {
        projectId,
        page,
        limit,
        ...filters,
      };

      const res = await axiosInstance.get('/machinery', { params });
      setData(res.data.data.results || res.data);
      setTotal(res.data.data.totalResults || res.data.data.total || 0);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to load machinery data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, page, limit]);

  const handleFilterApply = () => {
    setPage(1);
    fetchData();
  };

  const handleEdit = (row) => {
    setSelected(row);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/machinery/${selected._id}`);
      enqueueSnackbar('Record deleted successfully', { variant: 'success' });
      setConfirmDelete(false);
      fetchData();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to delete record', { variant: 'error' });
    }
  };

  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h3">Machinery</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              setOpenModal(true);
            }}
          >
            Add Machinery
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Machine Name"
              fullWidth
              name="machinery"
              value={filters.machinery}
              onChange={handleFilterChange}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Supplier"
              fullWidth
              name="supplier"
              value={filters.supplier}
              onChange={handleFilterChange}
            />
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate ? new Date(filters.startDate) : null}
                onChange={(newValue) =>
                  handleFilterChange({
                    target: {
                      name: 'startDate',
                      value: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                    },
                  })
                }
                format="dd-MM-yyyy"
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate ? new Date(filters.endDate) : null}
                onChange={(newValue) =>
                  handleFilterChange({
                    target: {
                      name: 'endDate',
                      value: newValue ? format(newValue, 'yyyy-MM-dd') : '',
                    },
                  })
                }
                format="dd-MM-yyyy"
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </Grid>
          </LocalizationProvider>

          <Grid item xs={12} sm={6} display="flex" alignItems="center" gap={1}>
            <Button variant="contained" onClick={handleFilterApply}>
              Apply Filters
            </Button>
            <Button variant="outlined" onClick={handleResetFilters}>
              Reset
            </Button>
          </Grid>
        </Grid>

        {/* Table */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={5}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Created</TableCell>
                  <TableCell>Machinery</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Allocated</TableCell>
                  <TableCell>Occupied</TableCell>
                  <TableCell>Idle</TableCell>
                  <TableCell>Maintainance</TableCell>
                  <TableCell>Remarks</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell>
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleDateString('en-GB')
                          : '-'}
                      </TableCell>
                      <TableCell>{row?.machinery}</TableCell>
                      <TableCell>{row?.supplier}</TableCell>
                      <TableCell>{row?.allocated}</TableCell>
                      <TableCell>{row?.occupied}</TableCell>
                      <TableCell>{row?.idle}</TableCell>
                      <TableCell>{row?.maintainance}</TableCell>
                      <TableCell>{row?.remarks}</TableCell>

                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(row)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelected(row);
                            setConfirmDelete(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {total > limit && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(total / limit)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </CardContent>

      {/* Modals */}
      <MachineryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selected}
        refresh={fetchData}
        projectId={projectId}
      />

      <ConfirmDeleteDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default Machinery;
