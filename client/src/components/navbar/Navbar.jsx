import React, { useState, useContext } from "react";
import "./navbar.css";
import UserContext from "../usercontext/UserContext";
import { DarkTheme } from "../../assets/styles/";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const { idUser, logout, avatarUser } = useContext(UserContext);
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
    setAnchorEl(event.target);
  };
  return (
    <Box>
      <ThemeProvider theme={DarkTheme}>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Title for the web page */}
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                id="navbar__title"
              >
                App
              </Typography>
              {/* Menu item mobile */}
              <Box id="navbar__mobile-menu-container">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="navbar__mobile-menu"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="navbar__mobile-menu"
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
                  {idUser ? (
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
                  {idUser ? (
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
                  {idUser ? (
                    <NavLink to="/recipe_add">
                      <MenuItem
                        open={Boolean(anchorElNav)}
                        key="recipe_add"
                        onClick={handleCloseNavMenu}
                      >
                        <Typography textAlign="center">
                          Ajouter recette
                        </Typography>
                      </MenuItem>
                    </NavLink>
                  ) : null}
                </Menu>
              </Box>
              {/* Title for the mobile  */}
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                id="navbar__mobile-title"
              >
                App
              </Typography>
              {/* Menu item full page */}
              <Box id="navbar__menu-container">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "activeLinks navbar__links" : "navbar__links"
                  }
                >
                  <Button
                    key="home"
                    fullWidth
                    onClick={handleCloseNavMenu}
                    className="navbar__menu-buttons"
                  >
                    <Typography component="p">Accueil</Typography>
                  </Button>
                </NavLink>
                <NavLink
                  to="/marketplace"
                  className={({ isActive }) =>
                    isActive ? "activeLinks navbar__links" : "navbar__links"
                  }
                >
                  <Button
                    key="marketplace"
                    fullWidth
                    onClick={handleCloseNavMenu}
                    className="navbar__menu-buttons"
                  >
                    <Typography component="p">marketplace</Typography>
                  </Button>
                </NavLink>
                {idUser ? (
                  <>
                    <NavLink
                      to="/calendar"
                      className={({ isActive }) =>
                        isActive ? "activeLinks navbar__links" : "navbar__links"
                      }
                    >
                      <Button
                        key="calendar"
                        fullWidth
                        onClick={handleCloseNavMenu}
                        className="navbar__menu-buttons"
                      >
                        <Typography component="p">calendrier</Typography>
                      </Button>
                    </NavLink>
                    <NavLink
                      to="/wheel"
                      className={({ isActive }) =>
                        isActive ? "activeLinks navbar__links" : "navbar__links"
                      }
                    >
                      <Button
                        key="wheel"
                        fullWidth
                        onClick={handleCloseNavMenu}
                        className="navbar__menu-buttons"
                      >
                        <Typography component="p">Roue</Typography>
                      </Button>
                    </NavLink>
                    <NavLink
                      to="/recipe_add"
                      className={({ isActive }) =>
                        isActive ? "activeLinks navbar__links" : "navbar__links"
                      }
                    >
                      <Button
                        key="recipe_add"
                        fullWidth
                        onClick={handleCloseNavMenu}
                        className="navbar__menu-buttons"
                      >
                        <Typography component="p">Ajouter</Typography>
                      </Button>
                    </NavLink>
                  </>
                ) : null}
              </Box>
              {/* Profil icon */}
              <Box>
                {idUser ? (
                  <Container disableGutters>
                    <Tooltip title="Profil">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        id="navbar__profil-iconButton"
                        aria-controls={
                          Boolean(anchorEl) ? "account-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
                      >
                        <Avatar>
                          {(avatarUser && (
                            <div
                              id="navbar__avatarContainer"
                              style={{
                                backgroundImage: `url(${avatarUser})`,
                              }}
                            ></div>
                          )) || <AccountCircleOutlined />}
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
                      <MenuItem
                        onClick={() => {
                          navigate("/user_recipes");
                        }}
                      >
                        Mes recettes
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          navigate("/settings");
                        }}
                      >
                        Paramètres
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                      >
                        Déconnection
                      </MenuItem>
                    </Menu>
                  </Container>
                ) : (
                  <Tooltip title="Login">
                    <IconButton id="navbar__profil-iconButtons">
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
    </Box>
  );
};
export default Navbar;
