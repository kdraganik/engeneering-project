import { useState, useContext } from 'react';
import { UserContext } from "../../context/userContext";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, FormControl, InputLabel, Select, Typography } from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  input: {
    marginBottom: '5px'
  },
  error: {
    marginTop: '5px',
    color: "red"
  }
})

export default function AddUserModal({ getAdminData }) {

  const userData = useContext(UserContext)

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postUser = async () => {
    if(firstName && lastName && email && phoneNumber && password && role){
      setError("")
      setIsLoaded(true)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'post',
        url: `http://localhost:8080/users/create`,
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          password
        }
      }).then( async (response) => {
        setIsLoaded(false)
        handleClose()
        await getAdminData()
      }).catch(error => {
        setIsLoaded(false)
        const errorPayload = error.response.data.message;
        if(errorPayload){
          setError(errorPayload);
        }
        else{
          setError("Unexpected server error, please try again later");
        }
      })
    }
    else{
      setError("Enter values in all fields");
    }
  }

  const classes = useStyles();

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        +Add User
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add user</DialogTitle>
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
          <FormControl fullWidth>
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              native
              value={role}
              onChange={event => setRole(event.currentTarget.value)}
              inputProps={{
                name: 'role',
                id: 'role',
              }}
            >
              <option value={"Admin"}>Admin</option>
              <option value={"Leader"}>Leader</option>
              <option value={"User"}>User</option>
            </Select>
          </FormControl>
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {
          isLoaded ?
          <CircularProgress />
          :
          <Button onClick={postUser} color="primary">
            Add
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}