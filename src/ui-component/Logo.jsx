// material-ui
// import { useTheme } from '@mui/material/styles';

// project imports

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */
import logo from '../assets/images/yourLogoHere.jpg';
// ==============================|| LOGO SVG ||============================== //

export default function Logo() {
  // const theme = useTheme();

  return (
    // <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Berry" width="100" />
    <img src={logo} alt="Infra-X-Logo" width="50" />
  );
}
