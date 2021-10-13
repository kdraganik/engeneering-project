import { useState } from 'react';
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

export default function AddTaskModal({ label, task, eventData, refresh }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postTask = async () => {
    if(name && priority && date){
      setError("")
      setIsLoading(true)
      axios({
        method: 'post',
        url: `http://localhost:8080/tasks/create`,
        data: {
          name,
          priority,
          date,
          ...(task && { TaskId: task.id }),
          EventId: eventData.id
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
  const [name, setName] = useState("");
  const [date, setDate] = useState(null);
  const [priority, setPriority] = useState("");

  const classes = useStyles();

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {label}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add task</DialogTitle>
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
            id="date"
            label="Date"
            type="datetime-local"
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
              <option value={"high"}>High</option>
              <option value={"normal"}>Normal</option>
              <option value={"low"}>Low</option>
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
          isLoading ?
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