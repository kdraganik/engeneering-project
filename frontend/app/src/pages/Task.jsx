import { useCallback, useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useParams } from "react-router"
import axios from "axios";
import { Container, Grid, CircularProgress, Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/core";
import TaskDetails from "../components/TaskDetails";
import TaskComments from "../components/TaskComments";
import EditTaskModal from "../components/modals/EditTaskModal";
import { Link } from "react-router-dom"


const useStyles = makeStyles(() => ({
  container:{
    padding: '25px',
  },
  loaderGrid:{
    height: '85vh'
  },
  card: {
    backgroundColor: '#292929'
  },
  cardTitle:{
    color: '#fff',
  },
  gridTopA: {
    marginBottom: "12px"
  },
  gridTopB: {
    marginBottom: "30px"
  },
  breadCrumbsType:{
    fontSize: "0.8em", 
    color: "white"
  },
}));

export default function Task({ setTitle }){

  const {id} = useParams();
  const userData = useContext(UserContext) 

  const [taskData, setTaskData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const getTaskData = useCallback(async () => {
    try{
      setIsLoaded(false)
      const response = await axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/tasks/${id}`
      })
      const tempData = response.data;
      tempData.Users = await Promise.all(tempData.Users.map(async user => {
        const userResponse =  await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/users/${user.id}`
        })
        return userResponse.data;
      }))
      tempData.Tasks = await Promise.all(tempData.Tasks.map(async task => {
        const taskResponse =  await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/tasks/${task.id}`
        })
        return taskResponse.data;
      }))
      tempData.Comments = await Promise.all(tempData.Comments.map(async comment => {
        const commentResponse =  await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/comments/${comment.id}`
        })
        const userResponse = await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/users/${commentResponse.data.UserId}`
        })
        commentResponse.data.User = userResponse.data;
        return commentResponse.data;
      }))
      if(tempData.TeamId){
        const teamResponse = await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/teams/${tempData.TeamId}`
        })
        tempData.Team = teamResponse.data;
      }
      if(tempData.EventId){
        const eventResponse = await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/events/${tempData.EventId}`
        })
        tempData.Event = eventResponse.data;
      }
      if(tempData.TaskId){
        const taskResponse = await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/tasks/${tempData.TaskId}`
        })
        tempData.Task = taskResponse.data;
      }
      setTaskData(tempData);
      setTitle(response.data.name)
      setIsLoaded(true)
    }
    catch(err){
      console.error(err);
    }
  }, [userData, id, setTitle])

  useEffect(() => {
    getTaskData()
  }, [getTaskData])

  const classes = useStyles();
  return(
    <Container className={classes.container} maxWidth="xl">
      {
        !isLoaded ?
        <Grid className={classes.loaderGrid} container justifyContent="center" alignItems="center">
          <CircularProgress />
        </Grid>
        :
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <div>
                <CardContent>
                  <Grid className={classes.gridTopA} container direction="row" alignItems="center" justifyContent="space-between">
                    <Grid>
                      <Typography className={classes.cardTitle} component="h2" variant="h5">
                        Details
                      </Typography>
                      <Typography className={classes.breadCrumbsType}><Link className={classes.breadCrumbsType} to={`/event/${taskData.Event.id}`}>{ taskData.Event.name }</Link> {taskData.Task ? <> / <Link className={classes.breadCrumbsType} to={`/task/${taskData.Task.id}`}>{ taskData.Task.name }</Link></> : "" } </Typography>
                    </Grid>
                    {userData.role === "Admin" || userData.role === "Leader" ? <EditTaskModal label={"Edit task"} taskData={ taskData } refresh={ getTaskData }/> : ""}
                  </Grid>
                  <TaskDetails taskData={ taskData } getTaskData={ getTaskData }/>
                </CardContent>
              </div>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <div>
                <CardContent>
                  <Grid className={classes.gridTopB} container direction="row" alignItems="center" justifyContent="space-between">
                    <Typography className={classes.cardTitle} component="h2" variant="h5">
                      Comments
                    </Typography>
                  </Grid>
                  <TaskComments taskData={ taskData } getTaskData={ getTaskData } />
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
      }
    </Container>
  )
}