import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  return (
    <Link
      style={{ textDecoration: 'none' }}
      component={RouterLink}
      to={'/'}
      aria-label="theme-logo"
    >
      <Logo />
    </Link>
  );
}
