import { useState } from 'react';
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

export default function AddEventModal({ getAdminData }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postEvent = async () => {
    if(name && place && date){
    setIsLoading(true)
      setError("");
      axios({
        method: 'post',
        url: `http://localhost:8080/events/create`,
        data: {
          name,
          place,
          date
        }
      }).then( async (response) => {
        setIsLoading(false)
        handleClose()
        await getAdminData()
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
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(null);

  const classes = useStyles();

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        + Dodaj wydarzenie
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Dodaj wydarzenie</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.input}
            autoFocus
            id="name"
            label="Nazwa wydarzenia"
            type="text"
            fullWidth
            value={name}
            onChange={ event => setName(event.currentTarget.value) }
          />
          <TextField
            className={classes.input}
            id="place"
            label="Miejsce"
            type="text"
            fullWidth
            value={place}
            onChange={ event => setPlace(event.currentTarget.value) }
          />
          <TextField
            className={classes.input}
            id="date"
            label=" "
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
            Anuluj
          </Button>
          {
          isLoading ?
          <CircularProgress />
          :
          <Button onClick={postEvent} color="primary">
            Dodaj
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}