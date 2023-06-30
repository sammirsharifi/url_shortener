'use client'

import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material'

import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { useRouter } from 'next/navigation'

const defaultTheme = createTheme()

export default function VerifyEmail({ params }: { params: { token: string } }) {
  const [alertError, setAlertError] = useState('')
  const router = useRouter()
  useEffect(() => {
    verifyId(decodeURIComponent(params.token))
  }, [])
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
            {alertError ? 'Verification Failed' : 'Verifying...'}
          </Typography>
          <br />
          <Typography component='h3' variant='h6'>
            {alertError || 'Please hold on'}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
  function verifyId(id: string) {
    if (!id) {
      return
    }
    const verifyEmail = async () => {
      const data = { id }
      return (await axios.post('/api/verify-email', data)).data
    }
    verifyEmail()
      .then((result) => {
        router.push('/login?message=Email successfully verified')
      })
      .catch((e) => {
        setAlertError(e.response?.data?.error || e.message)
      })
  }
}
