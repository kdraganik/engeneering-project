import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, CircularProgress } from "@material-ui/core"
import { makeStyles } from "@material-ui/core"
import UsersTable from '../components/UsersTable'
import TeamsTable from "../components/TeamsTable";
import EventsTable from "../components/EventsTable";
import AddUserModal from "../components/AddUserModal";
import AddTeamModal from "../components/AddTeamModal";
import AddEventModal from "../components/AddEventModal";

const useStyles = makeStyles({
  container:{
    padding: '25px',
  },
  loaderGrid:{
    height: '85vh'
  },
  outerGrid:{
    marginBottom: '15px'
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

export default function Admin({ user, setTitle }){

  const updateTitle = () => setTitle("Panel administratora");
  useEffect( updateTitle );

  const classes = useStyles()
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState({});
  const [teams, setTeams] = useState({});
  const [events, setEvents] = useState({});

  const getAdminData = async () => {
    const userResponse = await axios({
      method: 'get',
      url: `http://localhost:8080/users`
    }).catch(error => console.error(error))
    setUsers(userResponse.data);
    
    const teamResponse = await axios({
      method: 'get',
      url: `http://localhost:8080/teams`
    }).catch(error => console.error(error))
    setTeams(teamResponse.data)

    const eventResponse = await axios({
      method: 'get',
      url: `http://localhost:8080/events`
    }).catch(error => console.error(error))
    setEvents(eventResponse.data)

    setIsLoaded(true)
  };

  useEffect(() => {
    getAdminData();
  }, [])

  return(
    <Container className={classes.container} maxWidth="xl">
      {
        !isLoaded ?
        <Grid className={classes.loaderGrid} container justifyContent="center" alignItems="center">
          <CircularProgress />
        </Grid>
        :
        <Grid>
          <Grid className={classes.outerGrid} >
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                    <Typography component="h2" variant="h5">
                      Użytkownicy
                    </Typography>
                    <AddUserModal getAdminData={ getAdminData }/>
                  </Grid>
                  <UsersTable user={ user } users={ users } refresh={getAdminData}/>
                </CardContent>
              </div>
            </Card>
          </Grid>
          <Grid className={classes.outerGrid}>
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                    <Typography component="h2" variant="h5">
                      Zespoły
                    </Typography>
                    <AddTeamModal getAdminData={ getAdminData }/>
                  </Grid>
                  <TeamsTable teams={ teams } users={ users } refresh={getAdminData}/>
                </CardContent>
              </div>
            </Card>
          </Grid>
          <Grid className={classes.outerGrid}>
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Grid className={classes.gridTop} container direction="row" alignItems="center" justifyContent="space-between">
                    <Typography component="h2" variant="h5">
                      Wydarzenia
                    </Typography>
                    <AddEventModal getAdminData={getAdminData} />
                  </Grid>
                  <EventsTable events={ events } teams={ teams } refresh={getAdminData}/>
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
      }
    </Container>
  )
}