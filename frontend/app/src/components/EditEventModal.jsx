import { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography } from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import EvenetAssignedTable from './EventAssignedTable';

const useStyles = makeStyles({
  input: {
    marginBottom: '5px'
  },
  error: {
    marginTop: '5px',
    color: "red"
  }
})

export default function EditTeamModal({ label, data, teams,  refresh }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const putTeam = async () => {
    if(name){
      setError("")
      setIsLoading(true)
      axios({
        method: 'put',
        url: `http://localhost:8080/events/${data.id}/edit`,
        data: {
          name
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
  const [name, setName] = useState(data.name);
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(null);


  const eventTeamIds = data.teams.map(team => team.id);

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
            id="name"
            label="Nazwa"
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
          <EvenetAssignedTable teams={ teams } event={ data } eventTeamIds={ eventTeamIds } refresh={ refresh } />
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
          <Button onClick={putTeam} color="primary">
            Zapisz
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}