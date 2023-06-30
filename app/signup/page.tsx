'use client'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  AlertTitle,
  Snackbar
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const defaultTheme = createTheme()

export default function SignUp() {
  const [passwordError, setPasswordError] = useState('')
  const [passwordRepeatError, setPasswordRepeatError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [alertError, setAlertError] = useState('')
  const [alertSignupSuccess, setAlertSignupSuccess] = useState('')

  const router = useRouter()

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign up
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Email Address'
                  name='email'
                  autoComplete='email'
                  error={!!emailError.length}
                  helperText={emailError}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Password'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  error={!!passwordError.length}
                  helperText={passwordError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete='new-password-repeat'
                  name='password-repeat'
                  type='password'
                  required
                  fullWidth
                  id='password-repeat'
                  label='Retype Password'
                  error={!!passwordRepeatError.length}
                  helperText={passwordRepeatError}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link href='/login' variant='body2'>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {alertError && (
          <Snackbar
            open={!!alertError}
            autoHideDuration={3000}
            onClose={() => setAlertError('')}
          >
            <Alert severity='error'>
              <AlertTitle>Error</AlertTitle>
              {alertError}
            </Alert>
          </Snackbar>
        )}
        {alertSignupSuccess && (
          <Snackbar
            open={!!alertSignupSuccess}
            onClose={() => setAlertSignupSuccess('')}
          >
            <Alert severity='success'>
              <AlertTitle>Success</AlertTitle>
              {alertSignupSuccess}
            </Alert>
          </Snackbar>
        )}
      </Container>
    </ThemeProvider>
  )
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = data.get('email')
    const password = data.get('password')
    const passwordRepeat = data.get('password-repeat')
    if (!/\w+@\w+\.\w{2,}/.test(email as string)) {
      setEmailError('invalid email')
      return
    }
    setEmailError('')

    if (!password) {
      setPasswordError('Password cannot be empty')
      return
    }
    setPasswordError('')

    if (!passwordRepeat) {
      setPasswordRepeatError('Password repeat cannot be empty')
      return
    }
    setPasswordRepeatError('')

    if (password !== passwordRepeat) {
      setPasswordRepeatError('Passwords must match')
      return
    }
    const signup = async () => {
      const data = {
        username: email,
        password
      }
      return (await axios.post('/api/signup', data)).data
    }
    signup()
      .then((result) => {
        setAlertSignupSuccess(result.message || '')
      })
      .catch((e) => {
        setAlertError(e.response?.data?.error || e.message)
      })
  }
}
