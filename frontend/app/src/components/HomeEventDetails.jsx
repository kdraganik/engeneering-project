import  { Grid, Paper, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import TaskTable from './tables/TaskTable';
import { Link } from 'react-router-dom'
import { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const useStyles = makeStyles({
  eventBox: {
    width: '100%',
    marginTop: '20px',
  },
  card: {
    display: 'flex',
    backgroundColor: "#292929",
    color: "#f3f3f3"
  },
  eventDetails: {
    color: "#c2c2c2",
    marginBottom: "20px"
  },
  cardDetails: {
    flex: 1,
  },
  paperStyles: {
    padding: "10px",
    borderRadius: "0.5px"
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  }
});

export default function HomeEventDetails({ eventData }){

  const userData = useContext(UserContext);

  const { name, place } = eventData;
  const parsedDate = new Date(eventData.date);
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octorber", "November", "December"] 
  const dateString = `${monthName[parsedDate.getUTCMonth()]} ${parsedDate.getUTCDate()} ${parsedDate.getUTCFullYear()}`;
  const timeString = `${parsedDate.getUTCHours()}:${(parsedDate.getMinutes()<10?'0':'') + parsedDate.getMinutes()}`;

  const [tasksData, setTasksData] = useState([])
  
  const getTasksData = useCallback(async () => {
    eventData.Tasks = await Promise.all(eventData.Tasks.map(async task => {
      const taskResponse =  await axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/tasks/${task.id}`
      })
      return taskResponse.data;
    }))
    setTasksData(eventData.Tasks.filter(task => task.Users.some(user => user.id === userData.id)))
  }, [userData, eventData])

  useEffect(() => {
    getTasksData()
  }, [getTasksData])

  const classes = useStyles();

  return(
    <Grid item className={classes.eventBox}>
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent>
            <Link className={classes.link} to={`event/${ eventData.id }`}>
              <Typography component="h2" variant="h5">
                Event: {name}
              </Typography>
              <Typography className={classes.eventDetails} variant="subtitle1">
                {place}, {dateString} @ {timeString}
              </Typography>
            </Link>
            {
              tasksData.length > 0 ? 
              <TaskTable tasks={ tasksData }/> 
              : 
              <Paper className={classes.paperStyles}>
                <Typography type="p" variant="body1">
                  You don't have assigned tasks in this event
                </Typography>
              </Paper>
            }
          </CardContent>
        </div>
      </Card>
    </Grid>
  )
}