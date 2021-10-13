import { useState } from 'react';
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

export default function EditUserModal({ label, data, refresh }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const putUser = async () => {
    if(firstName && lastName && email && phoneNumber && role){
      setError("")
      setIsLoading(true)
      axios({
        method: 'put',
        url: `http://localhost:8080/users/${data.id}/edit`,
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          password
        }
      }).then( async (response) => {
        setIsLoading(false)
        handleClose()
        await refresh()
      }).catch(error => {
        setIsLoading(false)
        const errorPayload = error.response.data.message;
        if(errorPayload){
          setError(errorPayload);
        }
        else{
          setError("Wystąpił problem z serwerem, spróbuj później");
        }
      })
    }
    else{
      setError("Wprowadź wartości do wszytskich pól");
    }
  }

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [email, setEmail] = useState(data.email);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(data.role);

  const classes = useStyles();

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        { label }
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Dodaj użytkownika</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.input}
            autoFocus
            id="firstName"
            label="Imię"
            type="text"
            fullWidth
            value={firstName}
            onChange={ event => setFirstName(event.currentTarget.value) }
          />
          <TextField
            className={classes.input}
            id="lastName"
            label="Nazwisko"
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
            label="Numer telefonu"
            type="text"
            fullWidth
            value={phoneNumber}
            onChange={ event => setPhoneNumber(event.currentTarget.value) }
          />
          <TextField
            className={classes.input}
            id="password"
            label="Hasło"
            type="password"
            fullWidth
            value={password}
            onChange={ event => setPassword(event.currentTarget.value) }
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="role">Age</InputLabel>
            <Select
              native
              value={role}
              onChange={event => setRole(event.currentTarget.value)}
              inputProps={{
                name: 'role',
                id: 'role',
              }}
            >
              <option value={"Admin"}>Administrator</option>
              <option value={"Lider"}>Lider</option>
              <option value={"User"}>Użytkownik</option>
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
            Anuluj
          </Button>
          {
          isLoading ?
          <CircularProgress />
          :
          <Button onClick={putUser} color="primary">
            Zapisz
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}