import { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography} from '@material-ui/core';
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

export default function AddTeamModal({ getAdminData }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postUser = async () => {
    if(name){
      setError("")
      setIsLoading(true)
      axios({
        method: 'post',
        url: `http://localhost:8080/teams/create`,
        data: {
          name
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
          setError("We're having some error issuses, please try again later");
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

  const classes = useStyles();

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        + Dodaj zespół
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Dodaj zespół</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            label="Nazwa"
            type="text"
            fullWidth
            value={name}
            onChange={ event => setName(event.currentTarget.value) }
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
          <Button onClick={postUser} color="primary">
            Dodaj
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}