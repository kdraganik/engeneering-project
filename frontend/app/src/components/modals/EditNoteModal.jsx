import { useState, useContext } from 'react';
import { UserContext } from "../../context/userContext";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography} from '@material-ui/core';
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: 'yellow'
  },
  input: {
    marginBottom: '15px'
  },
  error: {
    marginTop: '5px',
    color: "red"
  },
  removeButton: {
    color: "red"
  }
})

export default function EditNoteModal({ children, eventData, noteData, refresh }) {

  const userData = useContext(UserContext)

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const putNote = async () => {
    if(title && content){
      setError("")
      setIsLoading(true)
      axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'put',
        url: `http://localhost:8080/notes/${noteData.id}/edit`,
        data: {
          title,
          content,
          EventId: eventData.id
        }
      }).then( async (response) => {
        setIsLoading(false)
        handleClose()
        refresh()
      }).catch(error => {
        console.log(error)
        setIsLoading(false)
        const errorPayload = error.response;
      if(errorPayload && errorPayload.data.message){
        setError(errorPayload.data.message);
      }
        else{
          setError("We're having some error issuses, please try again later");
        }
      })
    }
    else{
      setError("Check values of all the fields");
    }
  }

  const deleteNote = async () => {
    if(title && content){
      setError("")
      setIsLoading(true)
      axios({
        method: 'delete',
        url: `http://localhost:8080/notes/${noteData.id}/delete`,
      }).then( async (response) => {
        setIsLoading(false)
        refresh()
      }).catch(error => {
        console.log(error)
        setIsLoading(false)
        const errorPayload = error.response;
      if(errorPayload && errorPayload.data.message){
        setError(errorPayload.data.message);
      }
        else{
          setError("We're having some error issuses, please try again later");
        }
      })
    }
    else{
      setError("Check values of all the fields");
    }
  }

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(noteData.title);
  const [content, setContent] = useState(noteData.content);

  const classes = useStyles();

  return (
    <>
      <div onClick={handleClickOpen}>
        { children }
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.dialog} id="form-dialog-title">Edit note</DialogTitle>
        <DialogContent className={classes.dialog}>
          <TextField
            autoFocus
            className={classes.input}
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={ event => setTitle(event.currentTarget.value) }
          />
          <TextField
            id="content"
            label="Content"
            type="text"
            fullWidth
            value={content}
            onChange={ event => setContent(event.currentTarget.value) }
            multiline
            rows={10}
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
        <DialogActions className={classes.dialog}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteNote} className={classes.removeButton}>
            Remove
          </Button>
          {
          isLoading ?
          <CircularProgress />
          :
          <Button onClick={putNote} color="primary">
            Edit
          </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}