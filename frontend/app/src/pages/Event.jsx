import { useCallback, useEffect, useState, useContext } from "react";
import { UserContext } from "../context/userContext";
import { useParams } from "react-router";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from "@material-ui/core";
import EventDetails from "../components/EventDetails";
import TaskTable from "../components/tables/TaskTable";
import EventNotes from "../components/EventNotes";
import AddTaskModal from "../components/modals/AddTaskModal";
import AddNoteModal from "../components/modals/AddNoteModal";
import EditEventModal from "../components/modals/EditEventModal";

const useStyles = makeStyles({
  container:{
    padding: '25px',
  },
  loaderGrid:{
    height: '85vh'
  },
  card: {
    display: 'flex',
    backgroundColor: "#292929",
    color: "#f3f3f3"
  },
  cardDetails: {
    flex: 1,
  },
  gridTop: {
    marginBottom: "25px"
  },
  gridTopTasks: {
    marginTop: "5px"
  }
});

export default function Event({ setTitle }){

  const {id} = useParams();
  const userData = useContext(UserContext)

  const [isLoaded, setIsLoaded] = useState(false);
  const [eventData, setEventData] = useState({});

  const getEventData = useCallback(async () => {
    try{
      setIsLoaded(false)
      const response = await axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/events/${id}`
      })
      const tempData = response.data
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
      tempData.Notes = await Promise.all(tempData.Notes.map(async note => {
        const noteResponse =  await axios({
          headers: {
            Authorization: `Bearer ${userData.token}`
          },
          method: 'get',
          url: `http://localhost:8080/notes/${note.id}`
        })
        return noteResponse.data;
      }))
      setEventData(tempData);
      setTitle(tempData.name)
      setIsLoaded(true)
    }
    catch(err){
      console.error(err);
    }
  }, [userData, id, setTitle])

  useEffect(() => {
    getEventData()
  }, [id, getEventData])

  const classes = useStyles();

  return(
    <Container className={classes.container} maxWidth="xl">
    {
      !isLoaded ?
      <Grid className={classes.loaderGrid} container justifyContent="center" alignItems="center">
        <CircularProgress />
      </Grid>
      :
      <Grid container item md={12} spacing={1}>
        <Grid item xs={12} md={3}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                  <Typography component="h2" variant="h5">
                    {"Details"}
                  </Typography>
                  {userData.role === "User" ? " " : <EditEventModal label={ "Edit event" } eventData={ eventData } refresh={ getEventData }/> }
                </Grid>
                <EventDetails eventData={ eventData }/>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item xs= {12} md={9}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Grid className={classes.gridTopTasks} container direction="row" alignItems="center" justifyContent="space-between">
                  <Typography className={classes.cardTitle} component="h2" variant="h5">
                    Tasks
                  </Typography>
                  {userData.role === "User" ? " " :<AddTaskModal label={"+Add task"} eventId={ eventData.id } refresh={ getEventData }/>}
                </Grid>
                <TaskTable tasks={ eventData.Tasks } showClosed={true}/>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item className={classes.eventBox} xs={12}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                  <Typography component="h2" variant="h5">
                    {"Notes"}
                  </Typography>
                  <AddNoteModal eventData={ eventData } refresh={ getEventData }/>
                </Grid>
                <EventNotes notes={ eventData.Notes } eventData={ eventData } refresh={ getEventData } />
              </CardContent>
            </div>
          </Card>
        </Grid>
      </Grid>
    }
    </Container>
  )
}