'use client'

import {
  Container,
  CssBaseline,
  Box,
  Typography,
  Alert,
  Snackbar,
  AlertTitle,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Tooltip,
  IconButton,
  Dialog,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  QrCode as QrCodeIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material'

import Image from 'next/image'

import React, { useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'

import Header from '@/Components/Header'

import QRCode from 'qrcode'
import { useRouter } from 'next/navigation'

import moment from 'moment'

const URLRegex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

type UserHistory = {
  id: number | undefined
  username: string
  longURL: string
  shortURL: string
  date: Date
}[]

export default function Dashboard() {
  const [alertError, setAlertError] = useState<string>('')
  const [userInfo, setUserInfo] = useState(null)
  const [userHistory, setUserHistory] = useState<UserHistory | null>(null)
  const [QRCodeImage, setQRCodeImage] = useState<string>('')
  const [QRCodeImageURL, setQRCodeImageURL] = useState<string>('')

  const router = useRouter()

  useEffect(() => {
    getMe().then((data) => {
      setUserInfo(data)
    })
    getUserHistory().then((data) => {
      setUserHistory(data as UserHistory)
    })
  }, [])

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
          mt={10}
        >
          <Typography
            component='h1'
            variant='h5'
            justifyContent='left'
            display='flex'
          >
            URL History
          </Typography>
          {!userHistory?.length && (
            <Typography
              component='h1'
              variant='h6'
              justifyContent='left'
              display='flex'
            >
              No history to show!
            </Typography>
          )}
        </Box>
        {!!userHistory?.length && (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size='small'
              aria-label='a dense table'
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align='center'>Long URL</TableCell>
                  <TableCell align='center'>Short URL</TableCell>
                  <TableCell align='center'>Date</TableCell>
                  <TableCell align='center'></TableCell>
                  <TableCell align='center'></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userHistory.map((history) => (
                  <TableRow
                    key={history.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {history.id}
                    </TableCell>
                    <TableCell align='center'>{history.longURL}</TableCell>
                    <TableCell align='center'>{history.shortURL}</TableCell>
                    <TableCell align='center'>
                      {moment(history.date).format('YYYY/MM/DD')}
                    </TableCell>
                    <TableCell align='center'>
                      {
                        <Tooltip title='Generate QR code'>
                          <IconButton
                            onClick={() => {
                              QRCodeGen(history.shortURL)
                            }}
                          >
                            <QrCodeIcon />
                          </IconButton>
                        </Tooltip>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {QRCodeImage && (
          <Box
            // sx={{
            //   marginTop: 8,
            //   display: 'flex',
            //   flexDirection: 'column',
            //   alignItems: 'left'
            // }}
          >
            <Dialog open={!!QRCodeImage} onClose={() => setQRCodeImage('')}>
              <Image src={QRCodeImage} alt='logo' width='350' height='350' />
              <TextField
                style={{ width: '100' }}
                value={QRCodeImageURL}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>URL:</InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Tooltip title='Copy to clipboard'>
                        <IconButton
                          onClick={() => {
                            navigator.clipboard.writeText(QRCodeImageURL)
                          }}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            </Dialog>
          </Box>
        )}
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

  async function QRCodeGen(url: string) {
    if (!url) {
      setAlertError('No URL for QR code!')
      return
    }
    const img = await QRCode.toDataURL(url)
    setQRCodeImage(img)
    setQRCodeImageURL(url)
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

  async function getUserHistory() {
    try {
      const data: UserHistory = (await axios.get('/api/history')).data
      data.forEach((v, i) => {
        v.id = i + 1
        v.date = new Date(v.date)
      })
      return data
    } catch (e: AxiosError | any) {
      if (e.response?.status === 401) {
        router.push('/login')
        return
      }
      setAlertError(e.response?.data?.message || e.message)
    }
  }
}
