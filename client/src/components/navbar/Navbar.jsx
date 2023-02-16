import React from "react";
import "./navbar.css";
import DarkTheme from "../../assets/styles/DarkTheme";
import { NavLink } from "react-router-dom";
import { Menu as MenuIcon, LoginRounded } from "@mui/icons-material";
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

const Navbar = ({ isConnected }) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
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
                <MenuItem key="home" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <NavLink to="/">Home</NavLink>
                  </Typography>
                </MenuItem>
                <MenuItem key="marketplace" onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <NavLink to="/marketplace">Marketplace</NavLink>
                  </Typography>
                </MenuItem>
                {isConnected ? (
                  <MenuItem key="calendar" onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">
                      <NavLink to="/calendar">Calendar</NavLink>
                    </Typography>
                  </MenuItem>
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
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <Button
                key="home"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <NavLink to="/">home</NavLink>
              </Button>
              <Button
                key="marketplace"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <NavLink to="/marketplace">marketplace</NavLink>
              </Button>
            </Box>
            <Box>
              <Tooltip title="Login/Register">
                <IconButton sx={{ p: 0 }}>
                  <NavLink to="/login">
                    <Avatar>
                      <LoginRounded />
                    </Avatar>
                  </NavLink>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

// const handleClickMenu = () => {
//   alert("clicked menu");
// };
// return (
//   <div className="navbar-container">
//     <div className="navbar-title">
//       <p>
//         <NavLink to="/">
//           Recipe's App
//         </NavLink>
//       </p>
//     </div>
//     <div className="navbar-links">
//       <ul className="navbar-links__ul">
//         <li>
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               isActive ? "activeLink" : undefined
//             }
//           >
//             Home
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/marketplace"
//             className={({ isActive }) =>
//               isActive ? "activeLink" : undefined
//             }
//           >
//             Market Place
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/wheel"
//             className={({ isActive }) =>
//               isActive ? "activeLink" : undefined
//             }
//           >
//             Recipe's wheel
//           </NavLink>
//         </li>
//         {isConnected ? (
//           <li>
//             <NavLink
//               to="/calendar"
//               className={({ isActive }) =>
//                 isActive ? "activeLink" : undefined
//               }
//             >
//               Calendar
//             </NavLink>
//           </li>
//         ) : (
//           null
//         )}
//         <li className="navbar-links__li">
//           {isConnected ? (
//             <img className="navbar-links__li-img" src={login} alt="login" onClick={() => handleClickMenu()} />
//           ) : (
//             <NavLink to="/login">
//               <img className="navbar-links__li-img" src={login} alt="login"/>
//             </NavLink>
//           )}
//         </li>
//       </ul>
//     </div>
//   </div>
// );
// };

export default Navbar;
