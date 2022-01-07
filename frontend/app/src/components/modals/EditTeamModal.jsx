import { useState, useContext } from 'react';
import { UserContext } from "../../context/userContext";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography } from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';
import TeamMembersTable from '../tables/TeamMembersTable';

const useStyles = makeStyles({
  input: {
    marginBottom: '5px'
  },
  error: {
    marginTop: '5px',
    color: "red"
  }
})

export default function EditTeamModal({ label, teamData, refresh }) {

  const userData = useContext(UserContext)
  
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [name, setName] = useState(teamData.name);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const putTeam = async () => {
    if(name){
      setError("")
      setIsLoaded(true)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'put',
        url: `http://localhost:8080/teams/${teamData.id}/edit`,
        data: {
          name
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
        <DialogTitle id="form-dialog-title">Edit team</DialogTitle>
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
          <TeamMembersTable teamData={ teamData }/>
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
          <Button onClick={putTeam} color="primary">
            Save
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}