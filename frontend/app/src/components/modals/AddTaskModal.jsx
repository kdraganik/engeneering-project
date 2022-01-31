import { useState, useEffect, useContext } from 'react';
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

export default function AddTaskModal({ label, taskId, eventId, parentTeamId, refresh }) {

  const userData = useContext(UserContext)

  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const currDate = new Date()
  currDate.setMinutes(currDate.getMinutes() - currDate.getTimezoneOffset())
  const [date, setDate] = useState(currDate.toISOString().slice(0, -8));
  const [teamsArray, setTeamsArray] = useState([]);
  const [teamId, setTeamId] = useState(parentTeamId || 0);
  const [priority, setPriority] = useState("low");

  useEffect(() => {
    try{
      setIsLoaded(false)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/teams`
      }).then(response => {
        setTeamsArray(response.data);
        setIsLoaded(true)
      })
    }
    catch(err){
      console.error(err);
    }
  }, [userData])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postTask = async () => {
    if(name && priority && date && description){
      setError("")
      setIsLoaded(false)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'post',
        url: `http://localhost:8080/tasks/create`,
        data: {
          name,
          description,
          priority,
          date,
          TaskId: taskId,
          EventId: eventId,
          ...(teamId && { TeamId: teamId }),
        }
      }).then( async (response) => {
        setIsLoaded(false)
        handleClose()
        refresh()
      }).catch(error => {
        setIsLoaded(true)
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
        {label}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">New task</DialogTitle>
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
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            minRows={ 1 }
            value={description}
            onChange={ event => setDescription(event.currentTarget.value) }
          />
          <TextField
            className={classes.input}
            id="date"
            type="datetime-local"
            label="Date"
            fullWidth
            value={date}
            onChange={ event => setDate(event.currentTarget.value) }
          />
          <FormControl fullWidth className={classes.input}>
            <InputLabel htmlFor="role">Priority</InputLabel>
            <Select
              native
              value={priority}
              onChange={event => setPriority(event.target.value)}
              inputProps={{
                name: 'priority',
                id: 'priority',
              }}
            >
              <option value={"high"}>high</option>
              <option value={"normal"}>normal</option>
              <option value={"low"}>low</option>
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.input}>
            <InputLabel htmlFor="team">Team</InputLabel>
            <Select
              native
              value={ teamId }
              onChange={event => setTeamId(event.target.value)}
              inputProps={{
                name: 'team',
                id: 'team',
              }}
            >
              <option value={0}>None</option>
              {teamsArray.map( team => <option key={ team.id } value={ team.id }>{ team.name }</option>)}
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
          !isLoaded ?
          <CircularProgress />
          :
          <Button onClick={postTask} color="primary">
            Add
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}