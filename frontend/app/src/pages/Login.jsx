import { useState } from 'react';
import axios from 'axios'
import { Grid, Paper, Avatar, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const useStyles = makeStyles(() => ({
  outerGrid:{
    height: '100vh',
    backgroundColor: '#292929'
  },
  innerGrid:{
    padding: '25px',
  },
  avatar:{
    backgroundColor: '#292929'
  },
  header:{
    marginBottom: '10px'
  },
  button:{
    marginTop: '15px',
    color: '#fff',
    backgroundColor: '#292929',
    '&:hover': {
      backgroundColor: '#353535',
    }
  },
  error: {
    color: "red"
  }
}));

export default function Login({ setUser }){
  const classes = useStyles();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }
  
  const [password, setPassword] = useState("");
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: 'post',
      url: 'http://localhost:8080/login',
      data: {
        email,
        password
      }
    })
    .then(response => setUser(response.data))
    .catch(error => {
      const errorPayload = error.response;
      if(errorPayload && errorPayload.data.message){
        setError(errorPayload.data.message);
      }
      else{
        setError("There was a problem with server connection, please try again later");
      }
    })
  }

  return(
    <Grid className={classes.outerGrid} container alignItems="center" justifyContent="center" direction="column">
      <Grid className={classes.innerGrid} component={Paper} item container alignItems="center" justifyContent="center" direction="column" xs={10} md={8} lg={5} xl={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography className={classes.header} component="h1" variant="h6" align="center">
          App suporting events organization
        </Typography>
        <form  onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
          />
          {
            error ?
            <Typography className={classes.error} component="p" variant="body1" align="center">
              {error}
            </Typography>
            :
            ""          
          }
          <Button
            className={classes.button}
            type="submit"
            fullWidth
            variant="contained"
          >
            Log in
          </Button>
        </form>
      </Grid>
    </Grid>
  )
}