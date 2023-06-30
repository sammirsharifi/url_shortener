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
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const defaultTheme = createTheme()

export default function Login({ searchParams }: { searchParams: { message: string } }) {
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [alertError, setAlertError] = useState('')
	const [alertSuccess, setAlertSuccess] = useState('')

	useEffect(() => {
		if (searchParams.message) {
			setAlertSuccess(searchParams.message)
		}
	}, [])

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
						Sign in
					</Typography>
					<Box
						component='form'
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin='normal'
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
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							error={!!passwordError.length}
							helperText={passwordError}
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href='#' variant='body2'>
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href='/signup' variant='body2'>
									{"Don't have an account? Sign Up"}
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
				{alertSuccess && (
					<Snackbar
						open={!!alertSuccess}
						autoHideDuration={8000}
						onClose={() => setAlertSuccess('')}
					>
						<Alert severity='success'>
							<AlertTitle>Success</AlertTitle>
							{alertSuccess}
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

		if (!/\w+@\w+\.\w{2,}/.test(email as string)) {
			setEmailError('Enter a valid email')
			return
		}
		setEmailError('')
		if (!password) {
			setPasswordError('Password cannot be empty')
			return
		}
		setPasswordError('')
		const login = async () => {
			const data = {
				username: email,
				password
			}
			return (await axios.post('/api/login', data)).data
		}

		login()
			.then((_) => {
				router.push('/dashboard')
			})
			.catch((e) => {
				setAlertError(e.response?.data?.error || e.message)
			})
	}
}
