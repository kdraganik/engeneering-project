import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from "@material-ui/core";
import EventDetails from "../components/EventDetails";
import TaskTable from "../components/TaskTable";
import EventNotes from "../components/EventNotes";
import AddTaskModal from "../components/AddTaskModal";
import AddNoteModal from "../components/AddNoteModal";

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
    marginBottom: "20px"
  },
});

export default function Event({ setTitle }){
  const {id} = useParams();

  const [eventData, setEventData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const getEventData = useCallback(async () => {
    const eventResponse = await axios({
      method: 'get',
      url: `http://localhost:8080/events/${id}`
    }).catch(error => console.error(error))
    setEventData(eventResponse.data);

    setIsLoaded(true)
  }, [id])

  useEffect(() => {
    getEventData()
  }, [getEventData])

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
        <Grid item xl={2}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                  <Typography component="h2" variant="h5">
                    {"Details"}
                  </Typography>
                </Grid>
                <EventDetails eventData={ eventData }/>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item xl={10}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                  <Typography component="h2" variant="h5">
                    {"Tasks"}
                  </Typography>
                  <AddTaskModal label={"+Add task"} task={ null } eventData={ eventData } refresh={ getEventData }/>
                </Grid>
                <TaskTable tasks={ eventData.Tasks }/>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item className={classes.eventBox} xl={12}>
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                  <Typography component="h2" variant="h5">
                    {"Notes"}
                  </Typography>
                  <AddNoteModal eventData={ eventData } refresh={ getEventData }/>
                </Grid>
                <EventNotes notes={ eventData.Notes } />
              </CardContent>
            </div>
          </Card>
        </Grid>
      </Grid>
    }
    </Container>
  )
}