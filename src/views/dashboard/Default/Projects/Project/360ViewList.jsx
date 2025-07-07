import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  useTheme,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import Breadcrumbs from '../../../../../ui-component/extended/Breadcrumbs';
import { IconBuildingCog, IconDroneOff, IconView360Number } from '@tabler/icons-react';

const mockData = Array.from({ length: 23 }, (_, i) => ({
  serial: i + 1,
  date: new Date(2024, 0, i + 1).toLocaleDateString(),
  description: `Sample description ${i % 2 === 0 ? 'Alpha' : 'Beta'} #${i + 1}`,
}));

const AllDirectionViewList = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleView = (row) => {
    // Implement your view logic here
    alert(`Viewing serial no: ${row.serial}`);
  };

  // Filter and sort data
  const filtered = mockData.filter((row) =>
    row.description.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (a.description < b.description) return sortAsc ? -1 : 1;
    if (a.description > b.description) return sortAsc ? 1 : -1;
    return 0;
  });
  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', bgcolor: theme.palette.background.paper }}>
         <Typography variant="h1" sx={{ml:1,mt:1}} gutterBottom>
          Interior (360 View)
        </Typography>
      {/* Breadcrumbs */}
      <Breadcrumbs
        sx={{ m: 2 }}
        links={[
          { title: 'Projects', to: '/project', icon: IconDroneOff },
          { title: 'Project Name', to: '/project/1/View', icon: IconBuildingCog },
          { title: 'Interior (360 View)', icon: IconView360Number }, // No `to` makes it the current page
        ]}
        card={false}
        custom={true}
        rightAlign={false}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1, gap: 2 }}>
        <Typography variant="h6" sx={{ flex: 1, color: theme.palette.primary.main }}>
          360° View List
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by description"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          sx={{ minWidth: 220, bgcolor: theme.palette.background.default }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        <IconButton
          onClick={() => setSortAsc((prev) => !prev)}
          sx={{ color: theme.palette.primary.main }}
          title={`Sort by description (${sortAsc ? 'A-Z' : 'Z-A'})`}
        >
          <SortByAlphaIcon sx={{ transform: sortAsc ? 'scaleY(1)' : 'scaleY(-1)' }} />
        </IconButton>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Serial No</TableCell>
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Date</TableCell>
              <TableCell sx={{ color: theme.palette.primary.contrastText }}>Description</TableCell>
              <TableCell align="center" sx={{ color: theme.palette.primary.contrastText }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((row) => (
              <TableRow key={row.serial}>
                <TableCell>{row.serial}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" size="small" onClick={() => handleView(row)} color="primary">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ color: theme.palette.text.disabled }}>
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
        sx={{ bgcolor: theme.palette.background.default }}
      />
    </Paper>
  );
};

export default AllDirectionViewList;