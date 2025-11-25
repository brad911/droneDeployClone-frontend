import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import axiosInstance from 'utils/axios.config';
import { useSnackbar } from 'notistack';

const PermissionModal = ({ open, onClose, user, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [permissions, setPermissions] = useState(user.permissions || {});

  const handleCheckboxChange = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    console.log(permissions, '<======permissions to submit');
    try {
      await axiosInstance.patch(`/user/updatePersmission/${user.id}`, {
        permissions: permissions,
      });
      enqueueSnackbar('Permissions updated successfully!', {
        variant: 'success',
      });
      onSave();
      onClose();
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Failed to update permissions', { variant: 'error' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Change Permissions</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="h3" gutterBottom>
          {user?.firstName} {user?.lastName}
        </Typography>
        <FormGroup>
          <Grid
            container
            justifyContent={'center'}
            alignContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            {Object.keys(permissions).map((key) => (
              <Grid item xs={6} key={key} minWidth={200}>
                {/* 6 means half-width -> two per row */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions[key]}
                      onChange={() => handleCheckboxChange(key)}
                    />
                  }
                  label={key}
                />
              </Grid>
            ))}
            <Grid item key={'yolo'} xs={6} minWidth={200}></Grid>
          </Grid>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionModal;
