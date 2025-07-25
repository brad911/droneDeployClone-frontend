import { memo, useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuCard from './MenuCard';
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { Avatar, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

// ==============================|| SIDEBAR DRAWER ||============================== //

function Sidebar() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const user = useSelector((state) => state.auth.user);

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { miniDrawer, mode } = useConfig();

  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: 2 }}>
        <LogoSection />
      </Box>
    ),
    [],
  );

  const drawer = useMemo(() => {
    const drawerContent = (
      <>
        <MenuCard />
        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
          <Chip
            avatar={
              <Avatar
                alt={`${user.firstName} ${user.lastName}`}
                sx={{
                  bgcolor: 'text.secondary',
                  width: 32,
                  height: 32,
                  fontSize: 10,
                }}
              >
                {`${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`}
              </Avatar>
            }
            label={
              <Box display="flex" flexDirection="column" lineHeight={1.2}>
                <Typography variant="body1" fontWeight="500">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.designation}
                </Typography>
              </Box>
            }
            variant="outlined"
            sx={{
              border: 'none',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 2,
              '& .MuiChip-label': {
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
              },
            }}
          />
        </Stack>
      </>
    );

    let drawerSX = {
      paddingLeft: '0px',
      paddingRight: '0px',
      marginTop: '20px',
    };
    if (drawerOpen)
      drawerSX = {
        paddingLeft: '16px',
        paddingRight: '16px',
        marginTop: '0px',
      };

    return (
      <>
        {downMD ? (
          <Box sx={drawerSX}>
            <MenuList />
            {drawerOpen && drawerContent}
          </Box>
        ) : (
          <PerfectScrollbar
            style={{ height: 'calc(100vh - 88px)', ...drawerSX }}
          >
            <MenuList />
            {drawerOpen && drawerContent}
          </PerfectScrollbar>
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downMD, drawerOpen, mode]);

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }}
      aria-label="mailbox folders"
    >
      {downMD || (miniDrawer && drawerOpen) ? (
        <Drawer
          variant={downMD ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          sx={{
            '& .MuiDrawer-paper': {
              mt: downMD ? 0 : 11,
              zIndex: 1099,
              width: drawerWidth,
              bgcolor: 'background.default',
              color: 'text.primary',
              borderRight: 'none',
              height: 'auto',
            },
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {downMD && logo}
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          <Box sx={{ mt: 10 }}>{drawer}</Box>
        </MiniDrawerStyled>
      )}
    </Box>
  );
}

export default memo(Sidebar);
