import { useEffect, useState, useContext } from 'react';
import { UserContext } from "../../context/userContext";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, FormControl, InputLabel, Select, Typography } from '@material-ui/core';
import TaskAssigneeTable from '../tables/TaskAssigneeTable';
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

export default function EditTaskModal({ label, taskData, refresh }) {

  const userData = useContext(UserContext)

  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(taskData.name);
  const [description, setDescription] = useState(taskData.description);
  const [date, setDate] = useState(taskData.date.slice(0, -1));
  const [teamsArray, setTeamsArray] = useState([]);
  const [teamId, setTeamId] = useState(taskData.TeamId || 0);
  const [priority, setPriority] = useState(taskData.priority);

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

  const putTask = async () => {
    if(name && priority && date && description){
      if(taskData.TeamId !== teamId){
        await Promise.all(taskData.Users.map( async user => {
          axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'put',
            url: `http://localhost:8080/tasks/${taskData.id}}/removeUser`,
            data: {
              "UserId": user.id
            }
          })
        }))
      }
      setError("")
      setIsLoaded(false)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'put',
        url: `http://localhost:8080/tasks/${taskData.id}/edit`,
        data: {
          name,
          description,
          priority,
          date,
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
        <DialogTitle id="form-dialog-title">Edit task</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.input}
            autoFocus
            id="name"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={ event => setName(event.target.value) }
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
            <InputLabel htmlFor="priority">Priority</InputLabel>
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
            taskData.TeamId && taskData.TeamId === teamId ?
            <TaskAssigneeTable taskData={ taskData } />
            :
            ""
          }
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
          <Button onClick={putTask} color="primary">
            Edit
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}