import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#292929'
  },
  homeButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function Header({ title, user, setUser }) {
  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);

  useEffect(() => {
  axios({
    method: 'get',
    url: `http://localhost:8080/users/${user.id}`
  })
  .then(response => {
    const overdueTasks = []
    response.data.Events.forEach(event => overdueTasks.push(...event.Tasks.filter(task => new Date(task.date) < Date.now())))
    setOverdueTasks(overdueTasks)
  })
  .catch(error => console.error(error));
  }, [user])

  const isMenuOpen = Boolean(menuAnchorEl);
  const isNotificationOpen = Boolean(notificationAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMenuOpen = (event) => {
  setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
  setMenuAnchorEl(null);
  handleMobileMenuClose();
  };

  const handleNotificationClose = () => {
  setNotificationAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
  setNotificationAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
  setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
  setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
  <Menu
    anchorEl={menuAnchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    id={menuId}
    keepMounted
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={isMenuOpen}
    onClose={handleMenuClose}
  >
    <MenuItem onClick={handleMenuClose}>Edit profile</MenuItem>
    {user.role === "Admin" ? <MenuItem component={ Link } to="/admin" onClick={handleMenuClose}>Admin panel</MenuItem> : ""}
    <MenuItem onClick={ () => setUser({}) }>Logout</MenuItem>
  </Menu>
  );

  const notificationsId = 'primary-search-notifications-list';
  const renderNotifications = (
  <Menu
    anchorEl={notificationAnchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    id={notificationsId}
    keepMounted
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={isNotificationOpen}
    onClose={handleNotificationClose}
  >
    {overdueTasks.map(task => 
      <MenuItem 
        key={task.id} 
        style={{color: "red"}} 
        component={ Link } 
        to={`/task/${task.id}`} 
        onClick={handleNotificationClose}
      >
        Overdue task: {task.name}
      </MenuItem>)}
  </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
  <Menu
    anchorEl={mobileMoreAnchorEl}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    id={mobileMenuId}
    keepMounted
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    open={isMobileMenuOpen}
    onClose={handleMobileMenuClose}
  >
    <MenuItem onClick={handleNotificationOpen}>
    <IconButton aria-label="show new notifications" color="inherit">
      {
      overdueTasks ?
      <Badge badgeContent={overdueTasks.length} color="secondary">
        <NotificationsIcon />
      </Badge>
      :
      <NotificationsIcon />
      }
    </IconButton>
    <p>Notifications</p>
    </MenuItem>
    <MenuItem onClick={handleMenuOpen}>
    <IconButton
      aria-label="account of current user"
      aria-controls="primary-search-account-menu"
      aria-haspopup="true"
      color="inherit"
    >
      <AccountCircle />
    </IconButton>
    <p>Profile</p>
    </MenuItem>
  </Menu>
  );

  return (
  <div className={classes.grow}>
    <AppBar className={classes.header} position="static">
    <Toolbar>
      <IconButton
      edge="start"
      className={classes.homeButton}
      color="inherit"
      aria-label="open drawer"
      component={ Link } 
      to="/"
      >
      <HomeIcon />
      </IconButton>
      <Typography className={classes.title} variant="h6" noWrap>
      {title}
      </Typography>
      <div className={classes.grow} />
      <div className={classes.sectionDesktop}>
      <IconButton aria-label="show new notifications" color="inherit" onClick={handleNotificationOpen}>
      {
        overdueTasks ?
        <Badge badgeContent={overdueTasks.length} color="secondary">
        <NotificationsIcon />
        </Badge>
        :
        <NotificationsIcon />
      }
      </IconButton>
      <IconButton
      edge="end"
      aria-label="account of current user"
      aria-controls={menuId}
      aria-haspopup="true"
      onClick={handleMenuOpen}
      color="inherit"
      >
      <AccountCircle />
      </IconButton>
      </div>
      <div className={classes.sectionMobile}>
      <IconButton
        aria-label="show more"
        aria-controls={mobileMenuId}
        aria-haspopup="true"
        onClick={handleMobileMenuOpen}
        color="inherit"
      >
        <MoreIcon />
      </IconButton>
      </div>
    </Toolbar>
    </AppBar>
    {renderMobileMenu}
    {renderMenu}
    {renderNotifications}
  </div>
  );
}