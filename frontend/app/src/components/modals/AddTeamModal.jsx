import { useState, useContext } from 'react';
import { UserContext } from "../../context/userContext";
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

  const userData = useContext(UserContext)

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

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
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
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
        +Add team
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add team</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="name"
            label="Name"
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
            Cancel
          </Button>
          {
          isLoading ?
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