import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography } from '@material-ui/core';
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

export default function AddEventModal({ refresh }) {

  const userData = useContext(UserContext)

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const currDate = new Date()
  currDate.setMinutes(currDate.getMinutes() - currDate.getTimezoneOffset())
  const [date, setDate] = useState(currDate.toISOString().slice(0, -8));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postEvent = async () => {
    if(name && place && date){
    setIsLoaded(true)
      setError("");
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'post',
        url: `http://localhost:8080/events/create`,
        data: {
          name,
          place,
          date
        }
      }).then((response) => {
        setIsLoaded(false)
        refresh()
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
        +Add Event
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New Event</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.input}
            autoFocus
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={ event => setName(event.currentTarget.value) }
          />
          <TextField
            className={classes.input}
            id="place"
            label="Place"
            type="text"
            fullWidth
            value={place}
            onChange={ event => setPlace(event.currentTarget.value) }
          />
          <TextField
            className={classes.input}
            id="date"
            label="Date"
            type="datetime-local"
            fullWidth
            value={date}
            onChange={ event => {setDate(event.currentTarget.value)}}
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {
          isLoaded ?
          <CircularProgress />
          :
          <Button onClick={postEvent} color="primary">
            Add
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}