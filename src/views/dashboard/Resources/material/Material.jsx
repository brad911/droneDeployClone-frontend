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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MaterialModal from './MaterialModal';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';
import axiosInstance from '../../../../utils/axios.config';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

const Material = () => {
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

  // 🔍 Filter state
  const [filters, setFilters] = useState({
    material: '',
    supplier: '',
    category: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleResetFilters = () => {
    setFilters({
      material: '',
      supplier: '',
      category: '',
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

      const res = await axiosInstance.get('/material', { params });
      setData(res.data.data.results || res.data);
      setTotal(res.data.data.totalResults || res.data.data.total || 0);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to load material data', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, page]);

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
      await axiosInstance.delete(`/material/${selected.id}`);
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
          <Typography variant="h3">Material</Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSelected(null);
              setOpenModal(true);
            }}
          >
            Add Material
          </Button>
        </Box>

        {/* 🔍 Filters */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Material Type"
              name="material"
              value={filters.material}
              onChange={handleFilterChange}
            ></TextField>
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
                  <TableCell>Material Name</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Received</TableCell>
                  <TableCell>Used</TableCell>
                  <TableCell>Balance</TableCell>
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
                      <TableCell>{row?.material}</TableCell>
                      <TableCell>{row?.unit}</TableCell>
                      <TableCell>{row?.supplier}</TableCell>
                      <TableCell>{row?.received}</TableCell>
                      <TableCell>{row?.used}</TableCell>
                      <TableCell>{row?.balance}</TableCell>{' '}
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
                    <TableCell colSpan={8} align="center">
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
      <MaterialModal
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

export default Material;
