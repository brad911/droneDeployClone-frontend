import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';

import Logo from 'ui-component/Logo';
import { useTheme } from '@emotion/react';
// import AuthFooter from 'ui-component/cards/AuthFooter';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function Login() {
  const theme = useTheme();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleGoogleLogin = () => {
    console.log('Trigger Google Login');
    // You can integrate Firebase or a backend endpoint here
  };

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}
      >
        <Grid size={12}>
          <Grid
            container
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100vh - 68px)',
            }}
          >
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  sx={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Grid sx={{ mb: 3 }}>
                    <Link to="#" aria-label="logo">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid size={12}>
                    <Grid
                      container
                      direction={{ xs: 'column-reverse', md: 'row' }}
                      sx={{ alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Grid>
                        <Stack
                          spacing={1}
                          sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            gutterBottom
                            variant={downMD ? 'h3' : 'h2'}
                            sx={{ color: 'secondary.main' }}
                          >
                            Hi, Welcome Back
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '16px',
                              textAlign: { xs: 'center', md: 'inherit' },
                            }}
                          >
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <AuthLogin />
                    <Grid sx={{ mt: 4 }} item xs={12}>
                      <Stack direction="row" justifyContent="center">
                        <button
                          onClick={handleGoogleLogin}
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px 20px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '14px',
                          }}
                        >
                          <img
                            src="https://developers.google.com/identity/images/g-logo.png"
                            alt="Google logo"
                            style={{ width: 20, height: 20, marginRight: 10 }}
                          />
                          Login with Google
                        </button>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Divider />
                  </Grid>
                  <Grid size={12}>
                    <Grid
                      container
                      direction="column"
                      sx={{ alignItems: 'center' }}
                      size={12}
                    >
                      <Typography
                        component={Link}
                        to="/register"
                        variant="subtitle1"
                        sx={{
                          textDecoration: 'underline',
                          textDecorationColor: theme.palette.secondary[200],
                          color: 'inherit', // optional: keeps text color consistent
                          '&:hover': {
                            textDecorationColor: theme.palette.secondary[800], // optional: darker shade on hover
                          },
                        }}
                      >
                        Don&apos;t have an account?
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
}
