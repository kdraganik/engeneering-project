import { useEffect, useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography, Badge, IconButton, AppBar, Toolbar} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../context/userContext';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#292929'
  },
  input: {
    marginBottom: '5px'
  },
  error: {
    marginTop: '5px',
    color: "red"
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

export default function Header({ title, setUser }) {

  const userData = useContext(UserContext);

  const classes = useStyles();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [overdueTasks, setOverdueTasks] = useState([]);

  useEffect(() => {
    axios({
      headers: {
        Authorization: `Bearer ${userData.token}`
      },
      method: 'get',
      url: `http://localhost:8080/users/${userData.id}/overdueTasks`
    })
    .then(response => { setOverdueTasks(response.data) })
    .catch(error => console.error(error));
  }, [userData])


  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [phoneNumber, setPhoneNumber] = useState(userData.phoneNumber);
  const [password, setPassword] = useState("");
  useEffect(() => {
    axios({
      headers: {
        Authorization: `Bearer ${userData.token}`
      },
      method: 'get',
      url: `http://localhost:8080/users/${userData.id}`
    })
    .then(response => { 
      setFirstName(response.data.firstName)
      setLastName(response.data.lastName)
      setEmail(response.data.email)
      setPhoneNumber(response.data.phoneNumber)
    })
    .catch(error => console.error(error));
  }, [userData])

  const postUser = async () => {
    try{
      if(firstName && lastName && email && phoneNumber){
        setError("")
        setIsLoaded(true)
        await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'put',
          url: `http://localhost:8080/users/${userData.id}/edit`,
          data: {
            firstName,
            lastName,
            email,
            phoneNumber,
            ...(password && { password })
          }
        })
        setIsLoaded(false)
        handleModalClose()
      }
      else{
        setError("Enter values in all fields");
      }
    }
    catch(err){
      setIsLoaded(false)
      const errorPayload = err.response.data.message;
      if(errorPayload){
        setError(errorPayload);
      }
      else{
        setError("Unexpected server error, please try again later");
      }
    }
  }

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

  const handleModalOpen = () => {
    setOpen(true);
    handleMenuClose()
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const menuId = 'primary-search-account-menu';
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
    <Menu
      anchorEl={menuAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={ handleModalOpen }>Edit profile</MenuItem>
      {userData.role === "Admin" ? <MenuItem component={ Link } to="/admin" onClick={ handleMenuClose }>Admin panel</MenuItem> : ""}
      <MenuItem onClick={ () => setUser({}) }>Logout</MenuItem>
    </Menu>
    <Dialog open={open} onClose={ handleModalClose } aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit user</DialogTitle>
      <DialogContent>
        <TextField
          className={classes.input}
          autoFocus
          id="firstName"
          label="First name"
          type="text"
          fullWidth
          value={firstName}
          onChange={ event => setFirstName(event.currentTarget.value) }
        />
        <TextField
          className={classes.input}
          id="lastName"
          label="Last name"
          type="text"
          fullWidth
          value={lastName}
          onChange={ event => setLastName(event.currentTarget.value) }
        />
        <TextField
          className={classes.input}
          id="email"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={ event => setEmail(event.currentTarget.value) }
        />
        <TextField
          className={classes.input}
          id="phone"
          label="Phone number"
          type="text"
          fullWidth
          value={phoneNumber}
          onChange={ event => setPhoneNumber(event.currentTarget.value) }
        />
        <TextField
          className={classes.input}
          id="password"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={ event => setPassword(event.currentTarget.value) }
        />
        {
          error ?
          <Typography className={classes.error} component="p" variant="body1" align="center">
            {error}
          </Typography>
          :
          ""          
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="primary">
          Cancel
        </Button>
        {
        isLoaded ?
        <CircularProgress />
        :
        <Button onClick={postUser} color="primary">
          Save
        </Button>
        }
      </DialogActions>
    </Dialog>
    {renderMobileMenu}
    {renderNotifications}
  </div>
  );
}