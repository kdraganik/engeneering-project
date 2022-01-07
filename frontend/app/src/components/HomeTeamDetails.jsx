import  { Grid, Paper, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import TaskTable from './tables/TaskTable';
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

export default function HomeTeamDetails({ teamData }){

  const userData = useContext(UserContext);

  const { name } = teamData;

  const [tasksData, setTasksData] = useState([])
  
  const getTasksData = useCallback(async () => {
    teamData.Tasks = await Promise.all(teamData.Tasks.map(async task => {
      const taskResponse =  await axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/tasks/${task.id}`
      })
      return taskResponse.data;
    }))
    setTasksData(teamData.Tasks.filter(task => task.Users.some(user => user.id === userData.id)))
  }, [userData, teamData])

  useEffect(() => {
    getTasksData()
  }, [getTasksData])

  const classes = useStyles();

  return(
    <Grid item className={classes.eventBox}>
      <Card className={classes.card}>
        <div className={classes.cardDetails}>
          <CardContent>
            <Typography component="h2" variant="h5">
              {name}
            </Typography>
            {
              tasksData.length > 0 ? 
              <TaskTable tasks={ tasksData }/> 
              : 
              <Paper className={classes.paperStyles}>
                <Typography type="p" variant="body1">
                  You don't have assigned tasks in this team
                </Typography>
              </Paper>
            }
          </CardContent>
        </div>
      </Card>
    </Grid>
  )
}