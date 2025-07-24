import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthRegister from '../auth-forms/AuthRegister';

import Logo from 'ui-component/Logo';
import { useTheme } from '@emotion/react';
import ResetPasswordForm from '../auth-forms/ResetPasswordForm';
import ForgetPasswordForm from '../auth-forms/ForgetPasswordForm';
// import AuthFooter from 'ui-component/cards/AuthFooter';

export default function ForgetPassword() {
  const theme = useTheme();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
              minHeight: 'calc(100vh - 38px)',
            }}
          >
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={0}
                  sx={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Grid sx={{ mb: 3 }}>
                    <Link
                      style={{ textDecoration: 'none' }}
                      to="#"
                      aria-label="theme logo"
                    >
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
                            Forget Password
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '16px',
                              textAlign: 'center',
                            }}
                          >
                            You will receive on an email to change your password
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
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
                        ></Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <ForgetPasswordForm />
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
                      {/* <Typography
                        component={Link}
                        to="/login"
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
                        Already have an account?
                      </Typography> */}
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid sx={{ px: 3, mb: 3, mt: 1 }} size={12}>
          <AuthFooter />
        </Grid> */}
      </Grid>
    </AuthWrapper1>
  );
}
