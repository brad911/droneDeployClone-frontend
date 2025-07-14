import React, { useEffect, useState } from 'react';
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
  Chip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import axiosInstance from 'utils/axios.config';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import MainCard from 'ui-component/cards/MainCard';
const UserControlSystem = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchName, setSearchName] = useState('');
  const [pendingSearch, setPendingSearch] = useState({ email: '', name: '' });
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const token = useSelector((state) => state.auth.token);

  // Only search when button is clicked
  const handleSearch = () => {
    setPendingSearch({ email: searchEmail, name: searchName });
    setPage(1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
          email: pendingSearch.email || undefined,
          firstName: pendingSearch.name || undefined,
          sortBy: sortBy || undefined,
        };
        const res = await axiosInstance.get('/user', {
          params,
          headers: { Authorization: token },
        });
        setUsers(res.data.data?.results || []);
        setTotal(res.data.data?.totalResults || 0);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token, page, limit, pendingSearch, sortBy, refreshFlag]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.patch(
        `/user/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: token },
        },
      );
      setRefreshFlag((flag) => !flag);
      enqueueSnackbar(
        `User ${newStatus === 'enabled' ? 'enabled' : 'disabled'} successfully!`,
        { variant: 'success' },
      );
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message ||
          err.message ||
          'Failed to update user status',
        { variant: 'error' },
      );
    }
  };

  return (
    <MainCard>
      <Typography variant="h2" mb={2}>
        User Control Panel
      </Typography>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <TextField
          label="Search by Email"
          size="small"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <TextField
          label="Search by Name"
          size="small"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value + ':asc')}
          >
            <MenuItem value="createdAt:desc">None</MenuItem>
            <MenuItem value="firstName:asc">Name</MenuItem>
            <MenuItem value="status:asc">Status</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      {loading ? (
        <Typography>Loading users...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  // .filter((user) => user.role !== 'admin')
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user?.firstName} {user?.lastName}
                      </TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>{user?.designation}</TableCell>
                      <TableCell>{user?.organization}</TableCell>
                      <TableCell>{user?.gender}</TableCell>
                      <TableCell>{user?.role}</TableCell>
                      <TableCell>{user?.type}</TableCell>

                      <TableCell>
                        <Chip
                          label={user.status}
                          color={
                            user.status === 'enabled' ? 'success' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={
                            user.status === 'enabled' ? 'error' : 'success'
                          }
                          size="small"
                          onClick={() =>
                            handleStatusChange(
                              user.id,
                              user.status !== 'enabled'
                                ? 'enabled'
                                : 'disabled',
                            )
                          }
                        >
                          {user.status === 'enabled' ? 'Disable' : 'Enable'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}
    </MainCard>
  );
};

export default UserControlSystem;
