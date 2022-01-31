import { useEffect, useState, useContext, useCallback } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { Container, Grid, CircularProgress, Card, CardContent, Typography, Paper, Button} from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import HomeEventDetails from "../components/HomeEventDetails";
import HomeTeamDetails from "../components/HomeTeamDetails";
import TaskTable from "../components/tables/TaskTable";

const useStyles = makeStyles(() => ({
  container:{
    padding: '25px',
  },
  loaderGrid:{
    height: '85vh'
  },
  taskBox: {
    width: '100%',
    marginTop: '20px',
  },
  card: {
    display: 'flex',
    backgroundColor: "#292929",
    color: "#f3f3f3"
  },
  infoCard: {
    display: 'flex',
    backgroundColor: "#292929",
    color: "#f3f3f3",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  cardDetails: {
    flex: 1,
  },
  paperStyles: {
    padding: "10px",
    borderRadius: "0.5px"
  },
  infoPaperStyles: {
    padding: "25px",
    borderRadius: "0.5px"
  },
  title:{
    marginBottom: "10px"
  },
  loadingInfo:{
    color: "black",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
  ,
  loadingError:{
    color: "red",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  navBar:{
    height: "50px",
    width: "100%"
  },
  buttonStyle:{
    backgroundColor: "#ddd",
    margin: "0 10px"
  },
  buttonStyleActive:{
    backgroundColor: "#222",
    color: "#fff",
    margin: "0 10px"
  }
}));

export default function Home({ setTitle }){

  const userData = useContext(UserContext)

  const updateTitle = () => setTitle("Home page");
  useEffect( updateTitle );

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState("teams")
  const [tasksData, setTasksData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);

  const getHomeData = useCallback(async () => {
    try{
      setIsLoaded(false);
      const userResponse = await axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/users/${userData.id}`
      })
      const tasks = await Promise.all(userResponse.data.Tasks.map(async task => {
        try{
          const response =  await axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'get',
            url: `http://localhost:8080/tasks/${task.id}`
          })
          const responseEvent =  await axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'get',
            url: `http://localhost:8080/events/${response.data.EventId}`
          })
          response.data.event = responseEvent.data;
          return response.data;
        }
        catch(err){
          console.error(err);
        }
      }))
      setTasksData(tasks)
      const events = await axios({
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
        method: 'get',
        url: `http://localhost:8080/users/${userData.id}/getEvents`
      })
      setEventsData(events.data);
      const teams = await Promise.all(userResponse.data.Teams.map(async team => {
        try{
          const response =  await axios({
            headers: {
              Authorization: `Bearer ${userData.token}`
            },
            method: 'get',
            url: `http://localhost:8080/teams/${team.id}`
          })
          return response.data;
        }
        catch(err){
          console.error(err);
        }
      }))
      setTeamsData(teams);
      setIsLoaded(true);
    }
    catch(err){
      console.error(err);
    }
  }, [userData])

  useEffect(() => {
    getHomeData()
  }, [getHomeData])

  const classes = useStyles();

  const renderView = () => {
    if(currentView === "tasks"){
      return (
        tasksData.length === 0 
        ? 
        <Card className={classes.infoCard}>
          <div className={classes.cardDetails}>
            <Paper className={classes.infoPaperStyles}>
              <Typography type="p" variant="body1">
                You don't have any assigned tasks
              </Typography>
            </Paper>
          </div>
        </Card>
        :
        <Grid item className={classes.taskBox}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Typography className={classes.title} component="h2" variant="h5">
                  Your to-do list
                </Typography>
                  <TaskTable tasks={ tasksData } showEvent={true}/> 
              </CardContent>
            </div>
          </Card>
        </Grid>
      )
    }
    if(currentView === "events"){
      return eventsData.map(eventData => <HomeEventDetails key={eventData.id} eventData={ eventData }/>)
    }
    if(currentView === "teams"){
      return teamsData.map(teamData => <HomeTeamDetails key={teamData.id} teamData={ teamData }/>)
    }
    return(
      <Typography className={classes.loadingError} component="h2">Loading error</Typography>
    )
  }

  return(
    <Container maxWidth="xl">
    {
      !isLoaded ?
      <Grid className={classes.loaderGrid} container justifyContent="center" alignItems="center">
        <CircularProgress />
      </Grid>
      :
      <Grid contianer direction="row">
        <Grid item container directio="row" className={classes.navBar} alignItems="center" justifyContent="center">
          <Button 
            className={currentView === "tasks" ? classes.buttonStyleActive : classes.buttonStyle}
            onClick={() => setCurrentView("tasks")}
          >
            Task view
          </Button>
          <Button 
            className={currentView === "events" ? classes.buttonStyleActive : classes.buttonStyle}
            onClick={() => setCurrentView("events")}
          >
            Event view
          </Button>
          <Button 
            className={currentView === "teams" ? classes.buttonStyleActive : classes.buttonStyle}
            onClick={() => setCurrentView("teams")}
          >
            Team view
          </Button>
        </Grid>
        <Grid item container direction="column" justifyContent="center" alignItems="center">
          {renderView()}
        </Grid>
      </Grid>
    }
    </Container>
  )
}