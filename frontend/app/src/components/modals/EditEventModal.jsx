import { useState, useContext } from 'react';
import { UserContext } from "../../context/userContext";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography } from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import EventAssigneeTable from '../tables/EventAssigneeTable';

const useStyles = makeStyles({
  input: {
    marginBottom: '5px'
  },
  error: {
    marginTop: '5px',
    color: "red"
  }
})

export default function EditTeamModal({ label, eventData, refresh }) {

  const userData = useContext(UserContext)

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState(eventData.name);
  const [place, setPlace] = useState(eventData.place);
  const [date, setDate] = useState(eventData.date.slice(0, -1));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const putEvent = async () => {
    if(name){
      setError("")
      setIsLoaded(true)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'put',
        url: `http://localhost:8080/events/${eventData.id}/edit`,
        data: {
          name,
          place,
          date
        }
      }).then( async (response) => {
        setIsLoaded(false)
        handleClose()
        await refresh()
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
        { label }
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit event</DialogTitle>
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
          <EventAssigneeTable eventData={ eventData } refresh={ refresh } />
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
          <Button onClick={putEvent} color="primary">
            Save
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}