'use client'

import {
  TextField,
  Container,
  CssBaseline,
  Box,
  Typography,
  Icon,
  Button,
  InputAdornment,
  Alert,
  Snackbar,
  AlertTitle,
  IconButton,
  Tooltip,
  Dialog
} from '@mui/material'
import {
  QrCode as QrCodeIcon,
  ContentCopy as ContentCopyIcon,
  KeyboardDoubleArrowDownOutlined as KeyboardDoubleArrowDownOutlinedIcon
} from '@mui/icons-material'

import Image from 'next/image'

import React, { useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'

import Header from '@/Components/Header'
import { ShortenResponseBody } from '@/interfaces'

import QRCode from 'qrcode'
import { useRouter } from 'next/navigation'

const URLRegex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

export default function Dashboard() {
  const [URL, setURL] = useState<string>('')
  const [shortenedURL, setShortenedURL] = useState<string>('')
  const [alertError, setAlertError] = useState<string>('')
  const [focus, setFocus] = useState<boolean>(false)
  const [QRCodeImage, setQRCodeImage] = useState<string>('')
  const [userData, setUserData] = useState(null)

  const router = useRouter()

  useEffect(() => {
    getMe().then((data) => {
      setUserData(data)
    })
  }, [])

  const inputRef = useRef<HTMLInputElement>(null)

  const onFocus = () => {
    setFocus(true)
  }

  const onBlur = () => {
    setFocus(false)
  }

  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focus])

  return (
    <>
      <Header />
      <Container>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left'
          }}
          m={20}
        >
          <Typography
            component='h1'
            variant='h5'
            justifyContent='left'
            display='flex'
          >
            Create URL
          </Typography>
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <TextField
              name='url'
              required
              fullWidth
              value={URL}
              color={URLRegex.test(URL) ? 'success' : 'warning'}
              variant={!focus && URLRegex.test(URL) ? 'filled' : 'outlined'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setURL(e.target.value)
              }}
              inputRef={inputRef}
              label='URL'
              onFocus={onFocus}
              onBlur={onBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </InputAdornment>
                )
              }}
            />
            <Icon sx={{ m: 2, transform: 'scale(1.8)' }}>
              <KeyboardDoubleArrowDownOutlinedIcon />
            </Icon>
            <TextField
              name='shortened url'
              fullWidth
              color={shortenedURL ? 'success' : 'info'}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position='end'>
                    <Tooltip title='Generate QR code'>
                      <IconButton onClick={QRCodeGen}>
                        <QrCodeIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Copy to clipboard'>
                      <IconButton
                        onClick={() => {
                          if (!shortenedURL) {
                            setAlertError('No URL to copy!')
                          }
                          navigator.clipboard.writeText(shortenedURL)
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
              value={shortenedURL}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setShortenedURL(e.target.value)
              }}
            />
            {QRCodeImage && (
              <Dialog open={!!QRCodeImage} onClose={() => setQRCodeImage('')}>
                <Image src={QRCodeImage} alt='logo' width='350' height='350' />
              </Dialog>
            )}
          </Box>
        </Box>
      </Container>
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
    </>
  )

  async function QRCodeGen() {
    if (!shortenedURL) {
      setAlertError('No URL for QR code!')
      return
    }
    const img = await QRCode.toDataURL(shortenedURL)
    setQRCodeImage(img)
  }

  function handleSubmit() {
    if (!URLRegex.test(URL)) {
      setAlertError('Invalid URL')
    }
    const shorten = async () => {
      const data = {
        url: URL
      }
      return (await axios.post('/api/shorten', data)).data
    }

    shorten()
      .then((result: ShortenResponseBody) => {
        setShortenedURL(result.short_url)
      })
      .catch((e) => {
        setAlertError(e.response?.data?.error || e.message)
      })
  }

  async function getMe() {
    try {
      return (await axios.get('/api/me')).data
    } catch (e: AxiosError | any) {
      if (e.response?.status === 401) {
        router.push('/login')
        return
      }
      setAlertError(e.response?.data?.message || e.message)
    }
  }
}
