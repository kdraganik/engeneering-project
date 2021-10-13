import { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography } from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import TeamMembersTable from './TeamMembersTable';

const useStyles = makeStyles({
  input: {
    marginBottom: '5px'
  },
  error: {
    marginTop: '5px',
    color: "red"
  }
})

export default function EditTeamModal({ label, data, users,  refresh }) {
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
        url: `http://localhost:8080/teams/${data.id}/edit`,
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

  const teamUserIds = data.users.map(user => user.id);

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
          <TeamMembersTable users={ users } team={ data } teamUserIds={ teamUserIds } refresh={ refresh } />
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