import React, { useState } from 'react';
import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';

const useStyles = makeStyles({
  paperStyles: {
    width: "100%"
  },
  gridContainer: {
    height: "100%"
  },
  commentsGrid: {
    padding: "20px",
    height: "519px",
    overflowY: 'scroll'
  },
  inputBox: {
    padding: "15px"
  },
  commentBox: {
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: '#424242'
  },
  commentAuthor: {
    color: '#3f51b5'
  },
  commentContent: {
    color: "#fff"
  },
  commentDetails: {
    color: '#cdcdcd'
  }
});

export default function TaskComments({ taskData, getTaskData }) {
  const classes = useStyles();

  const { Comments } = taskData;

  const [content, setContent] = useState("")
  const userData = useContext(UserContext);
  
  const handleSendComment = async () => {
    try{
      await axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'post',
        url: `http://localhost:8080/comments/create`,
        data: {
          content,
          UserId: userData.id,
          TaskId: taskData.id
        }
      })
      getTaskData()
    }
    catch(err){
      console.error(err);
    }
  }

  const renderComment = comment => {
    
    const author = userData.id === comment.User.id ? "Me" : `${comment.User.firstName} ${comment.User.lastName}`;
    const date = new Date(comment.date);
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"]
    const dateString = `${date.getUTCDate()} ${monthName[date.getUTCMonth()]} ${date.getUTCFullYear()} at ${date.getUTCHours()}:${date.getUTCMinutes()}`;
    return (
      <Grid key={comment.id} item container alignItems="flex-start" justifyContent={userData.id === comment.User.id ? "flex-end" : "flex-start"} xs={12}>
        <Grid className={classes.commentBox} component={Paper} item container align={userData.id === comment.User.id ? "right" : "left"} xs={7}>
          <Grid className={classes.commentAuthor} item xs={12}>
            <Typography type="p" variant="body1">
              {author}
            </Typography>
          </Grid>
          <Grid className={classes.commentContent} item xs={12}>
            <Typography type="p" variant="h6">
              {comment.content}
            </Typography>
          </Grid>
          <Grid className={classes.commentDetails} item xs={12}>
          <Typography type="p" variant="body1">
              {dateString}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
  <Grid container className={classes.commentsBox}>
    <Paper className={classes.paperStyles}>
      <Grid className={classes.gridContainer} container direction="column" justifyContent="flex-start">
        <Grid className={classes.commentsGrid} container direction="row" alignContent='flex-start'>
          { 
            Comments.length > 0 ?
            Comments.map( renderComment )
            :
            <Grid container justifyContent="center" alignItems="center">
              <Typography type="p" variant="body1">
                No comments
              </Typography>
            </Grid>
          }
        </Grid>
        <Grid item container className={classes.inputBox}>
          <Grid item xs={11}>
            <TextField id="outlined-basic-email" label="Your comment" fullWidth value={content} onChange={ e => setContent(e.currentTarget.value) }/>
          </Grid>
          <Grid item xs={1} align="right">
            <Fab onClick={ handleSendComment } aria-label="add"><SendIcon /></Fab>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  </ Grid>
  );
}
