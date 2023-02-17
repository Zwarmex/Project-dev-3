import React, { useState } from 'react';
import './navbar.css';
import { DarkTheme } from '../../assets/styles/';
import { NavLink } from 'react-router-dom';
import {
	Menu as MenuIcon,
	LoginRounded,
	AccountCircleOutlined,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	Box,
	Menu,
	MenuItem,
	Button,
	Tooltip,
	Avatar,
	IconButton,
	CssBaseline,
} from '@mui/material';
import { auth } from '../../assets/firebase/firebase_auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Navbar = ({ isConnected }) => {
	const [user] = useAuthState(auth);
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	return (
		<>
			<CssBaseline />
			<ThemeProvider theme={DarkTheme}>
				<AppBar position='static'>
					<Container maxWidth='xl'>
						<Toolbar disableGutters>
							<Typography
								variant='h6'
								noWrap
								component='a'
								href='/'
								sx={{
									mr: 2,
									display: { xs: 'none', md: 'flex' },
									fontFamily: 'monospace',
									fontWeight: 700,
									letterSpacing: '.3rem',
									color: 'inherit',
									textDecoration: 'none',
								}}>
								App
							</Typography>

							<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
								<IconButton
									size='large'
									aria-label='account of current user'
									aria-controls='menu-appbar'
									aria-haspopup='true'
									onClick={handleOpenNavMenu}
									color='inherit'>
									<MenuIcon />
								</IconButton>
								<Menu
									id='menu-appbar'
									anchorEl={anchorElNav}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'left',
									}}
									open={Boolean(anchorElNav)}
									onClose={handleCloseNavMenu}
									sx={{
										display: { xs: 'block', md: 'none' },
									}}>
									<MenuItem key='home' onClick={handleCloseNavMenu}>
										<Typography textAlign='center'>
											<NavLink to='/'>Home</NavLink>
										</Typography>
									</MenuItem>
									<MenuItem key='marketplace' onClick={handleCloseNavMenu}>
										<Typography textAlign='center'>
											<NavLink to='/marketplace'>Marketplace</NavLink>
										</Typography>
									</MenuItem>
									{isConnected ? (
										<MenuItem
											open={Boolean(anchorElNav)}
											key='calendar'
											onClick={handleCloseNavMenu}>
											<Typography textAlign='center'>
												<NavLink to='/calendar'>Calendar</NavLink>
											</Typography>
										</MenuItem>
									) : null}
								</Menu>
							</Box>
							<Typography
								variant='h5'
								noWrap
								component='a'
								href=''
								sx={{
									mr: 2,
									display: { xs: 'flex', md: 'none' },
									flexGrow: 1,
									fontFamily: 'monospace',
									fontWeight: 700,
									letterSpacing: '.3rem',
									color: 'inherit',
									textDecoration: 'none',
								}}>
								App
							</Typography>
							<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
								<Button
									key='home'
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}>
									<NavLink
										to='/'
										className={({ isActive }) =>
											isActive ? 'activeLink' : undefined
										}>
										home
									</NavLink>
								</Button>
								<Button
									key='marketplace'
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}>
									<NavLink
										to='/marketplace'
										className={({ isActive }) =>
											isActive ? 'activeLink' : undefined
										}>
										marketplace
									</NavLink>
								</Button>
								<Button
									key='calendar'
									onClick={handleCloseNavMenu}
									sx={{ my: 2, color: 'white', display: 'block' }}>
									<NavLink
										to='/calendar'
										className={({ isActive }) =>
											isActive ? 'activeLink' : undefined
										}>
										calendar
									</NavLink>
								</Button>
							</Box>
							<Box>
								{user ? (
									<>
										<Tooltip title='Profil'>
											<IconButton
												onClick={handleClick}
												size='small'
												sx={{ ml: 2 }}
												aria-controls={
													Boolean(anchorEl) ? 'account-menu' : undefined
												}
												aria-haspopup='true'
												aria-expanded={Boolean(anchorEl) ? 'true' : undefined}>
												<Avatar>
													<AccountCircleOutlined />
												</Avatar>
											</IconButton>
										</Tooltip>
										<Menu
											id='menu-profil'
											aria-labelledby='menu-profil'
											anchorEl={anchorEl}
											open={Boolean(anchorEl)}
											onClose={handleClose}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'left',
											}}
											transformOrigin={{
												vertical: 'top',
												horizontal: 'left',
											}}>
											<MenuItem
												onClick={() => {
													auth.signOut();
													handleClose();
												}}>
												Logout
											</MenuItem>
										</Menu>
									</>
								) : (
									<Tooltip title='Login'>
										<IconButton sx={{ p: 0 }}>
											<NavLink to='/login'>
												<Avatar>
													<LoginRounded />
												</Avatar>
											</NavLink>
										</IconButton>
									</Tooltip>
								)}
							</Box>
						</Toolbar>
					</Container>
				</AppBar>
			</ThemeProvider>
		</>
	);
};
export default Navbar;
