import React, { useState } from "react";
import "./navbar.css";
import { DarkTheme } from "../../assets/styles/";
import { NavLink } from "react-router-dom";
import {
  Menu as MenuIcon,
  LoginRounded,
  AccountCircleOutlined,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
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
} from "@mui/material";

const Navbar = ({ isConnected }) => {
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
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                App
              </Typography>
              {/* Menu item mobile */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <NavLink to="/">
                    <MenuItem key="home" onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">Accueil</Typography>
                    </MenuItem>
                  </NavLink>
                  <NavLink to="/marketplace">
                    <MenuItem key="marketplace" onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">Marketplace</Typography>
                    </MenuItem>
                  </NavLink>
                  {isConnected ? (
                    <NavLink to="/calendar">
                      <MenuItem
                        open={Boolean(anchorElNav)}
                        key="calendar"
                        onClick={handleCloseNavMenu}
                      >
                        <Typography textAlign="center">Calendrier</Typography>
                      </MenuItem>
                    </NavLink>
                  ) : null}
                  {isConnected ? (
                    <NavLink to="/wheel">
                      <MenuItem
                        open={Boolean(anchorElNav)}
                        key="wheel"
                        onClick={handleCloseNavMenu}
                      >
                        <Typography textAlign="center">Roue</Typography>
                      </MenuItem>
                    </NavLink>
                  ) : null}
                </Menu>
              </Box>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                App
              </Typography>
              {/* Menu item full page */}
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "activeLink" : undefined
                  }
                >
                  <Button
                    key="home"
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: "inherit",
                      display: "block",
                      "&:hover": { color: "var(--color-primary)" },
                    }}
                  >
                    <Typography component="p">home</Typography>
                  </Button>
                </NavLink>
                <NavLink
                  to="/marketplace"
                  className={({ isActive }) =>
                    isActive ? "activeLink" : undefined
                  }
                >
                  <Button
                    key="marketplace"
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: "inherit",
                      display: "block",
                      "&:hover": { color: "var(--color-primary)" },
                    }}
                  >
                    <Typography component="p">marketplace</Typography>
                  </Button>
                </NavLink>
                {isConnected ? (
                  <>
                    <NavLink
                      to="/calendar"
                      className={({ isActive }) =>
                        isActive ? "activeLink" : undefined
                      }
                    >
                      <Button
                        key="calendar"
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 2,
                          color: "inherit",
                          display: "block",
                          "&:hover": {
                            color: "var(--color-primary)",
                          },
                        }}
                      >
                        <Typography component="p">calendar</Typography>
                      </Button>
                    </NavLink>
                    <NavLink
                      to="/wheel"
                      className={({ isActive }) =>
                        isActive ? "activeLink" : undefined
                      }
                    >
                      <Button
                        key="wheel"
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 2,
                          color: "inherit",
                          display: "block",
                          "&:hover": {
                            color: "var(--color-primary)",
                          },
                        }}
                      >
                        <Typography component="p">Roue</Typography>
                      </Button>
                    </NavLink>
                  </>
                ) : null}
              </Box>
              {/* Profil icon */}
              <Box>
                {isConnected ? (
                  <>
                    <Tooltip title="Profil">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={
                          Boolean(anchorEl) ? "account-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                      >
                        <Avatar>
                          <AccountCircleOutlined />
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    <Menu
                      id="menu-profil"
                      aria-labelledby="menu-profil"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem onClick={() => {}}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Tooltip title="Login">
                    <IconButton sx={{ p: 0 }}>
                      <NavLink to="/login">
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
