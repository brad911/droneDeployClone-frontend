import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';
import { Box } from '@mui/material';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  return (
    <Box
      style={{
        textDecoration: 'none',
      }}
      // component={RouterLink}
      // to={'/'}
      aria-label="theme-logo"
    >
      <Logo />
    </Box>
  );
}
